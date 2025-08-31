export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type Timestamp = string;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string | null
          role: 'user' | 'helper' | 'admin'
          kyc_verified: boolean | null
          name: string | null
          avatar_url: string | null
          phone: string | null
          address: string | null
          bio: string | null
          skills: string[] | null
          ratings: number | null
          total_jobs: number | null
        }
        Insert: {
          id: string
          created_at?: string
          email?: string | null
          role: 'user' | 'helper' | 'admin'
          kyc_verified?: boolean | null
          name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          bio?: string | null
          skills?: string[] | null
          ratings?: number | null
          total_jobs?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string | null
          role?: 'user' | 'helper' | 'admin'
          kyc_verified?: boolean | null
          name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          bio?: string | null
          skills?: string[] | null
          ratings?: number | null
          total_jobs?: number | null
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          user_id: string
          helper_id: string | null
          service_type: string
          status: 'pending' | 'accepted' | 'completed' | 'cancelled'
          schedule_time: string
          location: string
          description: string | null
          price: number | null
          payment_status: 'pending' | 'paid' | 'failed'
          rating: number | null
          review: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          helper_id?: string | null
          service_type: string
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled'
          schedule_time: string
          location: string
          description?: string | null
          price?: number | null
          payment_status?: 'pending' | 'paid' | 'failed'
          rating?: number | null
          review?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          helper_id?: string | null
          service_type?: string
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled'
          schedule_time?: string
          location?: string
          description?: string | null
          price?: number | null
          payment_status?: 'pending' | 'paid' | 'failed'
          rating?: number | null
          review?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price_range: number[]
          category: string
          image_url: string | null
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price_range: number[]
          category: string
          image_url?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price_range?: number[]
          category?: string
          image_url?: string | null
          active?: boolean
        }
      },
      wallet_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'credit' | 'debit' | 'refund'
          status: 'pending' | 'completed' | 'failed'
          description: string | null
          reference_id: string | null
          created_at: Timestamp
          updated_at: Timestamp
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'credit' | 'debit' | 'refund'
          status: 'pending' | 'completed' | 'failed'
          description?: string | null
          reference_id?: string | null
          created_at?: Timestamp
          updated_at?: Timestamp
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'credit' | 'debit' | 'refund'
          status?: 'pending' | 'completed' | 'failed'
          description?: string | null
          reference_id?: string | null
          created_at?: Timestamp
          updated_at?: Timestamp
        }
      },
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          code: string
          status: 'pending' | 'completed' | 'expired'
          reward_amount: number
          reward_claimed: boolean
          created_at: Timestamp
          expires_at: Timestamp | null
          claimed_at: Timestamp | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          code: string
          status: 'pending' | 'completed' | 'expired'
          reward_amount: number
          reward_claimed?: boolean
          created_at?: Timestamp
          expires_at?: Timestamp | null
          claimed_at?: Timestamp | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          code?: string
          status?: 'pending' | 'completed' | 'expired'
          reward_amount?: number
          reward_claimed?: boolean
          created_at?: Timestamp
          expires_at?: Timestamp | null
          claimed_at?: Timestamp | null
        }
      },
      location_updates: {
        Row: {
          id: string
          booking_id: string
          helper_id: string
          latitude: number
          longitude: number
          accuracy: number | null
          created_at: Timestamp
        }
        Insert: {
          id?: string
          booking_id: string
          helper_id: string
          latitude: number
          longitude: number
          accuracy?: number | null
          created_at?: Timestamp
        }
        Update: {
          id?: string
          booking_id?: string
          helper_id?: string
          latitude?: number
          longitude?: number
          accuracy?: number | null
          created_at?: Timestamp
        }
      },
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          read: boolean
          created_at: Timestamp
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          read?: boolean
          created_at?: Timestamp
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          created_at?: Timestamp
        }
      },
      user_devices: {
        Row: {
          id: string
          user_id: string
          device_token: string
          device_type: string
          created_at: Timestamp
          last_used_at: Timestamp | null
        }
        Insert: {
          id?: string
          user_id: string
          device_token: string
          device_type: string
          created_at?: Timestamp
          last_used_at?: Timestamp | null
        }
        Update: {
          id?: string
          user_id?: string
          device_token?: string
          device_type?: string
          created_at?: Timestamp
          last_used_at?: Timestamp | null
        }
      },
      calendar_events: {
        Row: {
          id: string
          user_id: string
          booking_id: string
          title: string
          description: string | null
          start_time: Timestamp
          end_time: Timestamp
          calendar_provider: string | null
          calendar_event_id: string | null
          created_at: Timestamp
          updated_at: Timestamp
        }
        Insert: {
          id?: string
          user_id: string
          booking_id: string
          title: string
          description?: string | null
          start_time: Timestamp
          end_time: Timestamp
          calendar_provider?: string | null
          calendar_event_id?: string | null
          created_at?: Timestamp
          updated_at?: Timestamp
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string
          title?: string
          description?: string | null
          start_time?: Timestamp
          end_time?: Timestamp
          calendar_provider?: string | null
          calendar_event_id?: string | null
          created_at?: Timestamp
          updated_at?: Timestamp
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_wallet_balance: {
        Args: {
          user_id: string
          increment_amount: number
        }
        Returns: void
      }
      decrement_wallet_balance: {
        Args: {
          user_id: string
          decrement_amount: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
