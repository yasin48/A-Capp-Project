// API Route: Verify product (Step 2 - Verification)
import { NextRequest, NextResponse } from 'next/server';
import { getPostgreSQLPool } from '@/lib/database/connection';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, authenticatorId, decision, notes, crossCheckResults } = body;

    if (!productId || !authenticatorId || !decision) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (decision !== 'authentic' && decision !== 'not_authentic') {
      return NextResponse.json(
        { success: false, error: 'Invalid decision. Must be "authentic" or "not_authentic"' },
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

    // Start transaction
    await pool.query('BEGIN');

    try {
      // Create verification record
      const verificationId = uuidv4();
      await pool.query(
        `INSERT INTO verifications (id, product_id, authenticator_id, decision, notes, cross_check_results, verified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          verificationId,
          productId,
          authenticatorId,
          decision,
          notes || null,
          crossCheckResults ? JSON.stringify(crossCheckResults) : null,
          new Date(),
        ]
      );

      // Update product status
      const newStatus = decision === 'authentic' ? 'authentic' : 'not_authentic';
      await pool.query(
        `UPDATE products 
         SET status = $1, reviewed_at = $2, reviewed_by = $3, updated_at = $4
         WHERE id = $5`,
        [newStatus, new Date(), authenticatorId, new Date(), productId]
      );

      await pool.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: {
          verificationId,
          productId,
          decision,
          status: newStatus,
        },
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error: any) {
    console.error('Error verifying product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify product' },
      { status: 500 }
    );
  }
}
