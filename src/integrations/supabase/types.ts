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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      data_plans: {
        Row: {
          active: boolean
          id: string
          name: string
          network: string
          price: number
          service_slug: string
          sort_order: number
          validity: string
        }
        Insert: {
          active?: boolean
          id?: string
          name: string
          network: string
          price: number
          service_slug: string
          sort_order?: number
          validity: string
        }
        Update: {
          active?: boolean
          id?: string
          name?: string
          network?: string
          price?: number
          service_slug?: string
          sort_order?: number
          validity?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_plans_service_slug_fkey"
            columns: ["service_slug"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["slug"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          category: string
          description: string | null
          discount_percent: number
          fixed_amounts: number[]
          input_label: string
          max_amount: number
          min_amount: number
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          category: string
          description?: string | null
          discount_percent?: number
          fixed_amounts?: number[]
          input_label?: string
          max_amount?: number
          min_amount?: number
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          category?: string
          description?: string | null
          discount_percent?: number
          fixed_amounts?: number[]
          input_label?: string
          max_amount?: number
          min_amount?: number
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          meta: Json
          recipient: string | null
          reference: string
          service_name: string | null
          service_slug: string | null
          status: Database["public"]["Enums"]["txn_status"]
          token: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          meta?: Json
          recipient?: string | null
          reference: string
          service_name?: string | null
          service_slug?: string | null
          status?: Database["public"]["Enums"]["txn_status"]
          token?: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          meta?: Json
          recipient?: string | null
          reference?: string
          service_name?: string | null
          service_slug?: string | null
          status?: Database["public"]["Enums"]["txn_status"]
          token?: string | null
          type?: Database["public"]["Enums"]["txn_type"]
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          business_address: string | null
          business_name: string
          business_phone: string
          created_at: string
          expected_volume: string | null
          id: string
          review_note: string | null
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          business_address?: string | null
          business_name: string
          business_phone: string
          created_at?: string
          expected_volume?: string | null
          id?: string
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          business_address?: string | null
          business_name?: string
          business_phone?: string
          created_at?: string
          expected_volume?: string | null
          id?: string
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      vtu_transactions: {
        Row: {
          amount: number
          created_at: string
          error_message: string | null
          id: string
          metadata: Json
          network: string | null
          phone_number: string | null
          plan_id: string | null
          provider_reference: string | null
          reference: string
          service_slug: string | null
          service_type: Database["public"]["Enums"]["vtu_service_type"]
          status: Database["public"]["Enums"]["vtu_status"]
          token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          network?: string | null
          phone_number?: string | null
          plan_id?: string | null
          provider_reference?: string | null
          reference: string
          service_slug?: string | null
          service_type: Database["public"]["Enums"]["vtu_service_type"]
          status?: Database["public"]["Enums"]["vtu_status"]
          token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          error_message?: string | null
          id?: string
          metadata?: Json
          network?: string | null
          phone_number?: string | null
          plan_id?: string | null
          provider_reference?: string | null
          reference?: string
          service_slug?: string | null
          service_type?: Database["public"]["Enums"]["vtu_service_type"]
          status?: Database["public"]["Enums"]["vtu_status"]
          token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number | null
          balance_before: number | null
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json
          provider_reference: string | null
          reference: string
          status: Database["public"]["Enums"]["vtu_status"]
          type: Database["public"]["Enums"]["ledger_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json
          provider_reference?: string | null
          reference: string
          status?: Database["public"]["Enums"]["vtu_status"]
          type: Database["public"]["Enums"]["ledger_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json
          provider_reference?: string | null
          reference?: string
          status?: Database["public"]["Enums"]["vtu_status"]
          type?: Database["public"]["Enums"]["ledger_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
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
      begin_vtu_transaction: {
        Args: {
          p_amount: number
          p_metadata?: Json
          p_network?: string
          p_phone_number?: string
          p_plan_id?: string
          p_reference: string
          p_service_slug?: string
          p_service_type: Database["public"]["Enums"]["vtu_service_type"]
          p_user_id: string
        }
        Returns: {
          amount: number
          created_at: string
          error_message: string | null
          id: string
          metadata: Json
          network: string | null
          phone_number: string | null
          plan_id: string | null
          provider_reference: string | null
          reference: string
          service_slug: string | null
          service_type: Database["public"]["Enums"]["vtu_service_type"]
          status: Database["public"]["Enums"]["vtu_status"]
          token: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vtu_transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      bootstrap_account: {
        Args: { p_full_name?: string; p_phone?: string }
        Returns: undefined
      }
      finalize_vtu_transaction: {
        Args: {
          p_error_message?: string
          p_metadata?: Json
          p_provider_reference?: string
          p_reference: string
          p_status: Database["public"]["Enums"]["vtu_status"]
          p_token?: string
        }
        Returns: {
          amount: number
          created_at: string
          error_message: string | null
          id: string
          metadata: Json
          network: string | null
          phone_number: string | null
          plan_id: string | null
          provider_reference: string | null
          reference: string
          service_slug: string | null
          service_type: Database["public"]["Enums"]["vtu_service_type"]
          status: Database["public"]["Enums"]["vtu_status"]
          token: string | null
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vtu_transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      fund_wallet: {
        Args: { p_amount: number }
        Returns: {
          amount: number
          created_at: string
          id: string
          meta: Json
          recipient: string | null
          reference: string
          service_name: string | null
          service_slug: string | null
          status: Database["public"]["Enums"]["txn_status"]
          token: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      purchase_service: {
        Args: {
          p_amount: number
          p_meta?: Json
          p_recipient: string
          p_service_slug: string
        }
        Returns: {
          amount: number
          created_at: string
          id: string
          meta: Json
          recipient: string | null
          reference: string
          service_name: string | null
          service_slug: string | null
          status: Database["public"]["Enums"]["txn_status"]
          token: string | null
          type: Database["public"]["Enums"]["txn_type"]
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "user" | "vendor" | "admin"
      ledger_type: "funding" | "purchase" | "refund" | "reversal" | "adjustment"
      txn_status: "pending" | "success" | "failed" | "reversed"
      txn_type: "funding" | "purchase" | "commission" | "reversal"
      vtu_service_type: "airtime" | "data" | "electricity" | "cable" | "exam"
      vtu_status:
        | "pending"
        | "processing"
        | "successful"
        | "failed"
        | "refunded"
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
      app_role: ["user", "vendor", "admin"],
      ledger_type: ["funding", "purchase", "refund", "reversal", "adjustment"],
      txn_status: ["pending", "success", "failed", "reversed"],
      txn_type: ["funding", "purchase", "commission", "reversal"],
      vtu_service_type: ["airtime", "data", "electricity", "cable", "exam"],
      vtu_status: ["pending", "processing", "successful", "failed", "refunded"],
    },
  },
} as const
