-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email text,
  admin_password text,
  admin_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Verify caller is an admin with can_add_admins rights
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_rights
    WHERE user_id = auth.uid()
    AND can_add_admins = true
  ) THEN
    RAISE EXCEPTION 'Permission denied: Caller cannot create admin users';
  END IF;

  -- Create auth user with admin metadata
  new_user_id := extensions.uuid_generate_v4();
  
  -- Insert into auth.users (simplified, in production use proper auth.create_user())
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
  ) VALUES (
    new_user_id,
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    NOW(),
    jsonb_build_object('role', 'admin')::jsonb || admin_metadata
  );

  -- Create profile
  INSERT INTO public.profiles (
    id,
    role,
    email,
    created_at
  ) VALUES (
    new_user_id,
    'admin',
    admin_email,
    NOW()
  );

  -- Create admin rights
  INSERT INTO public.admin_rights (
    user_id,
    can_add_admins,
    can_manage_providers,
    can_manage_cms,
    can_refund,
    created_at
  ) VALUES (
    new_user_id,
    false, -- New admins can't create other admins by default
    true,
    true,
    true,
    NOW()
  );

  -- Log the operation
  INSERT INTO public.audit_logs (
    actor_user_id,
    action,
    table_name,
    record_id,
    changes,
    created_at
  ) VALUES (
    auth.uid(),
    'CREATE_ADMIN_USER',
    'auth.users',
    new_user_id::text,
    jsonb_build_object(
      'email', admin_email,
      'role', 'admin',
      'created_by', auth.uid()
    ),
    NOW()
  );

  RETURN new_user_id;
END;
$$;
