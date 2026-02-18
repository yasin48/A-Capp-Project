// API Route: Get authenticator's verification history
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {
        // Check if user is authenticated and has authenticator role
        const { user, role, error: authError } = await getAuthenticatedUser(request);

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (role !== 'authenticator' && role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Only authenticators can access this endpoint.' },
                { status: 403 }
            );
        }

        console.log('═══════ VERIFICATION HISTORY ═══════');
        console.log('Authenticator ID:', user.id);

        // Fetch verifications by this authenticator with product details
        const { data, error } = await supabase
            .from('verifications')
            .select(`
        id,
        decision,
        notes,
        verified_at,
        products (
          id,
          serial_number,
          brand,
          product_name,
          status,
          images
        )
      `)
            .eq('authenticator_id', user.id)
            .order('verified_at', { ascending: false });

        console.log('Query result count:', data?.length);
        console.log('All verification IDs:', data?.map(v => v.id));
        console.log('═══════════════════════════════════');

        if (error) {
            console.error('Error fetching verification history:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch verification history' },
                { status: 500 }
            );
        }

        // Transform the data to flatten the structure
        const transformedData = data?.map(verification => ({
            verificationId: verification.id,
            decision: verification.decision,
            notes: verification.notes,
            verifiedAt: verification.verified_at,
            product: verification.products,
        })) || [];

        return NextResponse.json({
            success: true,
            data: transformedData,
        });
    } catch (error: any) {
        console.error('Error fetching verification history:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch verification history' },
            { status: 500 }
        );
    }
}
