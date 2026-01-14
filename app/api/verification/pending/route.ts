// API Route: Get pending products for verification
import { NextRequest, NextResponse } from 'next/server';
import { getPostgreSQLPool } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    const pool = getPostgreSQLPool();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 500 }
      );
    }

    const result = await pool.query(
      `SELECT p.*, u.email as user_email
       FROM products p
       JOIN users u ON p.user_id = u.id
       WHERE p.status = 'pending' OR p.status = 'under_review'
       ORDER BY p.submitted_at ASC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}
