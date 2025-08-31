-- Trigger function to handle new user signups
CREATE OR REPLACE FUNCTION handle_auth_user_created()
RETURNS TRIGGER AS $$
DECLARE
  role_name public.user_role;
  metadata_role text;
BEGIN
  -- Extract role from metadata or default to 'customer'
  metadata_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
  role_name := metadata_role::public.user_role;

  -- Create profile
  INSERT INTO public.profiles (
    id,
    role,
    email,
    full_name,
    phone,
    created_at
  ) VALUES (
    NEW.id,
    role_name,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NOW()
  );

  -- If role is provider, create provider record
  IF role_name = 'provider' THEN
    INSERT INTO public.providers (
      id,
      company_name,
      about,
      verification_status,
      created_at
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'company_name',
      NEW.raw_user_meta_data->>'about',
      'pending',
      NOW()
    );
  END IF;

  -- Create wallet for all users
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 0);

  -- Create loyalty account
  INSERT INTO public.loyalty_accounts (user_id, points, tier)
  VALUES (NEW.id, 0, 'basic');

  -- Log the operation
  INSERT INTO public.audit_logs (
    actor_user_id,
    action,
    table_name,
    record_id,
    changes,
    created_at
  ) VALUES (
    NEW.id,
    'USER_SIGNUP',
    'auth.users',
    NEW.id::text,
    jsonb_build_object(
      'email', NEW.email,
      'role', role_name,
      'metadata', NEW.raw_user_meta_data
    ),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_user_created();
