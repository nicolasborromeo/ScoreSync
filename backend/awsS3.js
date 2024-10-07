const AWS = require("aws-sdk");
const multer = require("multer");
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const NAME_OF_BUCKET = "my-score-sync-bucket";

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: "us-west-1"
// })

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

const singleFileUpload = async ({ file, public = false, username }) => {
    const { originalname, buffer } = file;
    const path = require('path');
    //using data in miliseconds to name the file in my S3 bucker + the extension name
    // const Key = new Date().getTime().toString() + path.extname(originalname);
    const Key = new Date().getTime().toString() + originalname

    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key: username ? `${username}/${Key}` : Key,
        Body: buffer
    }
    const result = await s3.upload(uploadParams).promise()
    // Return the link if public. If private, return the name of the file in your
    // S3 bucket as the key in your database for subsequent retrieval.
    return username ? { url: result['Location'], title: originalname } : result.Key;
}


const multipleFilesUpload = async ({ files, public = false, username }) => {
    return await Promise.all(
        files.map((file) => {
            return singleFileUpload({ file, public, username })
        })
    )
}

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
    deleteFile
};
