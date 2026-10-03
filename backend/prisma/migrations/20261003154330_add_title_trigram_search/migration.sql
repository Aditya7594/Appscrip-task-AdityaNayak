-- Enable pg_trgm extension for fast substring & ILIKE pattern matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram GIN index on Product title for high-performance text search on the 'q' query parameter
CREATE INDEX product_title_trgm_idx ON "Product" USING GIN (title gin_trgm_ops);
