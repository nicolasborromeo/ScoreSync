const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const NAME_OF_BUCKET = "my-score-sync-bucket";
const isProduction = process.env.NODE_ENV === 'production';
const LOCAL_MEDIA_ROOT = path.resolve(__dirname, 'media');
const LOCAL_MEDIA_URL_BASE = process.env.LOCAL_MEDIA_URL_BASE || 'http://127.0.0.1:8000/media';

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function safeName(name) {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function localUrlFor(key) {
    return `${LOCAL_MEDIA_URL_BASE}/${key.split(path.sep).join('/')}`;
}

async function writeLocalFile({ buffer, key }) {
    const fullPath = path.join(LOCAL_MEDIA_ROOT, key);
    ensureDir(path.dirname(fullPath));
    await fs.promises.writeFile(fullPath, buffer);
    return fullPath;
}

const deleteFile = async (key) => {
    if (!isProduction) {
        const fullPath = path.join(LOCAL_MEDIA_ROOT, key);
        try {
            await fs.promises.unlink(fullPath);
            return true;
        } catch (err) {
            if (err.code === 'ENOENT') return false;
            throw err;
        }
    }

    const params = {
        Bucket: NAME_OF_BUCKET,
        Key: key
    }
    try {
        await s3.headObject(params).promise()
        try {
            await s3.deleteObject(params).promise()
            return true
        }
        catch (err) {
            console.log("ERROR in file Deleting : " + JSON.stringify(err))
            return false
        }
    } catch (err) {
        console.log("File not Found ERROR : " + err.code)
        return false
    }
}

const singleFileUpload = async ({ file, username }) => {
    const { originalname, buffer } = file;

    const mmFunctions = await mm.loadMusicMetadata()
    const parse = mmFunctions.parseBuffer
    const metadata = await parse(buffer)
    const duration = metadata.format.duration

    if(!duration) {
        throw new Error(`Failed to upload ${originalname}`);
    }

    const Key = `${Date.now()}-${safeName(originalname)}`;

    if (!isProduction) {
        const key = username ? path.join(username, Key) : Key;
        await writeLocalFile({ buffer, key });
        return { url: localUrlFor(key), title: originalname, duration };
    }

    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key: username ? `${username}/${Key}` : Key,
        Body: buffer,
        ContentType: 'audio/wav',
    }

    const result = await s3.upload(uploadParams).promise()

    return username ? { url: result['Location'], title: originalname, duration: duration} : result.Key;
}

const multipleFilesUpload = async ({ files, username }) => {
    return await Promise.all(
        files.map((file) => singleFileUpload({ file, username }))
    )
}

const singleImageUpload = async ({ file, username }) => {
    const { originalname, buffer, mimetype } = file;

    const Key = `${Date.now()}-${safeName(originalname)}`;

    if (!isProduction) {
        const key = username ? path.join(username, 'images', Key) : Key;
        await writeLocalFile({ buffer, key });
        return { url: localUrlFor(key), name: originalname, key: Key };
    }

    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key: username ? `${username}/images/${Key}` : Key,
        Body: buffer,
        ContentType: mimetype,
    }
    const result = await s3.upload(uploadParams).promise()

    return username ? { url: result['Location'], name: originalname, key:Key} : result.Key;
}

const multipleImagesUpload = async ({ files, username }) => {
    return await Promise.all(
        files.map((file) => singleImageUpload({ file, username }))
    )
}

const retrievePrivateFile = (key) => {
    if (!key) return key;
    if (!isProduction) return localUrlFor(key);

    return s3.getSignedUrl("getObject", {
        Bucket: NAME_OF_BUCKET,
        Key: key
    });
}

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    },
});

const singleMulterUpload = (nameOfKey) =>
    multer({ storage: storage }).single(nameOfKey);
const multipleMulterUpload = (nameOfKey) =>
    multer({ storage: storage }).array(nameOfKey);

module.exports = {
    s3,
    singleFileUpload,
    multipleFilesUpload,
    retrievePrivateFile,
    singleMulterUpload,
    multipleMulterUpload,
    deleteFile,
    multipleImagesUpload,
    singleImageUpload
};
