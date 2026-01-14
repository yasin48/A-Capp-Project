// File upload utilities for AWS S3 and Cloudinary
import { S3 } from 'aws-sdk';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export interface UploadResult {
  url: string;
  publicId?: string;
  key?: string;
}

// Initialize Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Initialize AWS S3
let s3: S3 | null = null;
if (process.env.AWS_ACCESS_KEY_ID) {
  s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
  });
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: Buffer | Readable,
  folder: string = 'product-auth'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    if (Buffer.isBuffer(file)) {
      uploadStream.end(file);
    } else {
      file.pipe(uploadStream);
    }
  });
}

/**
 * Upload file to AWS S3
 */
export async function uploadToS3(
  file: Buffer,
  filename: string,
  folder: string = 'product-auth'
): Promise<UploadResult> {
  if (!s3) {
    throw new Error('AWS S3 not configured');
  }

  const key = `${folder}/${Date.now()}-${filename}`;
  const bucket = process.env.AWS_S3_BUCKET;

  if (!bucket) {
    throw new Error('AWS_S3_BUCKET not configured');
  }

  const params: S3.PutObjectRequest = {
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: 'image/jpeg', // Adjust based on file type
    ACL: 'public-read',
  };

  await s3.putObject(params).promise();

  const url = `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

  return {
    url,
    key,
  };
}

/**
 * Upload file (automatically chooses storage based on config)
 */
export async function uploadFile(
  file: Buffer | Readable,
  filename: string,
  folder: string = 'product-auth'
): Promise<UploadResult> {
  // Prefer Cloudinary if configured
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    return uploadToCloudinary(file, folder);
  }

  // Fall back to S3
  if (s3 && process.env.AWS_S3_BUCKET) {
    if (Buffer.isBuffer(file)) {
      return uploadToS3(file, filename, folder);
    } else {
      // Convert stream to buffer for S3
      const chunks: Buffer[] = [];
      return new Promise((resolve, reject) => {
        file.on('data', (chunk) => chunks.push(chunk));
        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          uploadToS3(buffer, filename, folder).then(resolve).catch(reject);
        });
        file.on('error', reject);
      });
    }
  }

  throw new Error('No file storage configured. Set up Cloudinary or AWS S3.');
}
