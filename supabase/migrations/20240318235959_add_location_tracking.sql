-- Create location_updates table
CREATE TABLE location_updates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    helper_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    accuracy double precision,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add indexes for faster queries
CREATE INDEX idx_location_updates_booking_id ON location_updates(booking_id);
CREATE INDEX idx_location_updates_helper_id ON location_updates(helper_id);
CREATE INDEX idx_location_updates_created_at ON location_updates(created_at DESC);

-- Add RLS policies
ALTER TABLE location_updates ENABLE ROW LEVEL SECURITY;

-- Helpers can insert their own location
CREATE POLICY "Helpers can insert their own location"
    ON location_updates FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = helper_id AND
        EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.id = booking_id
            AND b.helper_id = auth.uid()
            AND b.status IN ('accepted', 'in_progress')
        )
    );

-- Users can view location updates for their bookings
CREATE POLICY "Users can view location updates for their bookings"
    ON location_updates FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.id = booking_id
            AND (b.user_id = auth.uid() OR b.helper_id = auth.uid())
        )
    );

-- Add realtime support for location updates
ALTER PUBLICATION supabase_realtime ADD TABLE location_updates;

-- Add function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_location_updates_updated_at
    BEFORE UPDATE ON location_updates
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
