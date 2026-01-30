// API Route: Get Current User
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get session from Supabase (it will check cookies automatically)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { data: { user }, error } = await supabase.auth.getUser(session.access_token);

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        },
      },
    });
  } catch (error: any) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}
