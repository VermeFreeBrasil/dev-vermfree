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
      meta_ads: {
        Row: {
          id: number
          date: string | null
          act_number: string | null
          business_id: string | null
          ad_id: string | null
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string | null
          campaign_name: string | null
          date_start: string | null
          date_stop: string | null
          ctr: number | null
          cpm: number | null
          cpc: number | null
          spend: number | null
          clicks: number | null
          impressions: number | null
          reach: number | null
          frequency: number | null
          actions: string | null
          action_values: string | null
          cost_per_action_type: string | null
          inserted_at: string | null
        }
        Insert: Partial<Database["public"]["Tables"]["meta_ads"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["meta_ads"]["Row"]>
        Relationships: []
      }
      compra_aprovada: {
        Row: {
          id: number
          data: string
          id_compra: number | null
          email: string | null
          nome: string | null
          telefone: string | null
          produto: string | null
          valor: number
          quantidade: string | null
          desconto: string | null
          frete: number | null
          cupom: string | null
          pagamento: string | null
          utm_campaign: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_content: string | null
          utm_term: string | null
          quiz: string | null
          plataforma: string | null
        }
        Insert: Partial<Database["public"]["Tables"]["compra_aprovada"]["Row"]>
        Update: Partial<Database["public"]["Tables"]["compra_aprovada"]["Row"]>
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
