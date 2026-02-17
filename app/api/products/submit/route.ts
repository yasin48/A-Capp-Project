// API Route: Submit a product for authentication
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { uploadFile } from '@/lib/storage/upload';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const serialNumber = formData.get('serialNumber') as string;
    const brand = formData.get('brand') as string;
    const productName = formData.get('productName') as string;
    const description = formData.get('description') as string;

    if (!serialNumber || !brand || !productName) {
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

    const productId = uuidv4();
    const now = new Date().toISOString();

    const insertPayload = {
      id: productId,
      user_id: user.id,
      serial_number: serialNumber,
      brand,
      product_name: productName,
      description: description || null,
      images: imageUrls,
      status: 'pending',
      created_at: now,
      submitted_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single();

    console.log('═══════════════════════════════════');
    console.log('═══════ PRODUCT SUBMISSION ════════');
    console.log('═══════════════════════════════════');
    if (error) {
      console.log('❌ INSERT FAILED');
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Error details:', error.details);
      console.log('Error hint:', error.hint);
      console.log('═══════════════════════════════════');
      return NextResponse.json(
        { success: false, error: 'Failed to save product' },
        { status: 500 }
      );
    }

    console.log('✅ INSERT SUCCEEDED');
    console.log('Product ID:', data?.id);
    console.log('User ID:', data?.user_id);
    console.log('Serial:', data?.serial_number);
    console.log('Brand:', data?.brand);
    console.log('Status:', data?.status);
    console.log('Created at:', data?.created_at);
    console.log('Submitted at:', data?.submitted_at);
    console.log('Updated at:', data?.updated_at);

    // CROSS-CHECK: Immediately query back to confirm it's readable
    const { data: verify, error: verifyError } = await supabase
      .from('products')
      .select('id, status, user_id, created_at')
      .eq('id', productId)
      .single();

    console.log('🔍 CROSS-CHECK read-back:', verify ? `Found! status=${verify.status}, user=${verify.user_id}, created=${verify.created_at}` : 'NOT FOUND!');
    if (verifyError) console.log('🔍 CROSS-CHECK error:', verifyError.message);
    console.log('═══════════════════════════════════');

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
