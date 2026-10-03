export interface ProductImage {
  url: string;
  alt: string;
  position: number;
}

export interface ProductCategory {
  id: number;
  slug: string;
  name: string;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  ratingCount: number;
  category: ProductCategory;
  images: ProductImage[];
  createdAt: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  productCount: number;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  meta: PaginatedMeta;
}
