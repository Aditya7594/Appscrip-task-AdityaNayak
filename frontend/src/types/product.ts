interface ProductImage {
  url: string;
  alt: string;
  position: number;
}

interface ProductCategory {
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
  currency: 'USD';
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

interface PaginatedMeta {
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

export interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}
