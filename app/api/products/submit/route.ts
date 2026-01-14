// API Route: Product Submission (Step 1 - Ingestion)
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { uploadFile } from '@/lib/storage/upload';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    const productId = uuidv4();

    // Store in database via Supabase
    const { data, error } = await supabase
      .from('products')
      .insert({
        id: productId,
        user_id: userId,
        serial_number: serialNumber,
        brand,
        product_name: productName,
        description: description || null,
        images: imageUrls,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select('id, status, submitted_at')
      .single();

    if (error) {
      console.error('Error inserting product:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        productId: data.id,
        status: data.status,
        submittedAt: data.submitted_at,
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
