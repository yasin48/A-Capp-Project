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

        // Try to find product by serial number first
        let product: any = null;
        let certificate: any = null;
        let blockchainRecord: any = null;

        // Search by serial number
        const { data: productData, error: productError } = await supabase
            .from('products')
            .select('*')
            .ilike('serial_number', query)
            .maybeSingle();

        if (productError) {
            console.error('Error searching product:', productError);
        }

        if (productData) {
            product = productData;

            // Get certificate for this product
            const { data: certData, error: certError } = await supabase
                .from('certificates')
                .select('*')
                .eq('product_id', product.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (certError) {
                console.error('Error fetching certificate:', certError);
            }

            if (certData) {
                certificate = certData;

                // Get blockchain record
                const { data: bcData, error: bcError } = await supabase
                    .from('blockchain_records')
                    .select('*')
                    .eq('certificate_id', certificate.id)
                    .maybeSingle();

                if (bcError) {
                    console.error('Error fetching blockchain record:', bcError);
                }

                if (bcData) {
                    blockchainRecord = bcData;
                }
            }
        } else {
            // Try searching by hash
            const { data: certByHash, error: hashError } = await supabase
                .from('certificates')
                .select('*, products(*)')
                .eq('hash', query)
                .maybeSingle();

            if (hashError) {
                console.error('Error searching by hash:', hashError);
            }

            if (certByHash) {
                certificate = certByHash;
                product = certByHash.products;

                // Get blockchain record
                const { data: bcData } = await supabase
                    .from('blockchain_records')
                    .select('*')
                    .eq('certificate_id', certificate.id)
                    .maybeSingle();

                if (bcData) {
                    blockchainRecord = bcData;
                }
            }
        }

        // If no product found
        if (!product) {
            return NextResponse.json({
                verified: false,
                error: 'Product not found. Please check the serial number.',
            });
        }

        // Check if product is certified/authenticated
        const isVerified = product.status === 'certified' || product.status === 'authentic';

        return NextResponse.json({
            verified: isVerified,
            product: {
                id: product.id,
                serial_number: product.serial_number,
                brand: product.brand,
                product_name: product.product_name,
                status: product.status,
            },
            certificate: certificate ? {
                id: certificate.id,
                hash: certificate.hash,
                decision: certificate.authentication_decision,
                timestamp: certificate.timestamp,
                signature: certificate.blockchain_tx_hash || certificate.hash?.substring(0, 20) + '...',
            } : null,
            blockchainRecord: blockchainRecord ? {
                txHash: blockchainRecord.tx_hash,
                blockNumber: blockchainRecord.block_number,
                network: blockchainRecord.network,
                polygonscanUrl: `https://amoy.polygonscan.com/tx/${blockchainRecord.tx_hash}`,
            } : null,
        });
    } catch (error: any) {
        console.error('Public verification error:', error);
        return NextResponse.json(
            { verified: false, error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
