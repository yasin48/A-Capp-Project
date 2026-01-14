// API Route: Get pending products for verification
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    // Fetch products with status pending or under_review
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['pending', 'under_review'])
      .order('submitted_at', { ascending: true });

    if (error) {
      console.error('Error fetching pending products:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch pending products' },
        { status: 500 }
      );
    }

    // NOTE: Original implementation joined users to get user_email.
    // With Supabase, you can model this as a foreign table join (e.g., 'users(email)')
    // and then map the nested result to user_email if needed.

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    console.error('Error fetching pending products:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pending products' },
      { status: 500 }
    );
  }
}
