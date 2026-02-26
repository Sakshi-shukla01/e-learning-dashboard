import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

export async function getSignedDownloadUrl(key) {
  const s3 = new S3Client({
    region: requireEnv("AWS_REGION"),
    credentials: {
      accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
    },
  });

  const cmd = new GetObjectCommand({
    Bucket: requireEnv("S3_BUCKET"),
    Key: key,
  });

  return await getSignedUrl(s3, cmd, { expiresIn: 60 });
}