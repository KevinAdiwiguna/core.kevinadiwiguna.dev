"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3-client";

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const baseUrl = R2_PUBLIC_URL?.replace(/\/$/, "");

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return `${baseUrl}/${key}`;
  } catch (error) {
    console.error("R2_UPLOAD_ERROR:", error);
    throw new Error("FAILED_TO_UPLOAD_TO_R2");
  }
}
