import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID as string;
const accessKeyId = process.env.R2_ACCESS_KEY as string;
const secretAccessKey = process.env.R2_SECRET_KEY as string;
const bucketName = process.env.R2_BUCKET_NAME as string;

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export { s3Client, bucketName };

export const uploadImage = async ({
  file,
  fileName,
}: {
  fileName: string;
  file: Buffer;
}) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: "image/webp",
    }),
  );
};

export const deleteImage = async ({ fileName }: { fileName: string }) => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    }),
  );
};
