/**
 * Server-Side Authentication & Role Verification for Edge Functions
 */
import { createClient, User } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

export interface AuthContext {
  user: User;
  token: string;
  supabaseClient: ReturnType<typeof createClient>;
}

export async function requireAuth(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Missing or malformed Authorization header.', 401);
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error } = await supabaseClient.auth.getUser(token);

  if (error || !user) {
    throw new AuthError('Invalid or expired authentication session.', 401);
  }

  return { user, token, supabaseClient };
}

export async function requireRole(
  authCtx: AuthContext,
  allowedRoles: string[]
): Promise<boolean> {
  const { user } = authCtx;
  const userRole = (user.app_metadata?.role || '').toUpperCase();

  if (allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
    return true;
  }

  // Fallback check against database profiles table via service role
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const profileRole = (profile?.role || 'USER').toUpperCase();
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

  if (normalizedAllowed.includes(profileRole) || profileRole === 'SUPER_ADMIN') {
    return true;
  }

  throw new AuthError('Forbidden: Insufficient privileges for this operation.', 403);
}

export async function requireAdmin(authCtx: AuthContext): Promise<boolean> {
  return requireRole(authCtx, ['ADMIN', 'SUPER_ADMIN']);
}

export async function requireProvider(authCtx: AuthContext): Promise<boolean> {
  return requireRole(authCtx, ['PROVIDER', 'ADMIN', 'SUPER_ADMIN']);
}
