export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accommodation_preferences: {
        Row: {
          amenities: Json | null
          created_at: string | null
          id: string
          location_preference: string | null
          preferred_types: string[] | null
          price_range: string | null
          star_rating: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amenities?: Json | null
          created_at?: string | null
          id?: string
          location_preference?: string | null
          preferred_types?: string[] | null
          price_range?: string | null
          star_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amenities?: Json | null
          created_at?: string | null
          id?: string
          location_preference?: string | null
          preferred_types?: string[] | null
          price_range?: string | null
          star_rating?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodation_rooms: {
        Row: {
          accommodation_id: string | null
          amenities: Json | null
          available: boolean | null
          capacity: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price_per_night: number | null
          updated_at: string | null
        }
        Insert: {
          accommodation_id?: string | null
          amenities?: Json | null
          available?: boolean | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price_per_night?: number | null
          updated_at?: string | null
        }
        Update: {
          accommodation_id?: string | null
          amenities?: Json | null
          available?: boolean | null
          capacity?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price_per_night?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_rooms_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodations: {
        Row: {
          amenities: Json | null
          canonical_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          eco_certified: boolean | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          location_id: string | null
          name: string
          og_image: string | null
          price_per_night: number | null
          provider_id: string | null
          published_at: string | null
          rating: number | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          type: Database["public"]["Enums"]["accommodation_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amenities?: Json | null
          canonical_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          eco_certified?: boolean | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string | null
          name: string
          og_image?: string | null
          price_per_night?: number | null
          provider_id?: string | null
          published_at?: string | null
          rating?: number | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          type: Database["public"]["Enums"]["accommodation_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amenities?: Json | null
          canonical_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          eco_certified?: boolean | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string | null
          name?: string
          og_image?: string | null
          price_per_night?: number | null
          provider_id?: string | null
          published_at?: string | null
          rating?: number | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          type?: Database["public"]["Enums"]["accommodation_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          difficulty: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          equipment_needed: string[] | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          location_id: string | null
          name: string
          og_image: string | null
          price: number | null
          provider_id: string | null
          published_at: string | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          difficulty?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          location_id?: string | null
          name: string
          og_image?: string | null
          price?: number | null
          provider_id?: string | null
          published_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          difficulty?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          location_id?: string | null
          name?: string
          og_image?: string | null
          price?: number | null
          provider_id?: string | null
          published_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["activity_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_permissions: {
        Row: {
          action: string
          created_at: string | null
          id: string
          resource: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          resource: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      app_permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      app_role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "app_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "app_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      app_user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "app_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      aurora_destinations: {
        Row: {
          best_months: string[] | null
          canonical_url: string | null
          cloud_conditions_notes: string | null
          created_at: string | null
          external_id: string | null
          id: string
          location_id: string | null
          og_image: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
          viewing_locations: string[] | null
        }
        Insert: {
          best_months?: string[] | null
          canonical_url?: string | null
          cloud_conditions_notes?: string | null
          created_at?: string | null
          external_id?: string | null
          id?: string
          location_id?: string | null
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          viewing_locations?: string[] | null
        }
        Update: {
          best_months?: string[] | null
          canonical_url?: string | null
          cloud_conditions_notes?: string | null
          created_at?: string | null
          external_id?: string | null
          id?: string
          location_id?: string | null
          og_image?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
          viewing_locations?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "aurora_destinations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      aurora_forecasts: {
        Row: {
          created_at: string | null
          forecast_time: string
          id: string
          kp_index: number | null
          location_id: string | null
          probability_pct: number | null
        }
        Insert: {
          created_at?: string | null
          forecast_time: string
          id?: string
          kp_index?: number | null
          location_id?: string | null
          probability_pct?: number | null
        }
        Update: {
          created_at?: string | null
          forecast_time?: string
          id?: string
          kp_index?: number | null
          location_id?: string | null
          probability_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "aurora_forecasts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          currency: string | null
          end_time: string | null
          id: string
          item_id: string
          item_type: Database["public"]["Enums"]["booking_type"]
          pax: number | null
          provider_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number | null
          trip_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          end_time?: string | null
          id?: string
          item_id: string
          item_type: Database["public"]["Enums"]["booking_type"]
          pax?: number | null
          provider_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
          trip_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          end_time?: string | null
          id?: string
          item_id?: string
          item_type?: Database["public"]["Enums"]["booking_type"]
          pax?: number | null
          provider_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
          trip_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          credits: string | null
          entity_id: string
          entity_type: string
          height: number | null
          id: string
          license: string | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          media_url: string
          sort_order: number | null
          updated_at: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          credits?: string | null
          entity_id: string
          entity_type: string
          height?: number | null
          id?: string
          license?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          media_url: string
          sort_order?: number | null
          updated_at?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          credits?: string | null
          entity_id?: string
          entity_type?: string
          height?: number | null
          id?: string
          license?: string | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          media_url?: string
          sort_order?: number | null
          updated_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      content_relationships: {
        Row: {
          created_at: string | null
          id: string
          relationship_type: string
          source_id: string
          source_type: string
          status: Database["public"]["Enums"]["content_status"] | null
          target_id: string
          target_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          relationship_type: string
          source_id: string
          source_type: string
          status?: Database["public"]["Enums"]["content_status"] | null
          target_id: string
          target_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          relationship_type?: string
          source_id?: string
          source_type?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          target_id?: string
          target_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_translations: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          field_name: string
          id: string
          language_code: string
          translated_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          field_name: string
          id?: string
          language_code: string
          translated_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          field_name?: string
          id?: string
          language_code?: string
          translated_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deals: {
        Row: {
          created_at: string
          description: string
          discount_percentage: number | null
          featured: boolean | null
          id: string
          image_url: string
          name: string
          original_price: number
          price: number
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description: string
          discount_percentage?: number | null
          featured?: boolean | null
          id?: string
          image_url: string
          name: string
          original_price: number
          price: number
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          discount_percentage?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string
          name?: string
          original_price?: number
          price?: number
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_rentals: {
        Row: {
          available_stock: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          image_url: string | null
          location_id: string | null
          name: string
          price_per_day: number
          provider_id: string | null
          rental_type: string | null
        }
        Insert: {
          available_stock?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_id?: string | null
          name: string
          price_per_day: number
          provider_id?: string | null
          rental_type?: string | null
        }
        Update: {
          available_stock?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          location_id?: string | null
          name?: string
          price_per_day?: number
          provider_id?: string | null
          rental_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_rentals_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_rentals_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ev_chargers: {
        Row: {
          address: string | null
          availability: number | null
          connector_types: string[] | null
          created_at: string | null
          current_power_kw: number | null
          device_id: string | null
          id: string
          last_updated_at: string | null
          latitude: number | null
          location_id: string | null
          longitude: number | null
          max_power_kw: number | null
          operator: string | null
          price_per_kwh: number | null
          station_name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          availability?: number | null
          connector_types?: string[] | null
          created_at?: string | null
          current_power_kw?: number | null
          device_id?: string | null
          id?: string
          last_updated_at?: string | null
          latitude?: number | null
          location_id?: string | null
          longitude?: number | null
          max_power_kw?: number | null
          operator?: string | null
          price_per_kwh?: number | null
          station_name: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          availability?: number | null
          connector_types?: string[] | null
          created_at?: string | null
          current_power_kw?: number | null
          device_id?: string | null
          id?: string
          last_updated_at?: string | null
          latitude?: number | null
          location_id?: string | null
          longitude?: number | null
          max_power_kw?: number | null
          operator?: string | null
          price_per_kwh?: number | null
          station_name?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ev_chargers_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "iot_devices"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "ev_chargers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          canonical_url: string | null
          category: Database["public"]["Enums"]["event_category"]
          created_at: string | null
          currency: string | null
          description: string | null
          end_date: string
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          location_id: string | null
          name: string
          og_image: string | null
          provider_id: string | null
          published_at: string | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          start_date: string
          status: Database["public"]["Enums"]["content_status"] | null
          ticket_price: number | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          category: Database["public"]["Enums"]["event_category"]
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date: string
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string | null
          name: string
          og_image?: string | null
          provider_id?: string | null
          published_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          start_date: string
          status?: Database["public"]["Enums"]["content_status"] | null
          ticket_price?: number | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          category?: Database["public"]["Enums"]["event_category"]
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string | null
          name?: string
          og_image?: string | null
          provider_id?: string | null
          published_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          start_date?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          ticket_price?: number | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ferries: {
        Row: {
          battery_capacity: number | null
          capacity: number | null
          current_battery: number | null
          device_id: string | null
          eta: string | null
          id: string
          last_updated_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          operator: string | null
          route_id: string | null
          speed: number | null
          status: string
        }
        Insert: {
          battery_capacity?: number | null
          capacity?: number | null
          current_battery?: number | null
          device_id?: string | null
          eta?: string | null
          id?: string
          last_updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          operator?: string | null
          route_id?: string | null
          speed?: number | null
          status?: string
        }
        Update: {
          battery_capacity?: number | null
          capacity?: number | null
          current_battery?: number | null
          device_id?: string | null
          eta?: string | null
          id?: string
          last_updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          operator?: string | null
          route_id?: string | null
          speed?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ferries_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "iot_devices"
            referencedColumns: ["device_id"]
          },
        ]
      }
      ferry_route_stops: {
        Row: {
          arrival_time: string | null
          departure_time: string | null
          id: string
          location_id: string | null
          route_id: string | null
          stop_order: number
        }
        Insert: {
          arrival_time?: string | null
          departure_time?: string | null
          id?: string
          location_id?: string | null
          route_id?: string | null
          stop_order: number
        }
        Update: {
          arrival_time?: string | null
          departure_time?: string | null
          id?: string
          location_id?: string | null
          route_id?: string | null
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "ferry_route_stops_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferry_route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "ferry_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      ferry_routes: {
        Row: {
          destination_id: string | null
          id: string
          name: string
          origin_id: string | null
        }
        Insert: {
          destination_id?: string | null
          id?: string
          name: string
          origin_id?: string | null
        }
        Update: {
          destination_id?: string | null
          id?: string
          name?: string
          origin_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ferry_routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ferry_routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      food_preferences: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          dietary_preferences: string[] | null
          favorite_cuisines: string[] | null
          food_dislikes: string[] | null
          id: string
          seafood_preference: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          favorite_cuisines?: string[] | null
          food_dislikes?: string[] | null
          id?: string
          seafood_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          dietary_preferences?: string[] | null
          favorite_cuisines?: string[] | null
          food_dislikes?: string[] | null
          id?: string
          seafood_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          name: string
          og_image: string | null
          published_at: string | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          name: string
          og_image?: string | null
          published_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          name?: string
          og_image?: string | null
          published_at?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      infrastructure_assets: {
        Row: {
          asset_type: string
          created_at: string | null
          id: string
          latitude: number | null
          location_id: string | null
          longitude: number | null
          metadata: Json | null
          name: string
          provider_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          asset_type: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_id?: string | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          provider_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          asset_type?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          location_id?: string | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          provider_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "infrastructure_assets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "infrastructure_assets_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      iot_devices: {
        Row: {
          created_at: string | null
          device_id: string
          device_type: string
          id: string
          last_seen_at: string | null
          latitude: number | null
          location_id: string | null
          longitude: number | null
          metadata: Json | null
          name: string
          provider_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id: string
          device_type: string
          id?: string
          last_seen_at?: string | null
          latitude?: number | null
          location_id?: string | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          provider_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string
          device_type?: string
          id?: string
          last_seen_at?: string | null
          latitude?: number | null
          location_id?: string | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          provider_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iot_devices_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iot_devices_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      iot_telemetry: {
        Row: {
          device_id: string | null
          id: string
          metadata: Json | null
          metric: string
          recorded_at: string | null
          unit: string | null
          value: number
        }
        Insert: {
          device_id?: string | null
          id?: string
          metadata?: Json | null
          metric: string
          recorded_at?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          device_id?: string | null
          id?: string
          metadata?: Json | null
          metric?: string
          recorded_at?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "iot_telemetry_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "iot_devices"
            referencedColumns: ["device_id"]
          },
        ]
      }
      location_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          location_id: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          location_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          location_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_images_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          canonical_url: string | null
          coordinates: unknown
          created_at: string | null
          description: string | null
          external_id: string | null
          featured: boolean | null
          hero_image_url: string | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          name: string
          og_image: string | null
          parent_location_id: string | null
          published_at: string | null
          region: string | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          type: Database["public"]["Enums"]["location_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          coordinates?: unknown
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          featured?: boolean | null
          hero_image_url?: string | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          og_image?: string | null
          parent_location_id?: string | null
          published_at?: string | null
          region?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          type: Database["public"]["Enums"]["location_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          coordinates?: unknown
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          featured?: boolean | null
          hero_image_url?: string | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          og_image?: string | null
          parent_location_id?: string | null
          published_at?: string | null
          region?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_location_id_fkey"
            columns: ["parent_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          aurora_alerts: boolean | null
          booking_updates: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          marketing: boolean | null
          marketing_emails: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          trip_reminders: boolean | null
          updated_at: string | null
          user_id: string | null
          weather_alerts: boolean | null
        }
        Insert: {
          aurora_alerts?: boolean | null
          booking_updates?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing?: boolean | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          trip_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weather_alerts?: boolean | null
        }
        Update: {
          aurora_alerts?: boolean | null
          booking_updates?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing?: boolean | null
          marketing_emails?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          trip_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          weather_alerts?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link_url: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_url?: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_url?: string | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          end_time: string | null
          id: string
          item_id: string | null
          item_type: Database["public"]["Enums"]["booking_type"] | null
          order_id: string | null
          pax: number | null
          start_time: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          item_id?: string | null
          item_type?: Database["public"]["Enums"]["booking_type"] | null
          order_id?: string | null
          pax?: number | null
          start_time?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          item_id?: string | null
          item_type?: Database["public"]["Enums"]["booking_type"] | null
          order_id?: string | null
          pax?: number | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          status: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string | null
          expires_at: string | null
          gateway: string
          gateway_order_id: string | null
          id: string
          order_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          gateway: string
          gateway_order_id?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string | null
          expires_at?: string | null
          gateway?: string
          gateway_order_id?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_preferences: {
        Row: {
          allow_recommendations: boolean | null
          analytics_tracking: boolean | null
          created_at: string | null
          id: string
          location_access: boolean | null
          personalized_recommendations: boolean | null
          profile_visibility: string | null
          share_activity: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          allow_recommendations?: boolean | null
          analytics_tracking?: boolean | null
          created_at?: string | null
          id?: string
          location_access?: boolean | null
          personalized_recommendations?: boolean | null
          profile_visibility?: string | null
          share_activity?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          allow_recommendations?: boolean | null
          analytics_tracking?: boolean | null
          created_at?: string | null
          id?: string
          location_access?: boolean | null
          personalized_recommendations?: boolean | null
          profile_visibility?: string | null
          share_activity?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "privacy_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          co2: number
          created_at: string
          id: string
          img: string
          name: string
          price: number
          rating: number
          stock: number
        }
        Insert: {
          category: string
          co2: number
          created_at?: string
          id?: string
          img: string
          name: string
          price: number
          rating?: number
          stock?: number
        }
        Update: {
          category?: string
          co2?: number
          created_at?: string
          id?: string
          img?: string
          name?: string
          price?: number
          rating?: number
          stock?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          phone_verified: boolean | null
          postal_code: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean | null
          postal_code?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          canonical_url: string | null
          contact_info: Json | null
          created_at: string | null
          cuisine: string[] | null
          description: string | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          location_id: string | null
          menu: Json | null
          name: string
          og_image: string | null
          opening_hours: Json | null
          photos: string[] | null
          price_range: string | null
          provider_id: string | null
          published_at: string | null
          rating: number | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          sustainability_score: number | null
          type: Database["public"]["Enums"]["restaurant_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          contact_info?: Json | null
          created_at?: string | null
          cuisine?: string[] | null
          description?: string | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string | null
          menu?: Json | null
          name: string
          og_image?: string | null
          opening_hours?: Json | null
          photos?: string[] | null
          price_range?: string | null
          provider_id?: string | null
          published_at?: string | null
          rating?: number | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          sustainability_score?: number | null
          type: Database["public"]["Enums"]["restaurant_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          contact_info?: Json | null
          created_at?: string | null
          cuisine?: string[] | null
          description?: string | null
          external_id?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          lat?: number | null
          lng?: number | null
          location_id?: string | null
          menu?: Json | null
          name?: string
          og_image?: string | null
          opening_hours?: Json | null
          photos?: string[] | null
          price_range?: string | null
          provider_id?: string | null
          published_at?: string | null
          rating?: number | null
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          sustainability_score?: number | null
          type?: Database["public"]["Enums"]["restaurant_type"]
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurants_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          photos: string[] | null
          product_id: string
          product_type: string
          rating: number | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          photos?: string[] | null
          product_id: string
          product_type: string
          rating?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          photos?: string[] | null
          product_id?: string
          product_type?: string
          rating?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      road_trip_stops: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location_id: string | null
          recommended_duration: string | null
          road_trip_id: string | null
          stop_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          recommended_duration?: string | null
          road_trip_id?: string | null
          stop_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          recommended_duration?: string | null
          road_trip_id?: string | null
          stop_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "road_trip_stops_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "road_trip_stops_road_trip_id_fkey"
            columns: ["road_trip_id"]
            isOneToOne: false
            referencedRelation: "road_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      road_trips: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          distance_km: number | null
          duration_days: number | null
          external_id: string | null
          id: string
          map_route: string | null
          name: string
          og_image: string | null
          published_at: string | null
          scenic_highlights: string[] | null
          search_vector: unknown
          season: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          distance_km?: number | null
          duration_days?: number | null
          external_id?: string | null
          id?: string
          map_route?: string | null
          name: string
          og_image?: string | null
          published_at?: string | null
          scenic_highlights?: string[] | null
          search_vector?: unknown
          season?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          distance_km?: number | null
          duration_days?: number | null
          external_id?: string | null
          id?: string
          map_route?: string | null
          name?: string
          og_image?: string | null
          published_at?: string | null
          scenic_highlights?: string[] | null
          search_vector?: unknown
          season?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      safety_alerts: {
        Row: {
          active_until: string | null
          created_at: string | null
          description: string | null
          id: string
          location_id: string | null
          severity: string
          title: string
        }
        Insert: {
          active_until?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          severity: string
          title: string
        }
        Update: {
          active_until?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location_id?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_alerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ski_resorts: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          difficulty_breakdown: Json | null
          external_id: string | null
          id: string
          lifts: number | null
          location_id: string | null
          og_image: string | null
          published_at: string | null
          runs: number | null
          seo_description: string | null
          seo_title: string | null
          snow_season: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          difficulty_breakdown?: Json | null
          external_id?: string | null
          id?: string
          lifts?: number | null
          location_id?: string | null
          og_image?: string | null
          published_at?: string | null
          runs?: number | null
          seo_description?: string | null
          seo_title?: string | null
          snow_season?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          difficulty_breakdown?: Json | null
          external_id?: string | null
          id?: string
          lifts?: number | null
          location_id?: string | null
          og_image?: string | null
          published_at?: string | null
          runs?: number | null
          seo_description?: string | null
          seo_title?: string | null
          snow_season?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ski_resorts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          device_id: string | null
          id: string
          message: string
          resolved_at: string | null
          severity: string
          status: string | null
          threshold: number | null
          title: string
          value: number | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          device_id?: string | null
          id?: string
          message: string
          resolved_at?: string | null
          severity: string
          status?: string | null
          threshold?: number | null
          title: string
          value?: number | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          device_id?: string | null
          id?: string
          message?: string
          resolved_at?: string | null
          severity?: string
          status?: string | null
          threshold?: number | null
          title?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "iot_devices"
            referencedColumns: ["device_id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      trails: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          distance_km: number | null
          elevation_gain_m: number | null
          estimated_duration_minutes: number | null
          external_id: string | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          location_id: string | null
          name: string
          og_image: string | null
          published_at: string | null
          route_line: unknown
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          distance_km?: number | null
          elevation_gain_m?: number | null
          estimated_duration_minutes?: number | null
          external_id?: string | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          location_id?: string | null
          name: string
          og_image?: string | null
          published_at?: string | null
          route_line?: unknown
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          distance_km?: number | null
          elevation_gain_m?: number | null
          estimated_duration_minutes?: number | null
          external_id?: string | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          location_id?: string | null
          name?: string
          og_image?: string | null
          published_at?: string | null
          route_line?: unknown
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trails_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_preferences: {
        Row: {
          created_at: string | null
          driving_license: boolean | null
          id: string
          preferred_modes: string[] | null
          priority: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          driving_license?: boolean | null
          id?: string
          preferred_modes?: string[] | null
          priority?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          driving_license?: boolean | null
          id?: string
          preferred_modes?: string[] | null
          priority?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_routes: {
        Row: {
          alerts: Json | null
          co2_emissions_kg: number | null
          created_at: string | null
          currency: string | null
          destination_id: string | null
          duration_minutes: number | null
          id: string
          live_status: string | null
          name: string
          operator: string | null
          origin_id: string | null
          price_estimate: number | null
          provider_id: string | null
          route_line: unknown
          status: Database["public"]["Enums"]["content_status"] | null
          stops: Json | null
          timetable: Json | null
          type: Database["public"]["Enums"]["transport_type"]
          updated_at: string | null
        }
        Insert: {
          alerts?: Json | null
          co2_emissions_kg?: number | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          duration_minutes?: number | null
          id?: string
          live_status?: string | null
          name: string
          operator?: string | null
          origin_id?: string | null
          price_estimate?: number | null
          provider_id?: string | null
          route_line?: unknown
          status?: Database["public"]["Enums"]["content_status"] | null
          stops?: Json | null
          timetable?: Json | null
          type: Database["public"]["Enums"]["transport_type"]
          updated_at?: string | null
        }
        Update: {
          alerts?: Json | null
          co2_emissions_kg?: number | null
          created_at?: string | null
          currency?: string | null
          destination_id?: string | null
          duration_minutes?: number | null
          id?: string
          live_status?: string | null
          name?: string
          operator?: string | null
          origin_id?: string | null
          price_estimate?: number | null
          provider_id?: string | null
          route_line?: unknown
          status?: Database["public"]["Enums"]["content_status"] | null
          stops?: Json | null
          timetable?: Json | null
          type?: Database["public"]["Enums"]["transport_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_routes_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_routes_origin_id_fkey"
            columns: ["origin_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transport_routes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_preferences: {
        Row: {
          accessibility_requirements: string[] | null
          activity_interests: string[] | null
          adventure_level: string | null
          budget_level: string | null
          children_ages: number[] | null
          created_at: string | null
          cultural_interest: string | null
          hiking_difficulty: string | null
          id: string
          indoor_outdoor_preference: string | null
          nightlife_preference: string | null
          photography_interest: boolean | null
          preferred_destinations: string[] | null
          preferred_travel_pace: string | null
          preferred_trip_duration: string | null
          preferred_trip_style: string[] | null
          sustainability_priority: string | null
          travel_companions: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accessibility_requirements?: string[] | null
          activity_interests?: string[] | null
          adventure_level?: string | null
          budget_level?: string | null
          children_ages?: number[] | null
          created_at?: string | null
          cultural_interest?: string | null
          hiking_difficulty?: string | null
          id?: string
          indoor_outdoor_preference?: string | null
          nightlife_preference?: string | null
          photography_interest?: boolean | null
          preferred_destinations?: string[] | null
          preferred_travel_pace?: string | null
          preferred_trip_duration?: string | null
          preferred_trip_style?: string[] | null
          sustainability_priority?: string | null
          travel_companions?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accessibility_requirements?: string[] | null
          activity_interests?: string[] | null
          adventure_level?: string | null
          budget_level?: string | null
          children_ages?: number[] | null
          created_at?: string | null
          cultural_interest?: string | null
          hiking_difficulty?: string | null
          id?: string
          indoor_outdoor_preference?: string | null
          nightlife_preference?: string | null
          photography_interest?: boolean | null
          preferred_destinations?: string[] | null
          preferred_travel_pace?: string | null
          preferred_trip_duration?: string | null
          preferred_trip_style?: string[] | null
          sustainability_priority?: string | null
          travel_companions?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_activities: {
        Row: {
          activity_title: string | null
          activity_type: string | null
          co2_kg: number | null
          created_at: string | null
          end_time: string | null
          id: string
          location_id: string | null
          notes: string | null
          start_time: string | null
          trip_day_id: string | null
          trip_id: string | null
        }
        Insert: {
          activity_title?: string | null
          activity_type?: string | null
          co2_kg?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          start_time?: string | null
          trip_day_id?: string | null
          trip_id?: string | null
        }
        Update: {
          activity_title?: string | null
          activity_type?: string | null
          co2_kg?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          start_time?: string | null
          trip_day_id?: string | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_activities_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_activities_trip_day_id_fkey"
            columns: ["trip_day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_activities_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_days: {
        Row: {
          created_at: string | null
          date: string | null
          day_number: number
          description: string | null
          id: string
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          day_number: number
          description?: string | null
          id?: string
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          day_number?: number
          description?: string | null
          id?: string
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_segments: {
        Row: {
          co2_kg: number | null
          created_at: string | null
          distance_km: number | null
          end_location_id: string | null
          end_time: string | null
          id: string
          notes: string | null
          sequence_order: number
          start_location_id: string | null
          start_time: string | null
          transport_mode: string | null
          trip_day_id: string | null
          trip_id: string | null
          updated_at: string | null
        }
        Insert: {
          co2_kg?: number | null
          created_at?: string | null
          distance_km?: number | null
          end_location_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          sequence_order: number
          start_location_id?: string | null
          start_time?: string | null
          transport_mode?: string | null
          trip_day_id?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Update: {
          co2_kg?: number | null
          created_at?: string | null
          distance_km?: number | null
          end_location_id?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          sequence_order?: number
          start_location_id?: string | null
          start_time?: string | null
          transport_mode?: string | null
          trip_day_id?: string | null
          trip_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_segments_end_location_id_fkey"
            columns: ["end_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_segments_start_location_id_fkey"
            columns: ["start_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_segments_trip_day_id_fkey"
            columns: ["trip_day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_segments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_stays: {
        Row: {
          accommodation_name: string | null
          booking_reference: string | null
          check_in: string | null
          check_out: string | null
          co2_kg: number | null
          created_at: string | null
          id: string
          location_id: string | null
          trip_day_id: string | null
          trip_id: string | null
        }
        Insert: {
          accommodation_name?: string | null
          booking_reference?: string | null
          check_in?: string | null
          check_out?: string | null
          co2_kg?: number | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          trip_day_id?: string | null
          trip_id?: string | null
        }
        Update: {
          accommodation_name?: string | null
          booking_reference?: string | null
          check_in?: string | null
          check_out?: string | null
          co2_kg?: number | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          trip_day_id?: string | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_stays_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stays_trip_day_id_fkey"
            columns: ["trip_day_id"]
            isOneToOne: false
            referencedRelation: "trip_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stays_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          budget_nok: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: Database["public"]["Enums"]["trip_status"] | null
          title: string
          total_co2_kg: number | null
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          budget_nok?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["trip_status"] | null
          title: string
          total_co2_kg?: number | null
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          budget_nok?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["trip_status"] | null
          title?: string
          total_co2_kg?: number | null
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_security_settings: {
        Row: {
          created_at: string | null
          mfa_enabled: boolean | null
          session_timeout_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          mfa_enabled?: boolean | null
          session_timeout_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          mfa_enabled?: boolean | null
          session_timeout_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_security_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sustainability_impact: {
        Row: {
          co2_saved_kg: number | null
          created_at: string | null
          eco_trips_completed: number | null
          id: string
          sustainability_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          co2_saved_kg?: number | null
          created_at?: string | null
          eco_trips_completed?: number | null
          id?: string
          sustainability_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          co2_saved_kg?: number | null
          created_at?: string | null
          eco_trips_completed?: number | null
          id?: string
          sustainability_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sustainability_impact_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_snapshots: {
        Row: {
          cloud_cover_pct: number | null
          condition: string | null
          id: string
          location_id: string | null
          recorded_at: string | null
          temperature_c: number | null
          visibility_km: number | null
          wind_speed_kmh: number | null
        }
        Insert: {
          cloud_cover_pct?: number | null
          condition?: string | null
          id?: string
          location_id?: string | null
          recorded_at?: string | null
          temperature_c?: number | null
          visibility_km?: number | null
          wind_speed_kmh?: number | null
        }
        Update: {
          cloud_cover_pct?: number | null
          condition?: string | null
          id?: string
          location_id?: string | null
          recorded_at?: string | null
          temperature_c?: number | null
          visibility_km?: number | null
          wind_speed_kmh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_snapshots_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      wildlife: {
        Row: {
          created_at: string | null
          description: string | null
          featured: boolean | null
          habitat: string | null
          id: string
          image_url: string | null
          name: string
          scientific_name: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          habitat?: string | null
          id?: string
          image_url?: string | null
          name: string
          scientific_name?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          habitat?: string | null
          id?: string
          image_url?: string | null
          name?: string
          scientific_name?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wildlife_habitats: {
        Row: {
          best_months: string[] | null
          created_at: string | null
          description: string | null
          id: string
          region: string
          species_id: string | null
          updated_at: string | null
        }
        Insert: {
          best_months?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          region: string
          species_id?: string | null
          updated_at?: string | null
        }
        Update: {
          best_months?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          region?: string
          species_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wildlife_habitats_species_id_fkey"
            columns: ["species_id"]
            isOneToOne: false
            referencedRelation: "wildlife_species"
            referencedColumns: ["id"]
          },
        ]
      }
      wildlife_species: {
        Row: {
          behavior: string | null
          canonical_url: string | null
          common_name: string
          conservation_status: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          facts: string[] | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          og_image: string | null
          published_at: string | null
          scientific_name: string
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          behavior?: string | null
          canonical_url?: string | null
          common_name: string
          conservation_status?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          facts?: string[] | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          og_image?: string | null
          published_at?: string | null
          scientific_name: string
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          behavior?: string | null
          canonical_url?: string | null
          common_name?: string
          conservation_status?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          facts?: string[] | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          og_image?: string | null
          published_at?: string | null
          scientific_name?: string
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_name?: string | null
          source_type?: Database["public"]["Enums"]["data_source_type"] | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      winter_resorts: {
        Row: {
          avalanche_risk: number | null
          base_pass_price: number | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          location_id: string | null
          name: string
          open_lifts: number | null
          rentals_available: boolean | null
          snow_conditions: string | null
          snow_depth_cm: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          total_lifts: number | null
          updated_at: string | null
          weather_data: Json | null
        }
        Insert: {
          avalanche_risk?: number | null
          base_pass_price?: number | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          location_id?: string | null
          name: string
          open_lifts?: number | null
          rentals_available?: boolean | null
          snow_conditions?: string | null
          snow_depth_cm?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          total_lifts?: number | null
          updated_at?: string | null
          weather_data?: Json | null
        }
        Update: {
          avalanche_risk?: number | null
          base_pass_price?: number | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          image_alt?: string | null
          image_category?: string | null
          image_credit?: string | null
          image_source?: string | null
          image_url?: string | null
          image_verified?: boolean | null
          image_verified_at?: string | null
          location_id?: string | null
          name?: string
          open_lifts?: number | null
          rentals_available?: boolean | null
          snow_conditions?: string | null
          snow_depth_cm?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          total_lifts?: number | null
          updated_at?: string | null
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "winter_resorts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      provider_listings_view: {
        Row: {
          base_price: number | null
          category: string | null
          created_at: string | null
          currency: string | null
          id: string | null
          item_type: string | null
          name: string | null
          provider_id: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      check_availability: {
        Args: {
          p_end_date: string
          p_item_id: string
          p_item_type: string
          p_start_date: string
        }
        Returns: boolean
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_admin_dashboard_stats: { Args: never; Returns: Json }
      get_nearby_activities: {
        Args: { max_results?: number; target_location_id: string }
        Returns: {
          canonical_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          difficulty: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          equipment_needed: string[] | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          location_id: string | null
          name: string
          og_image: string | null
          price: number | null
          provider_id: string | null
          published_at: string | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "activities"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_nearby_candidates: {
        Args: {
          p_lat: number
          p_limit?: number
          p_lon: number
          p_radius_km?: number
        }
        Returns: {
          average_rating: number
          base_price_nok: number
          category: string
          distance_km: number
          location_id: string
          name: string
          subcategory: string
        }[]
      }
      get_nearby_locations: {
        Args: {
          max_results?: number
          radius_meters?: number
          target_lat: number
          target_lng: number
        }
        Returns: {
          canonical_url: string | null
          coordinates: unknown
          created_at: string | null
          description: string | null
          external_id: string | null
          featured: boolean | null
          hero_image_url: string | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          name: string
          og_image: string | null
          parent_location_id: string | null
          published_at: string | null
          region: string | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          type: Database["public"]["Enums"]["location_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "locations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_nearby_restaurants: {
        Args: {
          max_results?: number
          radius_meters?: number
          target_lat: number
          target_lng: number
        }
        Returns: {
          canonical_url: string | null
          contact_info: Json | null
          created_at: string | null
          cuisine: string[] | null
          description: string | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          location_id: string | null
          menu: Json | null
          name: string
          og_image: string | null
          opening_hours: Json | null
          photos: string[] | null
          price_range: string | null
          provider_id: string | null
          published_at: string | null
          rating: number | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          sustainability_score: number | null
          type: Database["public"]["Enums"]["restaurant_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "restaurants"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_nearby_stays: {
        Args: {
          max_results?: number
          radius_meters?: number
          target_lat: number
          target_lng: number
        }
        Returns: {
          amenities: Json | null
          canonical_url: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          eco_certified: boolean | null
          external_id: string | null
          featured: boolean | null
          id: string
          image_alt: string | null
          image_category: string | null
          image_credit: string | null
          image_source: string | null
          image_url: string | null
          image_verified: boolean | null
          image_verified_at: string | null
          lat: number | null
          lng: number | null
          location_id: string | null
          name: string
          og_image: string | null
          price_per_night: number | null
          provider_id: string | null
          published_at: string | null
          rating: number | null
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          source_name: string | null
          source_type: Database["public"]["Enums"]["data_source_type"] | null
          status: Database["public"]["Enums"]["content_status"] | null
          type: Database["public"]["Enums"]["accommodation_type"]
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "accommodations"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_provider_dashboard_stats: {
        Args: { p_provider_id: string }
        Returns: Json
      }
      get_smart_map_markers: {
        Args: {
          filter_layers?: string[]
          max_lat: number
          max_lng: number
          min_lat: number
          min_lng: number
        }
        Returns: {
          average_rating: number
          base_price_nok: number
          category: string
          description: string
          featured: boolean
          id: string
          image_url: string
          latitude: number
          location_id: string
          longitude: number
          name: string
          slug: string
          subcategory: string
          type: string
        }[]
      }
      get_user_permissions: {
        Args: { p_user_id: string }
        Returns: {
          name: string
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      global_search: {
        Args: {
          filter_category?: string
          limit_count?: number
          offset_count?: number
          search_query: string
        }
        Returns: Database["public"]["CompositeTypes"]["search_result"][]
        SetofOptions: {
          from: "*"
          to: "search_result"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_permission: {
        Args: { p_permission_name: string; p_user_id: string }
        Returns: boolean
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_checkout:
        | {
            Args: { p_currency: string; p_items: Json; p_user_id: string }
            Returns: string
          }
        | {
            Args: {
              p_currency: string
              p_items: Json
              p_total_amount: number
              p_user_id: string
            }
            Returns: string
          }
      process_payment_webhook: {
        Args: { p_gateway_order_id: string }
        Returns: boolean
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      accommodation_type:
        | "HOTEL"
        | "CABIN"
        | "HOSTEL"
        | "RESORT"
        | "LODGE"
        | "CAMPING"
        | "APARTMENT"
        | "ECO_STAY"
        | "UNIQUE_STAY"
      activity_type:
        | "HIKING"
        | "SKIING"
        | "SIGHTSEEING"
        | "CULTURE"
        | "WATER_SPORTS"
        | "NATURE"
        | "ADVENTURE"
        | "WINTER"
        | "WILDLIFE"
      booking_status:
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED"
        | "COMPLETED"
        | "PENDING_PAYMENT"
      booking_type:
        | "ACCOMMODATION"
        | "ACTIVITY"
        | "TRANSPORT"
        | "RESTAURANT"
        | "PACKAGE"
        | "EVENT"
        | "PRODUCT"
        | "DEAL"
      content_status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
      data_source_type:
        | "demo"
        | "editorial"
        | "external"
        | "imported"
        | "verified"
      event_category:
        | "FESTIVAL"
        | "CONCERT"
        | "SPORTS"
        | "CULTURAL"
        | "SEASONAL"
      location_type:
        | "FJORD"
        | "MOUNTAIN"
        | "CITY"
        | "VILLAGE"
        | "ISLAND"
        | "NATIONAL_PARK"
        | "SKI_RESORT"
        | "TRAIL"
        | "FOREST"
        | "COAST"
        | "BEACH"
        | "VIEWPOINT"
        | "MUSEUM"
        | "LANDMARK"
        | "WILDLIFE"
        | "ATTRACTION"
        | "PARK"
        | "AIRPORT"
        | "STATION"
        | "REGION"
        | "COUNTY"
        | "MUNICIPALITY"
      media_type: "HERO" | "GALLERY" | "THUMBNAIL" | "DOCUMENT"
      notification_type:
        | "SYSTEM"
        | "BOOKING"
        | "TRIP"
        | "PROMOTION"
        | "SAFETY"
        | "PAYMENT"
        | "WEATHER"
        | "AURORA"
        | "TRANSPORT"
      order_status:
        | "PENDING"
        | "PAID"
        | "FAILED"
        | "REFUNDED"
        | "PENDING_PAYMENT"
      payment_method: "CARD" | "VIPPS" | "APPLE_PAY" | "GOOGLE_PAY"
      payment_status:
        | "PENDING"
        | "PROCESSING"
        | "SUCCESS"
        | "FAILED"
        | "REFUND_PENDING"
        | "REFUNDED"
      restaurant_type:
        | "FINE_DINING"
        | "CASUAL"
        | "CAFE"
        | "STREET_FOOD"
        | "PUB"
        | "BAKERY"
        | "FOOD_EXPERIENCE"
      transport_type:
        | "TRAIN"
        | "BUS"
        | "FERRY"
        | "FLIGHT"
        | "CAR_RENTAL"
        | "WALKING"
        | "BIKE"
      trip_status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED"
      user_role: "USER" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN" | "ANALYST"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      search_result: {
        entity_id: string | null
        entity_type: string | null
        title: string | null
        description: string | null
        slug: string | null
        hero_image_url: string | null
        rank: number | null
        source_type: string | null
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      accommodation_type: [
        "HOTEL",
        "CABIN",
        "HOSTEL",
        "RESORT",
        "LODGE",
        "CAMPING",
        "APARTMENT",
        "ECO_STAY",
        "UNIQUE_STAY",
      ],
      activity_type: [
        "HIKING",
        "SKIING",
        "SIGHTSEEING",
        "CULTURE",
        "WATER_SPORTS",
        "NATURE",
        "ADVENTURE",
        "WINTER",
        "WILDLIFE",
      ],
      booking_status: [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
        "PENDING_PAYMENT",
      ],
      booking_type: [
        "ACCOMMODATION",
        "ACTIVITY",
        "TRANSPORT",
        "RESTAURANT",
        "PACKAGE",
        "EVENT",
        "PRODUCT",
        "DEAL",
      ],
      content_status: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      data_source_type: [
        "demo",
        "editorial",
        "external",
        "imported",
        "verified",
      ],
      event_category: ["FESTIVAL", "CONCERT", "SPORTS", "CULTURAL", "SEASONAL"],
      location_type: [
        "FJORD",
        "MOUNTAIN",
        "CITY",
        "VILLAGE",
        "ISLAND",
        "NATIONAL_PARK",
        "SKI_RESORT",
        "TRAIL",
        "FOREST",
        "COAST",
        "BEACH",
        "VIEWPOINT",
        "MUSEUM",
        "LANDMARK",
        "WILDLIFE",
        "ATTRACTION",
        "PARK",
        "AIRPORT",
        "STATION",
        "REGION",
        "COUNTY",
        "MUNICIPALITY",
      ],
      media_type: ["HERO", "GALLERY", "THUMBNAIL", "DOCUMENT"],
      notification_type: [
        "SYSTEM",
        "BOOKING",
        "TRIP",
        "PROMOTION",
        "SAFETY",
        "PAYMENT",
        "WEATHER",
        "AURORA",
        "TRANSPORT",
      ],
      order_status: [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
        "PENDING_PAYMENT",
      ],
      payment_method: ["CARD", "VIPPS", "APPLE_PAY", "GOOGLE_PAY"],
      payment_status: [
        "PENDING",
        "PROCESSING",
        "SUCCESS",
        "FAILED",
        "REFUND_PENDING",
        "REFUNDED",
      ],
      restaurant_type: [
        "FINE_DINING",
        "CASUAL",
        "CAFE",
        "STREET_FOOD",
        "PUB",
        "BAKERY",
        "FOOD_EXPERIENCE",
      ],
      transport_type: [
        "TRAIN",
        "BUS",
        "FERRY",
        "FLIGHT",
        "CAR_RENTAL",
        "WALKING",
        "BIKE",
      ],
      trip_status: ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"],
      user_role: ["USER", "PROVIDER", "ADMIN", "SUPER_ADMIN", "ANALYST"],
    },
  },
} as const

