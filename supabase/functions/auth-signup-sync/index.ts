import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.fresh.dev/std@v1.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface WebhookPayload {
  type: 'USER_CREATED';
  table: 'auth.users';
  record: {
    id: string;
    email: string;
    raw_user_meta_data: {
      role?: 'user' | 'helper' | 'admin';
      full_name?: string;
      phone?: string;
    };
  };
}

async function insertAuditLog(userId: string, action: string, details: any) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action,
    details,
    created_at: new Date().toISOString()
  });
}

serve(async (req) => {
  try {
    // Verify webhook signature (implement verification logic here)
    const payload: WebhookPayload = await req.json();

    if (payload.type !== 'USER_CREATED') {
      return new Response(JSON.stringify({ message: 'Event type not supported' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const {
      id: userId,
      email,
      raw_user_meta_data: metadata
    } = payload.record;

    // Default role to 'user' if not specified
    const role = metadata.role || 'user';

    // Create or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email,
        role,
        full_name: metadata.full_name,
        phone: metadata.phone,
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // If helper, create helper record (assuming there's a helpers table or similar)
    // For now, just log it
    if (role === 'helper') {
      console.log('Helper role detected, additional setup may be needed');
    }

    // Log the operation
    await insertAuditLog(userId, 'SYNC_PROFILE', {
      role,
      email,
      metadata
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in auth-signup-sync:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
