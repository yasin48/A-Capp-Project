// API Route: Product Submission (Step 1 - Ingestion)
import { NextRequest, NextResponse } from 'next/server';
import { getPostgreSQLPool } from '@/lib/database/connection';
import { uploadFile } from '@/lib/storage/upload';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const serialNumber = formData.get('serialNumber') as string;
    const brand = formData.get('brand') as string;
    const productName = formData.get('productName') as string;
    const description = formData.get('description') as string;
    const userId = formData.get('userId') as string; // In real app, get from JWT

    if (!serialNumber || !brand || !productName || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload images
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadFile(buffer, file.name, 'product-images');
        imageUrls.push(result.url);
      }
    }

    // Store in database
    const pool = getPostgreSQLPool();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 500 }
      );
    }

    const productId = uuidv4();
    const result = await pool.query(
      `INSERT INTO products (id, user_id, serial_number, brand, product_name, description, images, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, status, submitted_at`,
      [
        productId,
        userId,
        serialNumber,
        brand,
        productName,
        description || null,
        imageUrls,
        'pending',
        new Date(),
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        productId: result.rows[0].id,
        status: result.rows[0].status,
        submittedAt: result.rows[0].submitted_at,
        imageUrls,
      },
    });
  } catch (error: any) {
    console.error('Error submitting product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit product' },
      { status: 500 }
    );
  }
}
