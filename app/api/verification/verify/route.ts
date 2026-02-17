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
    const insertData = {
      id: verificationId,
      product_id: productId,
      authenticator_id: user.id,
      decision,
      notes: notes || null,
      cross_check_results: crossCheckResults || null,
      verified_at: new Date().toISOString(),
    };

    console.log('Attempting to insert verification:', JSON.stringify(insertData, null, 2));

    const { error: verificationError } = await supabase.from('verifications').insert(insertData);

    if (verificationError) {
      console.error('Error inserting verification:', {
        code: verificationError.code,
        message: verificationError.message,
        details: verificationError.details,
        hint: verificationError.hint,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Failed to create verification record: ${verificationError.message}`,
          details: verificationError.hint || verificationError.details,
        },
        { status: 500 }
      );
    }

    // Update product status
    const newStatus = decision === 'authentic' ? 'authentic' : 'not_authentic';
    const updateData = {
      status: newStatus,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      updated_at: new Date().toISOString(),
    };

    console.log('Attempting to update product:', productId, 'to status:', newStatus);

    const { data: updateResult, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select();

    console.log('Product update result:', { updated: updateResult?.length, error: updateError?.message });

    if (updateError) {
      console.error('Product update error:', {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Failed to update product status: ${updateError.message}`,
          details: updateError.hint || updateError.details,
        },
        { status: 500 }
      );
    }

    // Verify the update actually took effect (RLS may silently block)
    if (!updateResult || updateResult.length === 0) {
      console.warn('Product update returned 0 rows - RLS may be blocking. Checking current status...');
      const { data: checkProduct } = await supabase
        .from('products')
        .select('id, status')
        .eq('id', productId)
        .single();
      console.log('Current product status after update attempt:', checkProduct?.status);

      if (checkProduct && checkProduct.status !== newStatus) {
        console.error('CONFIRMED: Update was blocked by RLS. Product status is still:', checkProduct.status);
        return NextResponse.json(
          {
            success: false,
            error: 'Product update blocked by database policy. Contact admin.',
          },
          { status: 403 }
        );
      }
    }

    // If product is verified as authentic, auto-create certificate and store on blockchain
    let certificateResult: any = null;
    let blockchainResult: any = null;

    if (decision === 'authentic') {
      // Step 1: Generate hash
      const { generateHash } = await import('@/lib/blockchain/hash');

      const certificateData = {
        productId: productId,
        authenticationDecision: 'authentic',
        timestamp: new Date().toISOString(),
        notes: notes || 'Product verified as authentic',
      };

      const jsonData = JSON.stringify(certificateData, null, 2);
      const hash = generateHash(jsonData);
      const certificateId = uuidv4();

      console.log('🔐 Generated hash:', hash);

      // Step 2: Try to create certificate (non-blocking)
      try {
        const { error: certError } = await supabase.from('certificates').insert({
          id: certificateId,
          product_id: productId,
          hash,
        });

        if (certError) {
          console.error('⚠️ Certificate insert failed:', certError.message, certError.hint || '');
        } else {
          certificateResult = { certificateId, hash };
          console.log('✅ Certificate created:', certificateId);
        }
      } catch (certErr: any) {
        console.error('⚠️ Certificate error:', certErr.message);
      }

      // Step 3: Store on blockchain (always attempt, independent of certificate)
      try {
        console.log('⛓️ Attempting blockchain storage...');
        const { storeOnBlockchain } = await import('@/lib/blockchain/service');
        const bcResult = await storeOnBlockchain(productId, hash);

        console.log('⛓️ Blockchain result:', JSON.stringify(bcResult));

        if (bcResult.success && bcResult.txHash) {
          blockchainResult = {
            txHash: bcResult.txHash,
            blockNumber: bcResult.blockNumber,
            network: 'polygon-amoy',
          };

          // Save blockchain record
          const { error: bcDbError } = await supabase.from('blockchain_records').insert({
            id: uuidv4(),
            product_id: productId,
            hash,
            tx_hash: bcResult.txHash,
            block_number: bcResult.blockNumber || 0,
            network: 'polygon-amoy',
            contract_address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
          });

          if (bcDbError) {
            console.error('⚠️ blockchain_records insert failed:', bcDbError.message, bcDbError.hint || '');
          } else {
            console.log('✅ Blockchain record saved to DB');
          }

          // Update product status to certified
          await supabase.from('products')
            .update({ status: 'certified' })
            .eq('id', productId);

          console.log('✅ Blockchain storage successful:', bcResult.txHash);
        } else {
          console.error('❌ Blockchain storage failed:', bcResult.error || 'Unknown error');
        }
      } catch (bcError: any) {
        console.error('❌ Blockchain error (non-blocking):', bcError.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        verificationId,
        productId,
        decision,
        status: newStatus,
        certificate: certificateResult,
        blockchain: blockchainResult,
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
