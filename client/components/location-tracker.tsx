'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';
import { trackingService } from '@/lib/services/tracking';
import { GoogleMap, Marker } from '@react-google-maps/api';

type Props = {
  bookingId: string;
};

type Location = {
  latitude: number;
  longitude: number;
  created_at: string;
};

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 20.5937, // India's approximate center
  lng: 78.9629
};

export function LocationTracker({ bookingId }: Props) {
  const { profile } = useAuthStore();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocations();
    const interval = setInterval(loadLocations, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [bookingId]);

  async function loadLocations() {
    try {
      const data = await trackingService.getLocationUpdates(bookingId);
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load location updates');
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  }

  // Start tracking for helpers
  useEffect(() => {
    if (profile?.role === 'helper') {
      const cleanup = trackingService.watchLocation(bookingId, profile.id);
      return () => cleanup();
    }
  }, [bookingId, profile]);

  if (loading) {
    return <div className="animate-pulse">Loading location data...</div>;
  }

  if (error) {
    return (
      <div className="text-error bg-red-50 border border-red-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  const center = locations[0] ? {
    lat: locations[0].latitude,
    lng: locations[0].longitude
  } : defaultCenter;

  return (
    <div className="space-y-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        {locations.map((loc, index) => (
          <Marker
            key={loc.created_at}
            position={{
              lat: loc.latitude,
              lng: loc.longitude
            }}
            // Use different icon for latest position
            icon={index === 0 ? '/marker-current.png' : '/marker-history.png'}
          />
        ))}
      </GoogleMap>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-border">
        <h3 className="font-medium text-textPrimary mb-2">Location History</h3>
        <div className="space-y-2">
          {locations.map((loc) => (
            <div
              key={loc.created_at}
              className="text-sm text-textSecondary flex justify-between"
            >
              <span>
                {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
              </span>
              <span>
                {new Date(loc.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-center text-textSecondary py-2">
              No location updates yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
