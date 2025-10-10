export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_id: string
          check_in_status: string
          confirmation_code: string
          created_at: string | null
          event_date: string
          group_size: number
          id: string
          payment_method: string
          payment_status: string
          promo_code: Json | null
          qr_code_data: string
          source: string
          story_theme: string
          subtotal: number
          ticket_price: number
          time_slot: string
          time_slot_time: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_id: string
          check_in_status?: string
          confirmation_code: string
          created_at?: string | null
          event_date: string
          group_size: number
          id?: string
          payment_method: string
          payment_status?: string
          promo_code?: Json | null
          qr_code_data: string
          source?: string
          story_theme: string
          subtotal: number
          ticket_price?: number
          time_slot: string
          time_slot_time: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_id?: string
          check_in_status?: string
          confirmation_code?: string
          created_at?: string | null
          event_date?: string
          group_size?: number
          id?: string
          payment_method?: string
          payment_status?: string
          promo_code?: Json | null
          qr_code_data?: string
          source?: string
          story_theme?: string
          subtotal?: number
          ticket_price?: number
          time_slot?: string
          time_slot_time?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_summary: {
        Row: {
          available_capacity: number | null
          available_slots: number
          booked_slots: number
          created_at: string | null
          current_bookings: number
          event_date: string
          id: string
          max_capacity: number
          total_slots: number
          updated_at: string | null
        }
        Insert: {
          available_capacity?: number | null
          available_slots: number
          booked_slots?: number
          created_at?: string | null
          current_bookings?: number
          event_date: string
          id?: string
          max_capacity: number
          total_slots: number
          updated_at?: string | null
        }
        Update: {
          available_capacity?: number | null
          available_slots?: number
          booked_slots?: number
          created_at?: string | null
          current_bookings?: number
          event_date?: string
          id?: string
          max_capacity?: number
          total_slots?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      leaders: {
        Row: {
          age: number
          booking_id: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          line_id: string | null
          nickname: string | null
          phone: string
        }
        Insert: {
          age: number
          booking_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          line_id?: string | null
          nickname?: string | null
          phone: string
        }
        Update: {
          age?: number
          booking_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          line_id?: string | null
          nickname?: string | null
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaders_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          age: number
          booking_id: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          member_id: number
          nickname: string | null
        }
        Insert: {
          age: number
          booking_id?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          member_id: number
          nickname?: string | null
        }
        Update: {
          age?: number
          booking_id?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          member_id?: number
          nickname?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      time_slots: {
        Row: {
          booking_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          event_date: string
          group_number: number
          id: string
          is_available: boolean | null
          round_number: number
          slot_number: number
          slot_type: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          event_date: string
          group_number: number
          id?: string
          is_available?: boolean | null
          round_number: number
          slot_number: number
          slot_type?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_date?: string
          group_number?: number
          id?: string
          is_available?: boolean | null
          round_number?: number
          slot_number?: number
          slot_type?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_promo_usage: {
        Args: { promo_code: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      update_daily_capacity: {
        Args: {
          p_event_date: string
          p_group_size: number
          p_is_cancelled?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "super_admin" | "staff" | "viewer"
      booking_source: "website" | "manual" | "import"
      check_in_status: "checked-in" | "not-checked-in"
      payment_method: "credit-card" | "promptpay" | "bank-transfer"
      payment_status: "pending" | "completed" | "failed"
      promo_type: "percentage" | "fixed"
      story_theme: "cursed-cinema" | "lesson-blood"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "staff", "viewer"],
      booking_source: ["website", "manual", "import"],
      check_in_status: ["checked-in", "not-checked-in"],
      payment_method: ["credit-card", "promptpay", "bank-transfer"],
      payment_status: ["pending", "completed", "failed"],
      promo_type: ["percentage", "fixed"],
      story_theme: ["cursed-cinema", "lesson-blood"],
    },
  },
} as const
