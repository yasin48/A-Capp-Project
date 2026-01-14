// API Route: Store hash on blockchain (Step 4 - Blockchain Layer)
import { NextRequest, NextResponse } from 'next/server';
import { getPostgreSQLPool } from '@/lib/database/connection';
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

    const pool = getPostgreSQLPool();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 500 }
      );
    }

    // Get certificate
    const certResult = await pool.query(
      'SELECT * FROM certificates WHERE id = $1',
      [certificateId]
    );

    if (certResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    const certificate = certResult.rows[0];

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
    await pool.query(
      `UPDATE certificates 
       SET blockchain_tx_hash = $1, blockchain_block_number = $2
       WHERE id = $3`,
      [result.txHash, result.blockNumber, certificateId]
    );

    // Create blockchain record
    const recordId = uuidv4();
    await pool.query(
      `INSERT INTO blockchain_records (
        id, certificate_id, product_id, hash, tx_hash, block_number, network, contract_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        recordId,
        certificateId,
        productId,
        certificate.hash,
        result.txHash,
        result.blockNumber,
        process.env.BLOCKCHAIN_NETWORK || 'polygon-mumbai',
        process.env.CONTRACT_ADDRESS || '',
      ]
    );

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
