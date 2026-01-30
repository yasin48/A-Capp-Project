// API Route: Store certificate on blockchain
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getContractInstance } from '@/lib/blockchain/contract';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificateId, productId } = body;

    if (!certificateId || !productId) {
      return NextResponse.json(
        { success: false, error: 'Certificate ID and Product ID required' },
        { status: 400 }
      );
    }

    // Get certificate
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

    if (certError || !certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Store hash on blockchain
    const contract = getContractInstance();
    const result = await contract.storeHash(certificate.hash, productId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to store on blockchain' },
        { status: 500 }
      );
    }

    // Update certificate with blockchain info
    const { error: updateCertError } = await supabase
      .from('certificates')
      .update({
        blockchain_tx_hash: result.txHash,
        blockchain_block_number: result.blockNumber,
      })
      .eq('id', certificateId);

    if (updateCertError) {
      console.error('Error updating certificate:', updateCertError);
      return NextResponse.json(
        { success: false, error: 'Failed to update certificate with blockchain info' },
        { status: 500 }
      );
    }

    // Create blockchain record
    const recordId = uuidv4();
    const { error: recordError } = await supabase.from('blockchain_records').insert({
      id: recordId,
      certificate_id: certificateId,
      product_id: productId,
      hash: certificate.hash,
      tx_hash: result.txHash,
      block_number: result.blockNumber,
      network: process.env.BLOCKCHAIN_NETWORK || 'polygon-mumbai',
      contract_address: process.env.CONTRACT_ADDRESS || '',
      created_at: new Date().toISOString(),
    });

    if (recordError) {
      console.error('Error creating blockchain record:', recordError);
      return NextResponse.json(
        { success: false, error: 'Failed to create blockchain record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        hash: certificate.hash,
        gasUsed: result.gasUsed,
      },
    });
  } catch (error: any) {
    console.error('Error storing on blockchain:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to store on blockchain' },
      { status: 500 }
    );
  }
}
