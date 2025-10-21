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
      academy_modules: {
        Row: {
          content: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          duration_minutes: number | null;
          id: string;
          is_published: boolean;
          module_order: number;
          slug: string | null;
          title: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          is_published?: boolean;
          module_order?: number;
          slug?: string | null;
          title: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          is_published?: boolean;
          module_order?: number;
          slug?: string | null;
          title?: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "academy_modules_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      announcements: {
        Row: {
          audience: string;
          body: string;
          created_at: string;
          created_by: string | null;
          ends_at: string | null;
          id: string;
          starts_at: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          audience?: string;
          body: string;
          created_at?: string;
          created_by?: string | null;
          ends_at?: string | null;
          id?: string;
          starts_at?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          audience?: string;
          body?: string;
          created_at?: string;
          created_by?: string | null;
          ends_at?: string | null;
          id?: string;
          starts_at?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      checklist_items: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          details: string | null;
          due_at: string | null;
          id: string;
          profile_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          details?: string | null;
          due_at?: string | null;
          id?: string;
          profile_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          details?: string | null;
          due_at?: string | null;
          id?: string;
          profile_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "checklist_items_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      invite_codes: {
        Row: {
          approved: boolean;
          assigned_to: string | null;
          code: string;
          created_at: string;
          id: string;
          used: boolean;
          used_at: string | null;
        };
        Insert: {
          approved?: boolean;
          assigned_to?: string | null;
          code: string;
          created_at?: string;
          id?: string;
          used?: boolean;
          used_at?: string | null;
        };
        Update: {
          approved?: boolean;
          assigned_to?: string | null;
          code?: string;
          created_at?: string;
          id?: string;
          used?: boolean;
          used_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invite_codes_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      commissions: {
        Row: {
          amount: number;
          created_at: string;
          description: string | null;
          due_at: string | null;
          id: string;
          profile_id: string | null;
          registry_item_id: string | null;
          status: "pending" | "approved" | "paid" | "cancelled";
          updated_at: string;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          description?: string | null;
          due_at?: string | null;
          id?: string;
          profile_id?: string | null;
          registry_item_id?: string | null;
          status?: "pending" | "approved" | "paid" | "cancelled";
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string | null;
          due_at?: string | null;
          id?: string;
          profile_id?: string | null;
          registry_item_id?: string | null;
          status?: "pending" | "approved" | "paid" | "cancelled";
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commissions_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commissions_registry_item_id_fkey";
            columns: ["registry_item_id"];
            referencedRelation: "registry_items";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          end_at: string | null;
          id: string;
          location: string | null;
          start_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_at?: string | null;
          id?: string;
          location?: string | null;
          start_at: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          end_at?: string | null;
          id?: string;
          location?: string | null;
          start_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      journal_entries: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          mood: string | null;
          profile_id: string;
          shared_with_concierge: boolean;
          title: string | null;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          mood?: string | null;
          profile_id: string;
          shared_with_concierge?: boolean;
          title?: string | null;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          mood?: string | null;
          profile_id?: string;
          shared_with_concierge?: boolean;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "journal_entries_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      little_moments: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          media_url: string | null;
          occurred_on: string;
          profile_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          media_url?: string | null;
          occurred_on: string;
          profile_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          media_url?: string | null;
          occurred_on?: string;
          profile_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "little_moments_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          due_date: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          mentor_id: string | null;
          onboarding_completed: boolean;
          name: string | null;
          role: "admin" | "mentor" | "member";
          time_zone: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          due_date?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          mentor_id?: string | null;
          onboarding_completed?: boolean;
          name?: string | null;
          role?: "admin" | "mentor" | "member";
          time_zone?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          due_date?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          mentor_id?: string | null;
          onboarding_completed?: boolean;
          name?: string | null;
          role?: "admin" | "mentor" | "member";
          time_zone?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
            referencedSchema: "auth";
          },
          {
            foreignKeyName: "profiles_mentor_id_fkey";
            columns: ["mentor_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      registry_items: {
        Row: {
          brand: string | null;
          category: string | null;
          created_at: string;
          id: string;
          is_purchased: boolean;
          name: string;
          notes: string | null;
          price: number | null;
          product_url: string | null;
          profile_id: string;
          quantity: number;
          updated_at: string;
        };
        Insert: {
          brand?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_purchased?: boolean;
          name: string;
          notes?: string | null;
          price?: number | null;
          product_url?: string | null;
          profile_id: string;
          quantity?: number;
          updated_at?: string;
        };
        Update: {
          brand?: string | null;
          category?: string | null;
          created_at?: string;
          id?: string;
          is_purchased?: boolean;
          name?: string;
          notes?: string | null;
          price?: number | null;
          product_url?: string | null;
          profile_id?: string;
          quantity?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "registry_items_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      waitlist_requests: {
        Row: {
          approved: boolean | null;
          approved_at: string | null;
          created_at: string | null;
          email: string;
          id: string;
          invite_code: string | null;
          name: string | null;
          role_preference: "member" | "mentor" | null;
        };
        Insert: {
          approved?: boolean | null;
          approved_at?: string | null;
          created_at?: string | null;
          email: string;
          id?: string;
          invite_code?: string | null;
          name?: string | null;
          role_preference?: "member" | "mentor" | null;
        };
        Update: {
          approved?: boolean | null;
          approved_at?: string | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          invite_code?: string | null;
          name?: string | null;
          role_preference?: "member" | "mentor" | null;
        };
        Relationships: [];
      };
      profile_questionnaire: {
        Row: {
          due_date: string | null;
          id: string;
          nursery_style: string | null;
          profile_id: string | null;
          registry_ready: boolean;
          submitted_at: string;
          top_concerns: string | null;
        };
        Insert: {
          due_date?: string | null;
          id?: string;
          nursery_style?: string | null;
          profile_id?: string | null;
          registry_ready?: boolean;
          submitted_at?: string;
          top_concerns?: string | null;
        };
        Update: {
          due_date?: string | null;
          id?: string;
          nursery_style?: string | null;
          profile_id?: string | null;
          registry_ready?: boolean;
          submitted_at?: string;
          top_concerns?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profile_questionnaire_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
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

export type Tables<
  PublicTableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][PublicTableName]["Row"];

export type TablesInsert<
  PublicTableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][PublicTableName]["Insert"];

export type TablesUpdate<
  PublicTableName extends keyof Database["public"]["Tables"]
> = Database["public"]["Tables"][PublicTableName]["Update"];
