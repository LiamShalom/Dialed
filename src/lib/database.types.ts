export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          timezone: string | null
          theme: 'light' | 'dark' | 'system'
          notification_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          theme?: 'light' | 'dark' | 'system'
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          theme?: 'light' | 'dark' | 'system'
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          color: string
          icon: string | null
          frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
          custom_frequency: number | null
          unit: 'count' | 'minutes' | 'boolean'
          target: number
          is_active: boolean
          start_date: string
          end_date: string | null
          current_streak: number
          longest_streak: number
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          color: string
          icon?: string | null
          frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
          custom_frequency?: number | null
          unit: 'count' | 'minutes' | 'boolean'
          target: number
          is_active?: boolean
          start_date?: string
          end_date?: string | null
          current_streak?: number
          longest_streak?: number
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          color?: string
          icon?: string | null
          frequency?: 'daily' | 'weekly' | 'monthly' | 'custom'
          custom_frequency?: number | null
          unit?: 'count' | 'minutes' | 'boolean'
          target?: number
          is_active?: boolean
          start_date?: string
          end_date?: string | null
          current_streak?: number
          longest_streak?: number
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          habit_id: string
          date: string
          amount: number
          completed: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          date: string
          amount: number
          completed: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          date?: string
          amount?: number
          completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
