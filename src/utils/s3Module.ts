const aws = require('aws-sdk');
const { env } = require('process');

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_PRIVATE,
    endpoint: "https://storage.yandexcloud.net",
    region: "ru-central1",
    s3ForcePathStyle: true,
});

const uploadFiles = function uploadFiles(files) {
    return Promise.all(files.map(file => {
        const uploadParams = {
            Bucket: 'pinpictures',
            Key: file.filename,
            Body: file.content,
        };

        return s3.upload(uploadParams).promise()
            .then(data => {
                return data;
            })
            .catch(err => {
                throw err;
            });
    }));
};
const deleteFiles = function deleteFiles(paths) {
    paths.forEach(path => {
        const deleteParams = {
            Bucket: 'pinpictures',
            Key: path
        };

        console.log(deleteParams);
        s3.deleteObject(deleteParams, function(err, data) {
            if (err) {
            } else {
            }
        });
    });
    
}

module.exports = { uploadFiles, deleteFiles }