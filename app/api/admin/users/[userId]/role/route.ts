import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/auth/getUser';

export const dynamic = 'force-dynamic';

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

export async function PUT(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        const body = await request.json();
        const { role: newRole } = body;

        if (!['user', 'authenticator', 'admin'].includes(newRole)) {
            return NextResponse.json(
                { success: false, error: 'Invalid role provided' },
                { status: 400 }
            );
        }

        // 1. Verify Requestor is Admin
        const { user: requestor, role: requestorRole } = await getAuthenticatedUser(request);

        if (!requestor || requestorRole !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        // 2. Prevent Self-Demotion
        if (userId === requestor.id && newRole !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'You cannot demote yourself from Admin status.' },
                { status: 400 }
            );
        }

        // 3. Update User Metadata (Both user_metadata and app_metadata for security)
        const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            {
                user_metadata: { role: newRole },
                app_metadata: { role: newRole }
            }
        );

        if (error) {
            throw error;
        }

        console.log(`[Admin] Role updated for user ${userId} to ${newRole} by ${requestor.email}`);

        return NextResponse.json({
            success: true,
            data: {
                id: user.user.id,
                email: user.user.email,
                role: user.user.user_metadata.role
            }
        });

    } catch (error: any) {
        console.error('Admin Role Update Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update user role' },
            { status: 500 }
        );
    }
}
