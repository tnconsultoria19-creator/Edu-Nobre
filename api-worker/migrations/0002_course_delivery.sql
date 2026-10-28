-- Add persistent course delivery metadata and private asset records.
-- Existing catalogue/order records are preserved.
ALTER TABLE products ADD COLUMN youtube_url TEXT;
ALTER TABLE products ADD COLUMN content_url TEXT;
ALTER TABLE products ADD COLUMN lessons_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN resource_asset_id TEXT;
ALTER TABLE products ADD COLUMN resource_asset_name TEXT;
ALTER TABLE products ADD COLUMN resource_asset_type TEXT;

ALTER TABLE orders ADD COLUMN invoice_number TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_invoice_number
  ON orders(invoice_number) WHERE invoice_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS course_assets (
  id TEXT PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  object_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK(size_bytes >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_course_assets_creator ON course_assets(creator_id, created_at);
CREATE INDEX IF NOT EXISTS idx_course_assets_product ON course_assets(product_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, product_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS payment_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_event_id TEXT NOT NULL UNIQUE,
  event_status TEXT NOT NULL,
  payload_json TEXT,
  processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
