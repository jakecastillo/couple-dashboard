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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          couple_id: string;
          your_name: string | null;
          partner_name: string | null;
          anniversary_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          couple_id: string;
          your_name?: string | null;
          partner_name?: string | null;
          anniversary_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          couple_id?: string;
          your_name?: string | null;
          partner_name?: string | null;
          anniversary_date?: string | null;
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      couple_settings: {
        Row: {
          couple_id: string;
          allowlist_emails: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          couple_id: string;
          allowlist_emails?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          allowlist_emails?: string[];
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      memories: {
        Row: {
          id: string;
          couple_id: string;
          title: string;
          memory_date: string;
          location: string | null;
          story: string | null;
          memory_year: number;
          memory_month: number;
          memory_day: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          title: string;
          memory_date: string;
          location?: string | null;
          story?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          memory_date?: string;
          location?: string | null;
          story?: string | null;
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      memory_photos: {
        Row: {
          id: string;
          couple_id: string;
          memory_id: string;
          storage_path: string;
          caption: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          memory_id: string;
          storage_path: string;
          caption?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          caption?: string | null;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      wishlist_items: {
        Row: {
          id: string;
          couple_id: string;
          title: string;
          category: "date_night" | "trip" | "gift" | "food" | "someday";
          status: "idea" | "planned" | "done";
          notes: string | null;
          target_date: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          title: string;
          category: "date_night" | "trip" | "gift" | "food" | "someday";
          status?: "idea" | "planned" | "done";
          notes?: string | null;
          target_date?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          category?: "date_night" | "trip" | "gift" | "food" | "someday";
          status?: "idea" | "planned" | "done";
          notes?: string | null;
          target_date?: string | null;
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      notes: {
        Row: {
          id: string;
          couple_id: string;
          title: string;
          body: string;
          pinned: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          title: string;
          body: string;
          pinned?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          pinned?: boolean;
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
      seed_templates: {
        Row: {
          id: string;
          kind: "memory" | "wishlist_item" | "note";
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          kind: "memory" | "wishlist_item" | "note";
          payload: Json;
          created_at?: string;
        };
        Update: {
          kind?: "memory" | "wishlist_item" | "note";
          payload?: Json;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
