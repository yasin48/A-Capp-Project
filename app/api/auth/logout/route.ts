// API Route: User Logout
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to logout' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear auth cookie
    response.cookies.delete('sb-access-token');

    return response;
  } catch (error: any) {
    console.error('Error in logout:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to logout' },
      { status: 500 }
    );
  }
}
