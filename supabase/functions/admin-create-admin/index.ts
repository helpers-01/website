import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.fresh.dev/std@v1.0/http/server.ts';
import { verifyJWT } from '../_shared/auth.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface CreateAdminRequest {
  email: string;
  role: 'admin';
}

async function insertAuditLog(userId: string, action: string, details: any) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    details,
    created_at: new Date().toISOString()
  });
}

async function validateAdminRights(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_rights')
    .select('can_add_admins')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data?.can_add_admins || false;
}

serve(async (req) => {
  try {
    // Verify JWT and get user claims
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No authorization token provided');
    }

    const claims = await verifyJWT(token);
    const callerId = claims.sub;

    // Validate admin rights
    const hasAdminRights = await validateAdminRights(callerId);
    if (!hasAdminRights) {
      throw new Error('Insufficient permissions');
    }

    const { email, role }: CreateAdminRequest = await req.json();

    // Validate role
    if (role !== 'admin') {
      throw new Error('Invalid role specified');
    }

    // Create admin user via Admin API
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });

    if (createError) throw createError;

    // Create profile for the new admin
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email,
        role: 'admin',
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // Grant basic admin rights
    const { error: rightsError } = await supabase
      .from('admin_rights')
      .insert({
        user_id: user.id,
        can_add_admins: false, // New admins can't create other admins by default
        created_at: new Date().toISOString()
      });

    if (rightsError) throw rightsError;

    // Log the operation
    await insertAuditLog(callerId, 'CREATE_ADMIN', {
      target_email: email,
      target_user_id: user.id
    });

    return new Response(JSON.stringify({ 
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in admin-create-admin:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
