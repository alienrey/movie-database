import dotenv from 'dotenv'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
dotenv.config()

const bucketName = process.env.BUCKET_NAME as string
const bucketRegion = process.env.BUCKET_REGION as string
const accessKey = process.env.BUCKET_ACCESS_KEY as string
const secretKey = process.env.BUCKET_SECRET_KEY as string
const bucketEndpoint = process.env.BUCKET_ENDPOINT as string

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  }
})

export {
    s3,
    bucketName,
    bucketEndpoint
}
