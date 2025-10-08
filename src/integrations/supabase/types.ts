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
      activity_logs: {
        Row: {
          action: string
          admin_email: string
          admin_name: string
          admin_user_id: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target: string
          target_id: string
          timestamp: string | null
        }
        Insert: {
          action: string
          admin_email: string
          admin_name: string
          admin_user_id?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target: string
          target_id: string
          timestamp?: string | null
        }
        Update: {
          action?: string
          admin_email?: string
          admin_name?: string
          admin_user_id?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target?: string
          target_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          last_login: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          last_login?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          last_login?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_notes: string | null
          booking_date: string | null
          booking_id: string
          check_in_by: string | null
          check_in_status: Database["public"]["Enums"]["check_in_status"] | null
          check_in_time: string | null
          confirmation_code: string
          created_at: string | null
          event_date: string
          group_size: number
          id: string
          leader_age: number
          leader_email: string
          leader_first_name: string
          leader_last_name: string
          leader_line_id: string | null
          leader_nickname: string | null
          leader_phone: string
          members: Json
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          promo_code: string | null
          promo_discount: number | null
          qr_code_data: string | null
          source: Database["public"]["Enums"]["booking_source"] | null
          story_theme: Database["public"]["Enums"]["story_theme"]
          subtotal: number
          ticket_price: number
          time_slot: string
          time_slot_time: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          booking_date?: string | null
          booking_id: string
          check_in_by?: string | null
          check_in_status?:
            | Database["public"]["Enums"]["check_in_status"]
            | null
          check_in_time?: string | null
          confirmation_code: string
          created_at?: string | null
          event_date: string
          group_size: number
          id?: string
          leader_age: number
          leader_email: string
          leader_first_name: string
          leader_last_name: string
          leader_line_id?: string | null
          leader_nickname?: string | null
          leader_phone: string
          members?: Json
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          promo_code?: string | null
          promo_discount?: number | null
          qr_code_data?: string | null
          source?: Database["public"]["Enums"]["booking_source"] | null
          story_theme: Database["public"]["Enums"]["story_theme"]
          subtotal: number
          ticket_price?: number
          time_slot: string
          time_slot_time: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          booking_date?: string | null
          booking_id?: string
          check_in_by?: string | null
          check_in_status?:
            | Database["public"]["Enums"]["check_in_status"]
            | null
          check_in_time?: string | null
          confirmation_code?: string
          created_at?: string | null
          event_date?: string
          group_size?: number
          id?: string
          leader_age?: number
          leader_email?: string
          leader_first_name?: string
          leader_last_name?: string
          leader_line_id?: string | null
          leader_nickname?: string | null
          leader_phone?: string
          members?: Json
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          promo_code?: string | null
          promo_discount?: number | null
          qr_code_data?: string | null
          source?: Database["public"]["Enums"]["booking_source"] | null
          story_theme?: Database["public"]["Enums"]["story_theme"]
          subtotal?: number
          ticket_price?: number
          time_slot?: string
          time_slot_time?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_purchase: number | null
          type: Database["public"]["Enums"]["promo_type"]
          updated_at: string | null
          usage_limit: number
          used_count: number | null
          valid_from: string
          valid_until: string
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          type: Database["public"]["Enums"]["promo_type"]
          updated_at?: string | null
          usage_limit: number
          used_count?: number | null
          valid_from: string
          valid_until: string
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          type?: Database["public"]["Enums"]["promo_type"]
          updated_at?: string | null
          usage_limit?: number
          used_count?: number | null
          valid_from?: string
          valid_until?: string
          value?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
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
