export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      driver_entries: {
        Row: {
          car_number: number;
          created_at: string | null;
          driver_id: number | null;
          id: number;
          season_year: number;
          series_id: number | null;
          team_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          car_number: number;
          created_at?: string | null;
          driver_id?: number | null;
          id?: never;
          season_year: number;
          series_id?: number | null;
          team_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          car_number?: number;
          created_at?: string | null;
          driver_id?: number | null;
          id?: never;
          season_year?: number;
          series_id?: number | null;
          team_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "driver_entries_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "driver_entries_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "race_series";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "driver_entries_team_id_fkey";
            columns: ["team_id"];
            isOneToOne: false;
            referencedRelation: "teams";
            referencedColumns: ["id"];
          },
        ];
      };
      drivers: {
        Row: {
          created_at: string | null;
          date_of_birth: string;
          first_name: string;
          id: number;
          last_name: string;
          nationality: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          date_of_birth: string;
          first_name: string;
          id?: never;
          last_name: string;
          nationality: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          date_of_birth?: string;
          first_name?: string;
          id?: never;
          last_name?: string;
          nationality?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      race_series: {
        Row: {
          code: string;
          created_at: string | null;
          id: number;
          name: string;
          season_year: number;
          updated_at: string | null;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          id?: never;
          name: string;
          season_year: number;
          updated_at?: string | null;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          id?: never;
          name?: string;
          season_year?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      races: {
        Row: {
          created_at: string | null;
          id: number;
          race_date: string;
          race_name: string;
          series_id: number | null;
          sprint_race: boolean | null;
          track_city: string;
          track_country: string;
          track_name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: never;
          race_date: string;
          race_name: string;
          series_id?: number | null;
          sprint_race?: boolean | null;
          track_city: string;
          track_country: string;
          track_name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: never;
          race_date?: string;
          race_name?: string;
          series_id?: number | null;
          sprint_race?: boolean | null;
          track_city?: string;
          track_country?: string;
          track_name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "races_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "race_series";
            referencedColumns: ["id"];
          },
        ];
      };
      teams: {
        Row: {
          base: string | null;
          created_at: string | null;
          full_name: string;
          id: number;
          name: string;
          series_id: number | null;
          updated_at: string | null;
        };
        Insert: {
          base?: string | null;
          created_at?: string | null;
          full_name: string;
          id?: never;
          name: string;
          series_id?: number | null;
          updated_at?: string | null;
        };
        Update: {
          base?: string | null;
          created_at?: string | null;
          full_name?: string;
          id?: never;
          name?: string;
          series_id?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "teams_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "race_series";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
