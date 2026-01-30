// API Route: Verify product authenticity by serial number
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getContractInstance } from '@/lib/blockchain/contract';
import { verifyHash } from '@/lib/blockchain/hash';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    const productId = searchParams.get('productId');

    if (!hash && !productId) {
      return NextResponse.json(
        { success: false, error: 'Hash or Product ID required' },
        { status: 400 }
      );
    }

    let certificateHash = hash;
    let certificate: any = null;

    // If productId provided, get certificate
    if (productId && !hash) {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching certificate by productId:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch certificate' },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json({
          success: true,
          data: {
            verified: false,
            exists: false,
            message: 'No certificate found for this product',
          },
        });
      }

      certificate = data;
      certificateHash = certificate.hash;
    } else if (hash) {
      // Get certificate by hash
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('hash', hash)
        .maybeSingle();

      if (error) {
        console.error('Error fetching certificate by hash:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch certificate' },
          { status: 500 }
        );
      }

      if (data) {
        certificate = data;
      }
    }

    if (!certificateHash) {
      return NextResponse.json(
        { success: false, error: 'Unable to determine hash' },
        { status: 400 }
      );
    }

    // Verify on blockchain
    const contract = getContractInstance();
    const blockchainResult = await contract.verifyHash(certificateHash);

    if (!blockchainResult.exists) {
      return NextResponse.json({
        success: true,
        data: {
          verified: false,
          exists: false,
          message: 'Hash not found on blockchain',
        },
      });
    }

    // If we have certificate, verify hash matches
    let hashMatches = false;
    if (certificate) {
      hashMatches = verifyHash(certificate.json_data, certificateHash);
    }

    // Get blockchain record
    const { data: record, error: recordError } = await supabase
      .from('blockchain_records')
      .select('*')
      .eq('hash', certificateHash)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recordError) {
      console.error('Error fetching blockchain record:', recordError);
    }

    return NextResponse.json({
      success: true,
      data: {
        verified: blockchainResult.exists && (certificate ? hashMatches : true),
        exists: blockchainResult.exists,
        productId: certificate?.product_id ?? blockchainResult.productId,
        timestamp: blockchainResult.timestamp,
        certificate: certificate
          ? {
            productId: certificate.product_id,
            decision: certificate.authentication_decision,
            timestamp: certificate.timestamp,
            reason: certificate.reason,
          }
          : null,
        blockchainRecord: record
          ? {
            txHash: record.tx_hash,
            blockNumber: record.block_number,
            network: record.network,
          }
          : null,
      },
    });
  } catch (error: any) {
    console.error('Error verifying:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify' },
      { status: 500 }
    );
  }
}
