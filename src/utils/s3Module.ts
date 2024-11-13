import * as aws from "aws-sdk";
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const { env } = require("process");

// Set up AWS S3 client
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ID,
  secretAccessKey: process.env.S3_PRIVATE,
  endpoint: "https://storage.yandexcloud.net",
  region: "ru-central1",
  s3ForcePathStyle: true,
});

// Define the type for the file object
interface File {
  filename: string;
  content: Buffer | string;  // Content can be a buffer or string
}

interface UploadData {
  ETag: string;
  Location: string;
  Bucket: string;
  Key: string;
  VersionId?: string;
}

// Typing the uploadFiles function
const uploadFiles = function uploadFiles(files: File[]): Promise<UploadData[]> {
  return Promise.all(
    files.map((file) => {
      const uploadParams = {
        Bucket: "pinpictures",
        Key: file.filename,
        Body: file.content,
      };

      return s3
        .upload(uploadParams)
        .promise()
        .then((data: UploadData) => {
          return data;
        })
        .catch((err: Error) => {
          throw err;
        });
    })
  );
};

// Typing the deleteFiles function
const deleteFiles = function deleteFiles(paths: string[]): void {
  paths.forEach((path) => {
    const deleteParams = {
      Bucket: "pinpictures",
      Key: path,
    };

    s3.deleteObject(deleteParams, function (err: Error, data: aws.S3.DeleteObjectOutput) {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully:", data);
      }
    });
  });
};

module.exports = { uploadFiles, deleteFiles };
