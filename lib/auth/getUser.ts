// Helper function to get authenticated user in API routes
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    console.log('[getUser] Creating server client...');

    // Create a Supabase client configured for server-side API routes
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Cookie setting not needed for read-only operations
          },
          remove(name: string, options: CookieOptions) {
            // Cookie removal not needed for read-only operations
          },
        },
      }
    );

    // Get the current user from the session
    const { data: { user }, error } = await supabase.auth.getUser();

    console.log('[getUser] User:', user?.email, 'Error:', error?.message);

    if (error || !user) {
      return { user: null, role: null, error: error?.message || 'Authentication required' };
    }

    const role = user.user_metadata?.role || 'user';
    console.log('[getUser] User role:', role);

    return { user, role, error: null };
  } catch (error: any) {
    console.error('[getUser] Exception:', error);
    return { user: null, role: null, error: error.message || 'Failed to get user' };
  }
}
