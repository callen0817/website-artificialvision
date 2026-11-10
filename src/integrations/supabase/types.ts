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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor: string | null
          created_at: string
          detail: Json | null
          id: string
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string
          detail?: Json | null
          id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          auth_user_id: string | null
          company: string | null
          consent_at: string | null
          created_at: string
          email: string
          email_verified: boolean
          id: string
          last_activity_at: string | null
          name: string | null
        }
        Insert: {
          auth_user_id?: string | null
          company?: string | null
          consent_at?: string | null
          created_at?: string
          email: string
          email_verified?: boolean
          id?: string
          last_activity_at?: string | null
          name?: string | null
        }
        Update: {
          auth_user_id?: string | null
          company?: string | null
          consent_at?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          last_activity_at?: string | null
          name?: string | null
        }
        Relationships: []
      }
      download_events: {
        Row: {
          company_at_download: string | null
          created_at: string
          customer_id: string
          id: string
          legacy_tool_customer_id: string | null
          name_at_download: string | null
          product_id: string
          source: string | null
          status: string
          version: string | null
        }
        Insert: {
          company_at_download?: string | null
          created_at?: string
          customer_id: string
          id?: string
          legacy_tool_customer_id?: string | null
          name_at_download?: string | null
          product_id: string
          source?: string | null
          status?: string
          version?: string | null
        }
        Update: {
          company_at_download?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          legacy_tool_customer_id?: string | null
          name_at_download?: string | null
          product_id?: string
          source?: string | null
          status?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlement_grants: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          kind: string
          period_end: string | null
          product_id: string
          remaining: number
          units: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          kind: string
          period_end?: string | null
          product_id: string
          remaining: number
          units: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          kind?: string
          period_end?: string | null
          product_id?: string
          remaining?: number
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "entitlement_grants_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_grants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlement_ledger: {
        Row: {
          action: string
          created_at: string
          customer_id: string
          grant_id: string | null
          id: string
          idempotency_key: string
          product_id: string
          units: number
        }
        Insert: {
          action: string
          created_at?: string
          customer_id: string
          grant_id?: string | null
          id?: string
          idempotency_key: string
          product_id: string
          units: number
        }
        Update: {
          action?: string
          created_at?: string
          customer_id?: string
          grant_id?: string | null
          id?: string
          idempotency_key?: string
          product_id?: string
          units?: number
        }
        Relationships: [
          {
            foreignKeyName: "entitlement_ledger_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_ledger_grant_id_fkey"
            columns: ["grant_id"]
            isOneToOne: false
            referencedRelation: "entitlement_grants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlement_reservations: {
        Row: {
          allocations: Json
          closed_at: string | null
          created_at: string
          customer_id: string
          expires_at: string
          id: string
          idempotency_key: string
          product_id: string
          status: string
          units_reserved: number
          units_settled: number | null
        }
        Insert: {
          allocations?: Json
          closed_at?: string | null
          created_at?: string
          customer_id: string
          expires_at?: string
          id?: string
          idempotency_key: string
          product_id: string
          status?: string
          units_reserved: number
          units_settled?: number | null
        }
        Update: {
          allocations?: Json
          closed_at?: string | null
          created_at?: string
          customer_id?: string
          expires_at?: string
          id?: string
          idempotency_key?: string
          product_id?: string
          status?: string
          units_reserved?: number
          units_settled?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "entitlement_reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlement_reservations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_entries: {
        Row: {
          accrual_date: string
          amount: number
          cash_date: string | null
          created_at: string
          created_by: string | null
          currency: string
          customer_id: string | null
          entry_type: string
          id: string
          milestone: string | null
          notes: string | null
          payment_status: string
          product_id: string | null
          provider: string | null
          source: string | null
          subcategory: string | null
          verified: boolean
        }
        Insert: {
          accrual_date: string
          amount: number
          cash_date?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          entry_type: string
          id?: string
          milestone?: string | null
          notes?: string | null
          payment_status?: string
          product_id?: string | null
          provider?: string | null
          source?: string | null
          subcategory?: string | null
          verified?: boolean
        }
        Update: {
          accrual_date?: string
          amount?: number
          cash_date?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          entry_type?: string
          id?: string
          milestone?: string | null
          notes?: string | null
          payment_status?: string
          product_id?: string | null
          provider?: string | null
          source?: string | null
          subcategory?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "financial_entries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_entries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_events: {
        Row: {
          created_at: string
          customer_id: string | null
          endpoint: string
          event_type: string | null
          id: string
          idempotency_key: string
          product_id: string
          result: Json
          status_code: number
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          endpoint: string
          event_type?: string | null
          id?: string
          idempotency_key: string
          product_id: string
          result?: Json
          status_code: number
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          endpoint?: string
          event_type?: string | null
          id?: string
          idempotency_key?: string
          product_id?: string
          result?: Json
          status_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "integration_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_memberships: {
        Row: {
          customer_id: string
          id: string
          product_id: string
          started_at: string
          status: string
          tier: string | null
        }
        Insert: {
          customer_id: string
          id?: string
          product_id: string
          started_at?: string
          status?: string
          tier?: string | null
        }
        Update: {
          customer_id?: string
          id?: string
          product_id?: string
          started_at?: string
          status?: string
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_memberships_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_memberships_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          classification: string
          created_at: string
          development_status: string
          download_available: boolean
          id: string
          logo_url: string | null
          name: string
          page_url: string | null
          parent_product_id: string | null
          pricing_model: string
          release_status: string
          subscription_available: boolean
        }
        Insert: {
          category: string
          classification: string
          created_at?: string
          development_status?: string
          download_available?: boolean
          id: string
          logo_url?: string | null
          name: string
          page_url?: string | null
          parent_product_id?: string | null
          pricing_model?: string
          release_status?: string
          subscription_available?: boolean
        }
        Update: {
          category?: string
          classification?: string
          created_at?: string
          development_status?: string
          download_available?: boolean
          id?: string
          logo_url?: string | null
          name?: string
          page_url?: string | null
          parent_product_id?: string | null
          pricing_model?: string
          release_status?: string
          subscription_available?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "products_parent_product_id_fkey"
            columns: ["parent_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      runtime_ai_usage: {
        Row: {
          allowance_consumed: number | null
          billing_units: number | null
          created_at: string
          customer_id: string | null
          id: string
          input_tokens: number | null
          job_status: string | null
          model: string | null
          operation: string | null
          output_tokens: number | null
          product_id: string
          provider: string
          provider_cost: number | null
          provider_units: number | null
          verified: boolean
        }
        Insert: {
          allowance_consumed?: number | null
          billing_units?: number | null
          created_at?: string
          customer_id?: string | null
          id?: string
          input_tokens?: number | null
          job_status?: string | null
          model?: string | null
          operation?: string | null
          output_tokens?: number | null
          product_id: string
          provider: string
          provider_cost?: number | null
          provider_units?: number | null
          verified?: boolean
        }
        Update: {
          allowance_consumed?: number | null
          billing_units?: number | null
          created_at?: string
          customer_id?: string | null
          id?: string
          input_tokens?: number | null
          job_status?: string | null
          model?: string | null
          operation?: string | null
          output_tokens?: number | null
          product_id?: string
          provider?: string
          provider_cost?: number | null
          provider_units?: number | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "runtime_ai_usage_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "runtime_ai_usage_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_customers: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          name: string
          tool_id: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
          tool_id: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          tool_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      _return_reservation: {
        Args: { _action: string; _res_id: string; _units: number }
        Returns: undefined
      }
      claim_admin: { Args: never; Returns: boolean }
      consume_entitlement: {
        Args: {
          _customer: string
          _key: string
          _product: string
          _units: number
        }
        Returns: boolean
      }
      entitlement_balance: {
        Args: { _customer: string; _product: string }
        Returns: Json
      }
      expire_stale_reservations: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_mfa: { Args: never; Returns: boolean }
      release_reservation: {
        Args: { _customer: string; _product: string; _res_id: string }
        Returns: Json
      }
      reserve_entitlement: {
        Args: {
          _customer: string
          _key: string
          _product: string
          _units: number
        }
        Returns: Json
      }
      settle_reservation: {
        Args: {
          _actual: number
          _customer: string
          _product: string
          _res_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
