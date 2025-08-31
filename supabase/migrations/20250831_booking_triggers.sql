-- Trigger function to handle booking status changes
CREATE OR REPLACE FUNCTION handle_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
  customer_record record;
  provider_record record;
  booking_details record;
  notification_title text;
  notification_body text;
BEGIN
  -- Only proceed if status has changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get customer and provider details
  SELECT email, phone INTO customer_record
  FROM profiles WHERE id = NEW.customer_id;

  SELECT p.email, p.phone, pr.company_name INTO provider_record
  FROM profiles p
  JOIN providers pr ON pr.id = p.id
  WHERE p.id = NEW.provider_id;

  -- Get booking details
  SELECT bi.title, b.scheduled_at, a.line1 
  INTO booking_details
  FROM bookings b
  JOIN booking_items bi ON bi.booking_id = b.id
  JOIN addresses a ON a.id = b.address_id
  WHERE b.id = NEW.id
  LIMIT 1;

  -- Set notification messages based on status
  CASE NEW.status
    WHEN 'confirmed' THEN
      notification_title := 'Booking Confirmed';
      notification_body := format('Your booking for %s on %s has been confirmed', 
        booking_details.title, 
        to_char(booking_details.scheduled_at, 'DD Mon YYYY HH24:MI')
      );
    
    WHEN 'in_progress' THEN
      notification_title := 'Service Started';
      notification_body := format('Service for %s has started at %s', 
        booking_details.title,
        booking_details.line1
      );
    
    WHEN 'completed' THEN
      notification_title := 'Service Completed';
      notification_body := 'Service has been completed. Please rate your experience.';
    
    WHEN 'cancelled' THEN
      notification_title := 'Booking Cancelled';
      notification_body := format('Booking for %s has been cancelled', booking_details.title);
    
    ELSE
      notification_title := format('Booking Status: %s', NEW.status);
      notification_body := format('Your booking status has been updated to %s', NEW.status);
  END CASE;

  -- Create notifications for customer
  INSERT INTO public.notifications (
    user_id,
    channel,
    title,
    body,
    data,
    sent_at
  ) VALUES
  -- Push notification
  (NEW.customer_id, 'push', notification_title, notification_body,
   jsonb_build_object('booking_id', NEW.id, 'status', NEW.status),
   NOW()),
  -- SMS if phone exists
  (NEW.customer_id, 'sms', notification_title, notification_body,
   jsonb_build_object('booking_id', NEW.id),
   NOW()),
  -- Email
  (NEW.customer_id, 'email', notification_title, notification_body,
   jsonb_build_object('booking_id', NEW.id, 'template', 'booking_status_change'),
   NOW());

  -- Create notifications for provider
  IF NEW.provider_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      channel,
      title,
      body,
      data,
      sent_at
    ) VALUES
    -- Push notification
    (NEW.provider_id, 'push', notification_title, notification_body,
     jsonb_build_object('booking_id', NEW.id, 'status', NEW.status),
     NOW()),
    -- SMS if phone exists
    (NEW.provider_id, 'sms', notification_title, notification_body,
     jsonb_build_object('booking_id', NEW.id),
     NOW()),
    -- Email
    (NEW.provider_id, 'email', notification_title, notification_body,
     jsonb_build_object('booking_id', NEW.id, 'template', 'booking_status_change'),
     NOW());
  END IF;

  -- Create booking event
  INSERT INTO public.booking_events (
    booking_id,
    status,
    by_user,
    note,
    created_at
  ) VALUES (
    NEW.id,
    NEW.status,
    auth.uid(),
    format('Status changed from %s to %s', OLD.status, NEW.status),
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
    'BOOKING_STATUS_CHANGE',
    'bookings',
    NEW.id::text,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'customer_id', NEW.customer_id,
      'provider_id', NEW.provider_id
    ),
    NOW()
  );

  -- Enable route tracking if status is 'in_progress'
  IF NEW.status = 'in_progress' THEN
    INSERT INTO public.provider_locations (provider_id)
    VALUES (NEW.provider_id)
    ON CONFLICT (provider_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for bookings
DROP TRIGGER IF EXISTS on_booking_status_change ON public.bookings;
CREATE TRIGGER on_booking_status_change
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION handle_booking_status_change();
