import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../types'

// Initialize Supabase client with service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

// Audit logging helper
export async function logAudit(
  action: string,
  actorId: string | null,
  tableName: string,
  recordId: string,
  changes: Record<string, unknown>
) {
  await supabase.from('audit_logs').insert({
    actor_user_id: actorId,
    action,
    table_name: tableName,
    record_id: recordId,
    changes,
    created_at: new Date().toISOString()
  })
}

// JWT verification helper
export async function verifyJWT(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error) throw error
  return user
}

// Admin rights check
export async function verifyAdminRights(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('admin_rights')
    .select('can_add_admins')
    .eq('user_id', userId)
    .single()
  
  return Boolean(data?.can_add_admins)
}

// Helper to create notifications
export async function createNotification(
  userId: string,
  channel: 'push' | 'sms' | 'email' | 'in_app',
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  return supabase.from('notifications').insert({
    user_id: userId,
    channel,
    title,
    body,
    data,
    sent_at: new Date().toISOString()
  })
}

// Stubbed external notification providers
export const notificationProviders = {
  async sendPush(userId: string, title: string, body: string) {
    console.log(`[PUSH] To ${userId}: ${title} - ${body}`)
    // Implement FCM/OneSignal integration here
  },

  async sendSMS(phone: string, message: string) {
    console.log(`[SMS] To ${phone}: ${message}`)
    // Implement Twilio/MessageBird integration here
  },

  async sendEmail(email: string, subject: string, body: string) {
    console.log(`[EMAIL] To ${email}: ${subject} - ${body}`)
    // Implement SendGrid/AWS SES integration here
  }
}

// Payment signature verification
export function verifyPaymentSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  )
}
