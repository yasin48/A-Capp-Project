import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // 1. Authenticate user
        const { user, error: authError } = await getAuthenticatedUser(request);
        if (authError || !user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        // 2. Fetch product and verify ownership
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (productError || !product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.user_id !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (product.status !== 'authentic' && product.status !== 'certified') {
            return NextResponse.json({ error: 'Certificate not available for unverified products' }, { status: 400 });
        }

        // 3. Fetch verification details
        const { data: verification } = await supabase
            .from('verifications')
            .select('*')
            .eq('product_id', productId)
            .eq('decision', 'authentic')
            .order('verified_at', { ascending: false })
            .limit(1)
            .single();

        // 4. Fetch blockchain record
        // Try to get from blockchain_records table first
        let { data: blockchainRecord } = await supabase
            .from('blockchain_records')
            .select('*')
            .eq('product_id', productId)
            .single();

        // If not found, check certificates table for legacy/fallback
        if (!blockchainRecord) {
            const { data: certificate } = await supabase
                .from('certificates')
                .select('*')
                .eq('product_id', productId)
                .single();

            if (certificate) {
                blockchainRecord = {
                    tx_hash: certificate.blockchain_tx_hash,
                    // other fields might be missing but tx_hash is key
                } as any;
            }
        }

        // 5. Construct response data
        const certificateData = {
            productName: product.product_name,
            brand: product.brand,
            serialNumber: product.serial_number,
            productImage: product.images?.[0] || null,
            ownerEmail: user.email,
            verifiedAt: verification ? new Date(verification.verified_at).toLocaleDateString() : new Date().toLocaleDateString(),
            txHash: blockchainRecord?.tx_hash || null,
            verificationId: verification?.id || 'N/A',
            generatedAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, data: certificateData });

    } catch (error: any) {
        console.error('Error generating certificate data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
