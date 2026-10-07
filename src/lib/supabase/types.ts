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
      coffee_counter: {
        Row: {
          id: string;
          slug: string;
          count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug?: string;
          count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          number: string;
          title: string;
          category: string;
          description: string;
          detailed_description: string | null;
          technologies: string[];
          github_url: string;
          live_url: string | null;
          featured: boolean;
          metrics: Json | null;
          architecture_points: string[] | null;
          banner_gradient: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          number: string;
          title: string;
          category: string;
          description: string;
          detailed_description?: string | null;
          technologies?: string[];
          github_url: string;
          live_url?: string | null;
          featured?: boolean;
          metrics?: Json | null;
          architecture_points?: string[] | null;
          banner_gradient?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: string;
          title?: string;
          category?: string;
          description?: string;
          detailed_description?: string | null;
          technologies?: string[];
          github_url?: string;
          live_url?: string | null;
          featured?: boolean;
          metrics?: Json | null;
          architecture_points?: string[] | null;
          banner_gradient?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      personal_info: {
        Row: {
          id: string;
          name: string;
          nickname: string;
          title: string;
          roles: string[];
          bio: string;
          short_bio: string;
          email: string;
          place_of_birth: string;
          gpa: string;
          education: string;
          my_approach?: string | null;
          avatar_url?: string | null;
          github: string;
          linkedin: string;
          location: string;
          availability: string;
          status: string;
          resume_url: string;
          traits: string[];
          currently: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          nickname: string;
          title: string;
          roles?: string[];
          bio: string;
          short_bio: string;
          email: string;
          place_of_birth?: string;
          gpa?: string;
          education?: string;
          my_approach?: string | null;
          avatar_url?: string | null;
          github: string;
          linkedin: string;
          location: string;
          availability: string;
          status: string;
          resume_url: string;
          traits?: string[];
          currently?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          nickname?: string;
          title?: string;
          roles?: string[];
          bio?: string;
          short_bio?: string;
          email?: string;
          place_of_birth?: string;
          gpa?: string;
          education?: string;
          my_approach?: string | null;
          avatar_url?: string | null;
          github?: string;
          linkedin?: string;
          location?: string;
          availability?: string;
          status?: string;
          resume_url?: string;
          traits?: string[];
          currently?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_coffee_count: {
        Args: {
          counter_slug?: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type CoffeeCounterRow = Database["public"]["Tables"]["coffee_counter"]["Row"];
export type ContactMessageInsert = Database["public"]["Tables"]["contact_messages"]["Insert"];
export type ContactMessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type PersonalInfoRow = Database["public"]["Tables"]["personal_info"]["Row"];
