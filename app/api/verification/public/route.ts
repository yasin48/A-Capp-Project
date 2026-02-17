// API Route: Public product verification by serial number
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('query');

        if (!query) {
            return NextResponse.json(
                { verified: false, error: 'Serial number or hash required' },
                { status: 400 }
            );
        }

        // Search by serial number with direct joins
        // We join with blockchain_records (on product_id) and verifications (on product_id)
        const { data: productData, error: productError } = await supabase
            .from('products')
            .select(`
                *,
                blockchain_records (
                    tx_hash,
                    block_number,
                    network,
                    contract_address,
                    created_at
                ),
                verifications (
                    id,
                    decision,
                    notes,
                    verified_at
                )
            `)
            .ilike('serial_number', query)
            .maybeSingle();

        if (productError) {
            console.error('Error searching product:', productError);
            return NextResponse.json({ verified: false, error: 'Database error' }, { status: 500 });
        }

        if (!productData) {
            return NextResponse.json({
                verified: false,
                error: 'Product not found. Please check the serial number.',
            });
        }

        const isVerified = productData.status === 'certified' || productData.status === 'authentic';
        const blockchainRecord = productData.blockchain_records?.[0] || null;
        const verification = productData.verifications?.[0] || null;

        return NextResponse.json({
            verified: isVerified,
            product: {
                id: productData.id,
                serial_number: productData.serial_number,
                brand: productData.brand,
                product_name: productData.product_name,
                status: productData.status,
                image: productData.images?.[0] || null,
            },
            blockchainRecord: blockchainRecord ? {
                txHash: blockchainRecord.tx_hash,
                blockNumber: blockchainRecord.block_number,
                network: blockchainRecord.network,
                polygonscanUrl: `https://amoy.polygonscan.com/tx/${blockchainRecord.tx_hash}`,
                timestamp: blockchainRecord.created_at
            } : null,
            verification: verification ? {
                decision: verification.decision,
                notes: verification.notes,
                date: verification.verified_at
            } : null
        });
    } catch (error: any) {
        console.error('Public verification error:', error);
        return NextResponse.json(
            { verified: false, error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
