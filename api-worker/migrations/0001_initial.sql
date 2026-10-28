-- Cloudflare D1 Database Schema for Edu-Nobre

CREATE TABLE IF NOT EXISTS institutions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('consumer', 'creator', 'affiliate', 'admin')) DEFAULT 'consumer',
    institution_id TEXT REFERENCES institutions(id),
    avatar_url TEXT,
    status TEXT CHECK(status IN ('active', 'pending', 'blocked')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    product_type TEXT CHECK(product_type IN ('curso', 'ebook', 'arquivo', 'evento')) NOT NULL,
    category TEXT NOT NULL,
    price_aoa INTEGER NOT NULL,
    original_price_aoa INTEGER,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    moderation_status TEXT CHECK(moderation_status IN ('draft', 'pending', 'published', 'rejected', 'archived')) DEFAULT 'pending',
    rejection_reason TEXT,
    youtube_url TEXT,
    content_url TEXT,
    lessons_json TEXT NOT NULL DEFAULT '[]',
    resource_asset_id TEXT,
    resource_asset_name TEXT,
    resource_asset_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    affiliate_id TEXT REFERENCES users(id),
    amount_paid_aoa INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    transaction_id TEXT REFERENCES transactions(id),
    progress_percentage INTEGER DEFAULT 0,
    status TEXT CHECK(status IN ('active', 'completed', 'revoked')) DEFAULT 'active',
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS creator_profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    public_name TEXT,
    headline TEXT,
    bio TEXT,
    specialisation TEXT,
    application_status TEXT CHECK(application_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    application_note TEXT,
    reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    actor_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount_aoa INTEGER NOT NULL DEFAULT 0,
    status TEXT CHECK(status IN ('requested', 'pending_payment', 'paid', 'failed', 'cancelled', 'refunded')) DEFAULT 'requested',
    payment_provider TEXT,
    payment_reference TEXT,
    payment_method TEXT,
    invoice_number TEXT UNIQUE,
    contact_channel TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    creator_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
    unit_price_aoa INTEGER NOT NULL CHECK(unit_price_aoa >= 0),
    line_total_aoa INTEGER NOT NULL CHECK(line_total_aoa >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


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

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS auth_attempts (
    email TEXT PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 0,
    window_started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locked_until DATETIME
);

CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);
CREATE INDEX IF NOT EXISTS idx_products_moderation ON products(moderation_status, category);
CREATE INDEX IF NOT EXISTS idx_products_creator ON products(creator_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON orders(buyer_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_expiry ON sessions(user_id, expires_at);

CREATE INDEX IF NOT EXISTS idx_course_assets_creator ON course_assets(creator_id, created_at);
CREATE INDEX IF NOT EXISTS idx_course_assets_product ON course_assets(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_invoice_number ON orders(invoice_number) WHERE invoice_number IS NOT NULL;
