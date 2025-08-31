import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeOptions {
  table: string
  filter?: string
  onInsert?: (payload: any) => void
  onUpdate?: (payload: any) => void
  onDelete?: (payload: any) => void
  enabled?: boolean
}

export function useRealtime({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Create a unique channel name
    const channelName = `realtime-${table}-${Date.now()}`
    const realtimeChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log('Real-time INSERT:', payload)
          onInsert?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log('Real-time UPDATE:', payload)
          onUpdate?.(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log('Real-time DELETE:', payload)
          onDelete?.(payload)
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status)
        setIsConnected(status === 'SUBSCRIBED')
      })

    setChannel(realtimeChannel)

    return () => {
      realtimeChannel.unsubscribe()
      setIsConnected(false)
    }
  }, [table, filter, enabled, onInsert, onUpdate, onDelete])

  const unsubscribe = () => {
    if (channel) {
      channel.unsubscribe()
      setIsConnected(false)
    }
  }

  return {
    isConnected,
    unsubscribe
  }
}

// Specialized hooks for common use cases
export function useRealtimeBookings(onUpdate?: (payload: any) => void) {
  return useRealtime({
    table: 'bookings',
    onInsert: onUpdate,
    onUpdate: onUpdate,
    onDelete: onUpdate
  })
}

export function useRealtimeUsers(onUpdate?: (payload: any) => void) {
  return useRealtime({
    table: 'users',
    onInsert: onUpdate,
    onUpdate: onUpdate,
    onDelete: onUpdate
  })
}

export function useRealtimeProviders(onUpdate?: (payload: any) => void) {
  return useRealtime({
    table: 'providers',
    onInsert: onUpdate,
    onUpdate: onUpdate,
    onDelete: onUpdate
  })
}

export function useRealtimeServices(onUpdate?: (payload: any) => void) {
  return useRealtime({
    table: 'services',
    onInsert: onUpdate,
    onUpdate: onUpdate,
    onDelete: onUpdate
  })
}