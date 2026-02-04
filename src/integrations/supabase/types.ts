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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      body_composition: {
        Row: {
          bmi: number | null
          bmr: number | null
          body_fat: number | null
          body_water: number | null
          bone_mass: number | null
          created_at: string
          date: string
          fat_free_weight: number | null
          id: string
          metabolic_age: number | null
          muscle_mass: number | null
          protein: number | null
          skeletal_muscle: number | null
          source: string | null
          subcutaneous_fat: number | null
          user_id: string
          visceral_fat: number | null
          weight: number
        }
        Insert: {
          bmi?: number | null
          bmr?: number | null
          body_fat?: number | null
          body_water?: number | null
          bone_mass?: number | null
          created_at?: string
          date: string
          fat_free_weight?: number | null
          id?: string
          metabolic_age?: number | null
          muscle_mass?: number | null
          protein?: number | null
          skeletal_muscle?: number | null
          source?: string | null
          subcutaneous_fat?: number | null
          user_id: string
          visceral_fat?: number | null
          weight: number
        }
        Update: {
          bmi?: number | null
          bmr?: number | null
          body_fat?: number | null
          body_water?: number | null
          bone_mass?: number | null
          created_at?: string
          date?: string
          fat_free_weight?: number | null
          id?: string
          metabolic_age?: number | null
          muscle_mass?: number | null
          protein?: number | null
          skeletal_muscle?: number | null
          source?: string | null
          subcutaneous_fat?: number | null
          user_id?: string
          visceral_fat?: number | null
          weight?: number
        }
        Relationships: []
      }
      calculator_settings: {
        Row: {
          created_at: string
          experience_level: string
          id: string
          last_bac_water: string | null
          last_selected_peptide: string | null
          last_target_dose: string | null
          last_vial_size: string | null
          syringe_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_level?: string
          id?: string
          last_bac_water?: string | null
          last_selected_peptide?: string | null
          last_target_dose?: string | null
          last_vial_size?: string | null
          syringe_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_level?: string
          id?: string
          last_bac_water?: string | null
          last_selected_peptide?: string | null
          last_target_dose?: string | null
          last_vial_size?: string | null
          syringe_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_doses: {
        Row: {
          created_at: string
          date: string
          dose: number
          id: string
          notes: string | null
          peptide_id: string
          peptide_name: string
          time: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          dose: number
          id?: string
          notes?: string | null
          peptide_id: string
          peptide_name: string
          time: string
          unit: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          dose?: number
          id?: string
          notes?: string | null
          peptide_id?: string
          peptide_name?: string
          time?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dose_reminders: {
        Row: {
          created_at: string
          days: string[]
          dose: string
          enabled: boolean
          id: string
          peptide_id: string
          peptide_name: string
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days?: string[]
          dose: string
          enabled?: boolean
          id?: string
          peptide_id: string
          peptide_name: string
          time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days?: string[]
          dose?: string
          enabled?: boolean
          id?: string
          peptide_id?: string
          peptide_name?: string
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      renpho_credentials: {
        Row: {
          created_at: string
          email_encrypted: string
          id: string
          last_sync_at: string | null
          password_hash_encrypted: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_encrypted: string
          id?: string
          last_sync_at?: string | null
          password_hash_encrypted: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_encrypted?: string
          id?: string
          last_sync_at?: string | null
          password_hash_encrypted?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          cancelled_at: string | null
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          paypal_payer_id: string | null
          paypal_subscription_id: string | null
          plan_id: string | null
          price_amount: number
          started_at: string | null
          status: Database["public"]["Enums"]["membership_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paypal_payer_id?: string | null
          paypal_subscription_id?: string | null
          plan_id?: string | null
          price_amount?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          paypal_payer_id?: string | null
          paypal_subscription_id?: string | null
          plan_id?: string | null
          price_amount?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["membership_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrypt_credential: {
        Args: { encrypted_text: string; encryption_key: string }
        Returns: string
      }
      encrypt_credential: {
        Args: { encryption_key: string; plain_text: string }
        Returns: string
      }
      has_active_membership: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      membership_status: "active" | "cancelled" | "expired" | "pending"
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
      membership_status: ["active", "cancelled", "expired", "pending"],
    },
  },
} as const
