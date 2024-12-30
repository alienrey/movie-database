import dotenv from 'dotenv'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.BUCKET_ACCESS_KEY
const secretKey = process.env.BUCKET_SECRET_KEY

const s3 = new S3Client({
  region: bucketRegion as string,
  credentials: {
    accessKeyId: accessKey as string,
    secretAccessKey: secretKey as string
  }
})

export {
    s3,
    bucketName
}
