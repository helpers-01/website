"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"

interface GoogleMapsProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{ lat: number; lng: number; title?: string }>
  onMapClick?: (location: { lat: number; lng: number }) => void
  className?: string
}

export function GoogleMaps({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  zoom = 12,
  markers = [],
  onMapClick,
  className = "w-full h-96"
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      })

      try {
        const { Map } = await loader.importLibrary("maps")
        const { Marker } = await loader.importLibrary("marker")

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center,
            zoom,
            mapId: "DEMO_MAP_ID",
          })

          // Add markers
          markers.forEach((marker) => {
            new Marker({
              position: marker,
              map: mapInstance,
              title: marker.title,
            })
          })

          // Add click listener
          if (onMapClick) {
            mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                const lat = event.latLng.lat()
                const lng = event.latLng.lng()
                onMapClick({ lat, lng })
              }
            })
          }

          setMap(mapInstance)
          setIsLoaded(true)
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error)
      }
    }

    initMap()
  }, [center, zoom, markers, onMapClick])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center rounded-lg`}>
        <div className="text-center">
          <p className="text-gray-600 mb-2">Google Maps</p>
          <p className="text-sm text-gray-500">API key not configured</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden`}>
      {!isLoaded && (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}