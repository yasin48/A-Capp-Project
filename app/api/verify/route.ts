// API Route: Public verification (Step 5 - Public Verification)
import { NextRequest, NextResponse } from 'next/server';
import { getPostgreSQLPool } from '@/lib/database/connection';
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

    const pool = getPostgreSQLPool();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 500 }
      );
    }

    let certificateHash = hash;
    let certificate: any = null;

    // If productId provided, get certificate
    if (productId && !hash) {
      const certResult = await pool.query(
        'SELECT * FROM certificates WHERE product_id = $1 ORDER BY created_at DESC LIMIT 1',
        [productId]
      );

      if (certResult.rows.length === 0) {
        return NextResponse.json({
          success: true,
          data: {
            verified: false,
            exists: false,
            message: 'No certificate found for this product',
          },
        });
      }

      certificate = certResult.rows[0];
      certificateHash = certificate.hash;
    } else if (hash) {
      // Get certificate by hash
      const certResult = await pool.query(
        'SELECT * FROM certificates WHERE hash = $1',
        [hash]
      );

      if (certResult.rows.length > 0) {
        certificate = certResult.rows[0];
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
    const recordResult = await pool.query(
      'SELECT * FROM blockchain_records WHERE hash = $1 ORDER BY created_at DESC LIMIT 1',
      [certificateHash]
    );

    return NextResponse.json({
      success: true,
      data: {
        verified: blockchainResult.exists && (certificate ? hashMatches : true),
        exists: blockchainResult.exists,
        productId: blockchainResult.productId,
        timestamp: blockchainResult.timestamp,
        certificate: certificate
          ? {
              productId: certificate.product_id,
              decision: certificate.authentication_decision,
              timestamp: certificate.timestamp,
              reason: certificate.reason,
            }
          : null,
        blockchainRecord: recordResult.rows.length > 0
          ? {
              txHash: recordResult.rows[0].tx_hash,
              blockNumber: recordResult.rows[0].block_number,
              network: recordResult.rows[0].network,
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
