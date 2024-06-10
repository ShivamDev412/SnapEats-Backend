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
  contentType: any
) => {
  const compressedImage = await sharp(image)
    .resize({
      // width: 1920,
      // height: 1080,
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
  contentType: any
) => {
  const targetFileSize = 50 * 1024;

  let compressedImageBuffer = await sharp(image)
    .resize({
      width: 89,
      height: 51,
      fit: "fill",
    })
    .toFormat("webp")
    .toBuffer({ resolveWithObject: true });

  let quality = 90;
  while (compressedImageBuffer.info.size > targetFileSize && quality >= 10) {
    compressedImageBuffer = await sharp(image)
      .resize({
        width: 4,
        height: 4,
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
