// API Route: User Login
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database/connection';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Set auth cookie for server-side requests
    const response = NextResponse.json({
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    });

    // Set the session token as a cookie
    if (data.session) {
      response.cookies.set('sb-access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}
