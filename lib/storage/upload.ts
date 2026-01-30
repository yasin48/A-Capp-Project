// File upload utilities for Supabase Storage
import { supabase } from '@/lib/database/connection';

export interface UploadResult {
  url: string;
  publicId?: string;
  key?: string;
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Validate file before upload
 */
function validateFile(file: Buffer, filename: string, mimeType?: string): void {
  // Check file size
  if (file.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check file type (if mimeType provided)
  if (mimeType && !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error(`File type not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
  }

  // Check file extension as fallback
  const extension = filename.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  if (extension && !allowedExtensions.includes(extension)) {
    throw new Error(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
  }
}

/**
 * Get MIME type from filename
 */
function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return mimeTypes[extension || ''] || 'image/jpeg';
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: Buffer,
  filename: string,
  folder: string = 'product-images'
): Promise<UploadResult> {
  try {
    // Validate file
    const mimeType = getMimeType(filename);
    validateFile(file, filename, mimeType);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${timestamp}-${sanitizedFilename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        contentType: mimeType,
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    if (!data) {
      throw new Error('Upload failed: No data returned');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    return {
      url: urlData.publicUrl,
      key: data.path,
      publicId: data.path,
    };
  } catch (error: any) {
    console.error('Error uploading file to Supabase Storage:', error);
    throw error;
  }
}
