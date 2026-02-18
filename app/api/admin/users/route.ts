import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET(request: NextRequest) {
    try {
        // 1. Verify Admin Permissions
        const { user, role } = await getAuthenticatedUser(request);

        if (!user || role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        // 2. Fetch all users using Admin Client
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            throw error;
        }

        // 3. Format response
        const formattedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            role: u.user_metadata?.role || 'user',
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at
        }));

        return NextResponse.json({
            success: true,
            data: formattedUsers
        });

    } catch (error: any) {
        console.error('Admin API Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
