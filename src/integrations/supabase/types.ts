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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_config: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      cupons_influencers: {
        Row: {
          categoria: string | null
          created_at: string
          discount_code: string
          excluido_atribuicao: boolean
          influencer: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          discount_code: string
          excluido_atribuicao?: boolean
          influencer: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          discount_code?: string
          excluido_atribuicao?: boolean
          influencer?: string
          updated_at?: string
        }
        Relationships: []
      }
      meta_campanhas_diario: {
        Row: {
          campaign_id: string
          campaign_name: string | null
          clicks: number
          conversion_type: string | null
          conversions: number
          dia: string
          id: string
          impressions: number
          link_clicks: number
          objective: string | null
          platform_position: string
          purchase_value: number
          purchases: number
          reach: number
          spend: number
          updated_at: string
        }
        Insert: {
          campaign_id: string
          campaign_name?: string | null
          clicks?: number
          conversion_type?: string | null
          conversions?: number
          dia: string
          id?: string
          impressions?: number
          link_clicks?: number
          objective?: string | null
          platform_position?: string
          purchase_value?: number
          purchases?: number
          reach?: number
          spend?: number
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          campaign_name?: string | null
          clicks?: number
          conversion_type?: string | null
          conversions?: number
          dia?: string
          id?: string
          impressions?: number
          link_clicks?: number
          objective?: string | null
          platform_position?: string
          purchase_value?: number
          purchases?: number
          reach?: number
          spend?: number
          updated_at?: string
        }
        Relationships: []
      }
      metas: {
        Row: {
          arquivada: boolean
          ativa: boolean
          created_at: string
          id: string
          nome: string
          pedidos_alvo: number
          periodo_fim: string
          periodo_inicio: string
          setor: string | null
          slot: number
          updated_at: string
          valor_alvo: number
        }
        Insert: {
          arquivada?: boolean
          ativa?: boolean
          created_at?: string
          id?: string
          nome: string
          pedidos_alvo?: number
          periodo_fim: string
          periodo_inicio: string
          setor?: string | null
          slot: number
          updated_at?: string
          valor_alvo?: number
        }
        Update: {
          arquivada?: boolean
          ativa?: boolean
          created_at?: string
          id?: string
          nome?: string
          pedidos_alvo?: number
          periodo_fim?: string
          periodo_inicio?: string
          setor?: string | null
          slot?: number
          updated_at?: string
          valor_alvo?: number
        }
        Relationships: []
      }
      metas_dias: {
        Row: {
          dia: string
          id: string
          meta_id: string
          observacao: string | null
          peso: number
          tipo_dia: string
        }
        Insert: {
          dia: string
          id?: string
          meta_id: string
          observacao?: string | null
          peso?: number
          tipo_dia?: string
        }
        Update: {
          dia?: string
          id?: string
          meta_id?: string
          observacao?: string | null
          peso?: number
          tipo_dia?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_dias_meta_id_fkey"
            columns: ["meta_id"]
            isOneToOne: false
            referencedRelation: "metas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos_estoque: {
        Row: {
          atualizado_em: string
          base_atualizado_em: string | null
          estoque_atual: number
          estoque_base: number
          inventory_item_id: string | null
          nome: string | null
          sku: string
          updated_at: string
        }
        Insert: {
          atualizado_em?: string
          base_atualizado_em?: string | null
          estoque_atual?: number
          estoque_base?: number
          inventory_item_id?: string | null
          nome?: string | null
          sku: string
          updated_at?: string
        }
        Update: {
          atualizado_em?: string
          base_atualizado_em?: string | null
          estoque_atual?: number
          estoque_base?: number
          inventory_item_id?: string | null
          nome?: string | null
          sku?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopify_orders: {
        Row: {
          created_at: string
          currency: string
          discount_code: string | null
          financial_status: string | null
          id: string
          landing_site: string | null
          order_number: string | null
          refund_total: number
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          valor: number
        }
        Insert: {
          created_at?: string
          currency?: string
          discount_code?: string | null
          financial_status?: string | null
          id: string
          landing_site?: string | null
          order_number?: string | null
          refund_total?: number
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor?: number
        }
        Update: {
          created_at?: string
          currency?: string
          discount_code?: string | null
          financial_status?: string | null
          id?: string
          landing_site?: string | null
          order_number?: string | null
          refund_total?: number
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor?: number
        }
        Relationships: []
      }
      sync_log: {
        Row: {
          executado_em: string
          fonte: string
          id: string
          mensagem: string | null
          registros: number
          status: string
        }
        Insert: {
          executado_em?: string
          fonte: string
          id?: string
          mensagem?: string | null
          registros?: number
          status: string
        }
        Update: {
          executado_em?: string
          fonte?: string
          id?: string
          mensagem?: string | null
          registros?: number
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _http_wait: {
        Args: { req_id: number; tentativas?: number }
        Returns: Json
      }
      sync_shopify_estoque: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
