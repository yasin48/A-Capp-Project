// API Route: Create digital certificate (Step 3 - Certificate Creation)
import { NextRequest, NextResponse } from 'next/server';
import { getPostgreSQLPool } from '@/lib/database/connection';
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

    const pool = getPostgreSQLPool();
    if (!pool) {
      return NextResponse.json(
        { success: false, error: 'Database not connected' },
        { status: 500 }
      );
    }

    // Get product and verification data
    const productResult = await pool.query(
      `SELECT p.*, v.id as verification_id, v.decision, v.notes, v.verified_at
       FROM products p
       JOIN verifications v ON p.id = v.product_id
       WHERE p.id = $1 AND p.status = 'authentic'`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not authenticated' },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];

    // Create certificate JSON
    const certificateData = {
      productId: product.id,
      authenticationDecision: product.decision,
      timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      reason: product.notes || 'Product verified as authentic',
      notes: product.notes,
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
    await pool.query(
      `INSERT INTO certificates (
        id, product_id, verification_id, product_data, authentication_decision,
        timestamp, reason, notes, json_data, hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        certificateId,
        product.id,
        product.verification_id,
        JSON.stringify(certificateData.productData),
        certificateData.authenticationDecision,
        certificateData.timestamp,
        certificateData.reason,
        certificateData.notes,
        jsonData,
        hash,
      ]
    );

    // Update product status to certified
    await pool.query(
      `UPDATE products SET status = 'certified', updated_at = $1 WHERE id = $2`,
      [new Date(), productId]
    );

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
