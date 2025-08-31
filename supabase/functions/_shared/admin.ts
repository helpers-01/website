import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

export const createAdminUser = async (
  email: string, 
  password: string, 
  callerToken: string
): Promise<{id: string} | {error: string}> => {
  try {
    // Verify caller's token
    const { data: { user: caller }, error: authError } = 
      await supabaseClient.auth.getUser(callerToken)
    
    if (authError || !caller) {
      throw new Error('Invalid authorization')
    }

    // Check admin rights
    const { data: adminRights, error: rightsError } = 
      await supabaseClient
        .from('admin_rights')
        .select('can_add_admins')
        .eq('user_id', caller.id)
        .single()

    if (rightsError || !adminRights?.can_add_admins) {
      throw new Error('Insufficient permissions')
    }

    // Create admin user
    const { data: newUser, error: createError } = 
      await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      })

    if (createError) throw createError

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email,
        role: 'admin'
      })

    if (profileError) throw profileError

    // Grant admin rights
    const { error: rightsInsertError } = await supabaseClient
      .from('admin_rights')
      .insert({
        user_id: newUser.user.id,
        can_add_admins: false,
        can_manage_providers: true,
        can_manage_cms: true,
        can_refund: true
      })

    if (rightsInsertError) throw rightsInsertError

    // Log operation
    await supabaseClient
      .from('audit_logs')
      .insert({
        actor_user_id: caller.id,
        action: 'CREATE_ADMIN_USER',
        table_name: 'auth.users',
        record_id: newUser.user.id,
        changes: {
          email,
          role: 'admin',
          created_by: caller.id
        }
      })

    return { id: newUser.user.id }

  } catch (error) {
    console.error('Error creating admin:', error)
    return { error: error.message }
  }
}
