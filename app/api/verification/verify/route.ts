// API Route: Verify product (Step 2 - Verification)
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { getAuthenticatedUser } from '@/lib/auth/getUser';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user (must be an authenticator)
    const { user, role, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (role !== 'authenticator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only authenticators can verify products.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, decision, notes, crossCheckResults } = body;

    if (!productId || !decision) {
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

    // Create verification record
    const verificationId = uuidv4();
    const { error: verificationError } = await supabase.from('verifications').insert({
      id: verificationId,
      product_id: productId,
      authenticator_id: user.id,
      decision,
      notes: notes || null,
      cross_check_results: crossCheckResults || null,
      verified_at: new Date().toISOString(),
    });

    if (verificationError) {
      console.error('Error inserting verification:', verificationError);
      return NextResponse.json(
        { success: false, error: 'Failed to create verification record' },
        { status: 500 }
      );
    }

    // Update product status
    const newStatus = decision === 'authentic' ? 'authentic' : 'not_authentic';
    const { error: updateError } = await supabase
      .from('products')
      .update({
        status: newStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update product status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        verificationId,
        productId,
        decision,
        status: newStatus,
      },
    });
  } catch (error: any) {
    console.error('Error verifying product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify product' },
      { status: 500 }
    );
  }
}
