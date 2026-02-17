// API Route: Get user's products
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // NOTE: Do NOT use .order() - Supabase silently drops rows with NULL created_at
    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: rawData, error } = await query;

    // Sort in JavaScript: newest first, NULLs at top
    const data = (rawData || []).sort((a, b) => {
      if (!a.created_at && !b.created_at) return 0;
      if (!a.created_at) return -1;
      if (!b.created_at) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log('═══════ FETCHING PRODUCTS ═════════');
    console.log('User:', user.id, user.email);
    console.log('Result count:', data.length);
    console.log('Products:', data.map(p => ({ serial: p.serial_number, status: p.status, created: p.created_at })));
    console.log('═══════════════════════════════════');

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch products: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
