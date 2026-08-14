export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CarRow = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  category: string;
  manufacture_year: number | null;
  seats: number | null;
  baggage: number | null;
  small_baggage: number | null;
  thumbnail: string;
  fuel: string;
  engine: string | null;
  transmission: string;
  wedding_available: boolean;
  wedding_thumbnail: string | null;
  wedding_price: number | null;
  wedding_description: string | null;
  rental_visible: boolean;
  transfer_available: boolean;
  transfer_prices: Json;
  rental_prices: Json;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      cars: {
        Row: CarRow;
        Insert: Partial<CarRow> & Pick<CarRow, "id" | "slug" | "brand" | "title">;
        Update: Partial<CarRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
