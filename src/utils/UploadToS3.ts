import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import sharp from "sharp";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NotFoundError } from "./Error";
import { MESSAGES } from "./Constant";
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_REGION!,
});
export const uploadToS3 = async (
  name: string,
  image: any,
  contentType: any,
  height: number = 1024,
  width: number = 1024
) => {
  const compressedImage = await sharp(image)
    .resize({
      width,
      height,
      fit: "contain",
    })
    .toFormat("webp")
    .toBuffer();
  const generateRandomName = (byteLength = 32) => {
    const randomBytes = crypto.randomBytes(byteLength);
    return randomBytes.toString("hex");
  };
  const randomImageName = generateRandomName();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: randomImageName,
    Body: compressedImage,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return randomImageName;
  } catch (error) {
    throw error;
  }
};
export const getImage = async (name: string) => {
  if (!name) return new NotFoundError(MESSAGES.IMAGE_NOT_FOUND);
  const getObjParam = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: name,
  };
  const command = new GetObjectCommand(getObjParam);
  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 * 7 });
  if (url) {
    return url;
  }
};

export const uploadCompressedImageToS3 = async (
  name: string,
  image: any,
  contentType: any,
  aspectRatio: boolean = false
) => {
  const targetFileSize = 1024;

  let compressedImageBuffer = await sharp(image)
    .resize(
      aspectRatio
        ? { width: 89, height: 89, fit: "contain" }
        : {
            width: 89,
            height: 51,
            fit: "contain",
          }
    )
    .toFormat("webp")
    .toBuffer({ resolveWithObject: true });

  let quality = 20;
  while (compressedImageBuffer.info.size > targetFileSize && quality >= 10) {
    compressedImageBuffer = await sharp(image)
      .resize({
        width: Math.max(
          4,
          Math.floor(
            (compressedImageBuffer.info.width * targetFileSize) /
              compressedImageBuffer.info.size
          )
        ),
        height: Math.max(
          4,
          Math.floor(
            (compressedImageBuffer.info.height * targetFileSize) /
              compressedImageBuffer.info.size
          )
        ),
        fit: "contain",
      })
      .webp({ quality })
      .toBuffer({ resolveWithObject: true });
    quality -= 10;
  }

  const generateRandomName = (byteLength = 32) => {
    const randomBytes = crypto.randomBytes(byteLength);
    return randomBytes.toString("hex");
  };

  const randomImageName = generateRandomName();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: randomImageName,
    Body: compressedImageBuffer.data,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return randomImageName;
  } catch (error) {
    throw error;
  }
};
export const deleteImageFromS3 = async (name: string) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: name,
  };
  try {
    await s3.send(new DeleteObjectCommand(params));
  } catch (error) {
    throw error;
  }
};
