// API Route: Get user's products
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('[API Products] Authenticating user...');
    // Get authenticated user
    const { user, error: authError } = await getAuthenticatedUser(request);
    console.log('[API Products] Auth result - User ID:', user?.id, 'Email:', user?.email, 'Error:', authError);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, status: httpStatus, statusText } = await query;

    console.log('[API Products] Query result - Count:', data?.length, 'User ID filter:', user.id, 'HTTP:', httpStatus, statusText);
    if (error) {
      console.error('[API Products] Supabase error:', { code: error.code, message: error.message, details: error.details, hint: error.hint });
    }
    if (data && data.length > 0) {
      console.log('[API Products] First product:', JSON.stringify({ id: data[0].id, status: data[0].status, product_name: data[0].product_name }));
    }
    if (data && data.length === 0) {
      // Debug: Check if there are any products at all
      const { data: allProducts, error: debugError } = await supabase
        .from('products')
        .select('id, user_id, status')
        .limit(5);
      console.log('[API Products] DEBUG - All products sample:', JSON.stringify(allProducts), 'Error:', debugError?.message);
    }

    if (error) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch products: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
