export type ProductImage = {
  id?: string;
  url: string;
  is_primary?: boolean;
  sort_order?: number;
};

export type ProductSize = {
  id: string;
  size: string;
  stock_qty: number;
  sort_order?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  team?: string | null;
  season?: string | null;
  player?: string | null;
  league?: string | null;
  price: number | string;
  original_price?: number | string | null;
  discount_percent?: number | string | null;
  rating?: number | string | null;
  review_count?: number | string | null;
  sold_count?: number | string | null;
  new_arrival?: boolean;
  featured?: boolean;
  sizes?: ProductSize[];
  images?: ProductImage[];
  category_id?: string | null;
  material?: string | null;
  fit?: string | null;
  care_instructions?: string | null;
};
