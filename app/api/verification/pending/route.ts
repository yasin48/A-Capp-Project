// API Route: Get pending products for verification
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { user, role, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (role !== 'authenticator') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only authenticators can access this endpoint.' },
        { status: 403 }
      );
    }

    // NOTE: Do NOT use .order() - Supabase silently drops rows with NULL created_at
    const { data: rawData, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'pending');

    // Server-side safety filter + sort oldest first in JS
    const data = (rawData || [])
      .filter(p => p.status === 'pending')
      .sort((a, b) => {
        if (!a.created_at && !b.created_at) return 0;
        if (!a.created_at) return -1;
        if (!b.created_at) return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

    console.log('═══════ PENDING PRODUCTS ══════════');
    console.log('Authenticator:', user.email);
    console.log('Raw count:', rawData?.length ?? 0, 'Filtered count:', data.length);
    console.log('Products:', data.map(p => ({ serial: p.serial_number, status: p.status, created: p.created_at })));
    console.log('═══════════════════════════════════');

    if (error) {
      console.error('Error fetching pending products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pending products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}
