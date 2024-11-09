const AWS = require("aws-sdk");
const multer = require("multer");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const NAME_OF_BUCKET = "my-score-sync-bucket";
const mm = require('music-metadata');


const deleteFile = async (key) => {
    const params = {
        Bucket: NAME_OF_BUCKET,
        Key: key
    }
    try {
        await s3.headObject(params).promise()
        console.log("File Found in S3")
        try {
            await s3.deleteObject(params).promise()
            console.log("file deleted Successfully")
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


    const Key = new Date().getTime().toString() + originalname

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
        files.map((file) => {
            return singleFileUpload({ file, username })
        })
    )
}


// FOR IMAGES

const singleImageUpload = async ({ file, username }) => {
    const { originalname, buffer } = file;

    const Key = new Date().getTime().toString() + originalname

    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key: username ? `${username}/images/${Key}` : Key,
        Body: buffer,
    }
    const result = await s3.upload(uploadParams).promise()

    return username ? { url: result['Location'], name: originalname, key:Key} : result.Key;
}



const multipleImagesUpload = async ({ files, username }) => {
    return await Promise.all(
        files.map((file) => {
            return singleImageUpload({ file, username })
        })
    )
}


//end aws for images

const retrievePrivateFile = (key) => {
    let fileUrl;
    if (key) {
        fileUrl = s3.getSignedUrl("getObject", {
            Bucket: NAME_OF_BUCKET,
            Key: key
        });
    }
    return fileUrl || key;
}

//Multer setup
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
