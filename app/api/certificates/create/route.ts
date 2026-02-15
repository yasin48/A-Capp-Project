// API Route: Create certificate for authenticated product
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { generateHash } from '@/lib/blockchain/hash';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Store hash on blockchain
    let blockchainResult: { success: boolean; txHash?: string; blockNumber?: number; error?: string } = { success: false };
    try {
      const { storeOnBlockchain } = await import('@/lib/blockchain/service');
      blockchainResult = await storeOnBlockchain(product.id, hash);

      if (blockchainResult.success && blockchainResult.txHash) {
        // Save blockchain record
        await supabase.from('blockchain_records').insert({
          id: uuidv4(),
          certificate_id: certificateId,
          product_id: product.id,
          hash,
          tx_hash: blockchainResult.txHash,
          block_number: blockchainResult.blockNumber || 0,
          network: 'polygon-amoy',
          contract_address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
        });

        // Update certificate with blockchain info
        await supabase.from('certificates')
          .update({
            blockchain_tx_hash: blockchainResult.txHash,
            blockchain_block_number: blockchainResult.blockNumber,
          })
          .eq('id', certificateId);
      }
    } catch (blockchainError: any) {
      console.error('Blockchain storage failed (non-blocking):', blockchainError.message);
      // Continue even if blockchain storage fails - certificate is still valid
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
        blockchain: blockchainResult.success ? {
          txHash: blockchainResult.txHash,
          blockNumber: blockchainResult.blockNumber,
          network: 'polygon-amoy',
        } : null,
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
