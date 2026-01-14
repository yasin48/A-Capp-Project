// API Route: Create digital certificate (Step 3 - Certificate Creation)
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { generateHash } from '@/lib/blockchain/hash';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID required' },
        { status: 400 }
      );
    }

    // Get product and latest verification data for an authenticated product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(
        `
          id,
          serial_number,
          brand,
          product_name,
          status,
          verifications!inner (
            id,
            decision,
            notes,
            verified_at
          )
        `
      )
      .eq('id', productId)
      .eq('status', 'authentic')
      .order('verified_at', { referencedTable: 'verifications', ascending: false })
      .limit(1)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not authenticated' },
        { status: 404 }
      );
    }

    const verification = product.verifications?.[0] || product.verifications;

    // Create certificate JSON
    const certificateData = {
      productId: product.id,
      authenticationDecision: verification?.decision || 'authentic',
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      reason: verification?.notes || 'Product verified as authentic',
      notes: verification?.notes,
      productData: {
        productId: product.id,
        serialNumber: product.serial_number,
        brand: product.brand,
        productName: product.product_name,
      },
    };

    const jsonData = JSON.stringify(certificateData, null, 2);
    const hash = generateHash(jsonData);

    // Store certificate
    const certificateId = uuidv4();
    const { error: insertError } = await supabase.from('certificates').insert({
      id: certificateId,
      product_id: product.id,
      verification_id: verification?.id || null,
      product_data: certificateData.productData,
      authentication_decision: certificateData.authenticationDecision,
      timestamp: certificateData.timestamp,
      reason: certificateData.reason,
      notes: certificateData.notes,
      json_data: jsonData,
      hash,
    });

    if (insertError) {
      console.error('Error inserting certificate:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to save certificate' },
        { status: 500 }
      );
    }

    // Update product status to certified
    const { error: updateError } = await supabase
      .from('products')
      .update({
        status: 'certified',
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product status:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update product status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        certificateId,
        productId,
        hash,
        certificateData,
        jsonData,
      },
    });
  } catch (error: any) {
    console.error('Error creating certificate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create certificate' },
      { status: 500 }
    );
  }
}
