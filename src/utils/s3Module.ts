// src/utils/s3Module.ts

import AWS from "aws-sdk";

const { S3_ID, S3_PRIVATE } = process.env;

const s3 = new AWS.S3({
  accessKeyId: S3_ID,
  secretAccessKey: S3_PRIVATE,
  endpoint: "https://storage.yandexcloud.net",
  region: "ru-central1",
  s3ForcePathStyle: true,
});

export interface File {
  filename: string;
  content: Buffer | string;
}

export interface UploadData {
  ETag: string;
  Location: string;
  Bucket: string;
  Key: string;
  VersionId?: string;
}

export const uploadFiles = async (files: File[]): Promise<UploadData[]> => {
  return Promise.all(
    files.map((file) => {
      const uploadParams = {
        Bucket: "pinpictures",
        Key: file.filename,
        Body: file.content,
        ACL: "public-read",
      };

      return s3.upload(uploadParams).promise();
    })
  );
};

export const deleteFiles = async (paths: string[]): Promise<void> => {
  const deletePromises = paths.map((path) => {
    const deleteParams = {
      Bucket: "pinpictures",
      Key: path,
    };

    return s3
      .deleteObject(deleteParams)
      .promise()
      .catch((err) => {
        console.error(`Error deleting file ${path}:`, err);
      });
  });

  await Promise.all(deletePromises);
};
