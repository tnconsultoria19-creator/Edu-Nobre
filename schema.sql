-- Cloudflare D1 Database Schema for Digital Marketplace

-- 1. Institutions
CREATE TABLE institutions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Consumers, Creators, Affiliates)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('consumer', 'creator', 'affiliate', 'admin')) DEFAULT 'consumer',
    institution_id TEXT REFERENCES institutions(id), -- If they belong to an institution
    avatar_url TEXT,
    status TEXT CHECK(status IN ('active', 'pending', 'blocked')) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products (Courses, E-books, Files, Events)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    product_type TEXT CHECK(product_type IN ('curso', 'ebook', 'arquivo', 'evento')) NOT NULL,
    category TEXT NOT NULL,
    price_aoa INTEGER NOT NULL, -- Stored in whole AOA
    original_price_aoa INTEGER,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    moderation_status TEXT CHECK(moderation_status IN ('draft', 'pending', 'published', 'rejected', 'archived')) DEFAULT 'pending',
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Transactions / Orders
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    affiliate_id TEXT REFERENCES users(id), -- Optional affiliate tracking
    amount_paid_aoa INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enrollments / Library (Access mapping)
CREATE TABLE enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    product_id TEXT NOT NULL REFERENCES products(id),
    transaction_id TEXT REFERENCES transactions(id),
    progress_percentage INTEGER DEFAULT 0,
    status TEXT CHECK(status IN ('active', 'completed', 'revoked')) DEFAULT 'active',
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);


-- 6. Creator profiles and applications. A creator account remains pending until reviewed by an administrator.
CREATE TABLE creator_profiles (
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

-- 7. Administrative audit trail. Snapshot actor fields so history survives removal of a user account.
CREATE TABLE audit_logs (
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

-- 8. Orders represent multi-item purchase requests. Payment remains pending until confirmed by a provider.
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount_aoa INTEGER NOT NULL DEFAULT 0,
    status TEXT CHECK(status IN ('requested', 'pending_payment', 'paid', 'failed', 'cancelled', 'refunded')) DEFAULT 'requested',
    payment_provider TEXT,
    payment_reference TEXT,
    contact_channel TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    creator_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity > 0),
    unit_price_aoa INTEGER NOT NULL CHECK(unit_price_aoa >= 0),
    line_total_aoa INTEGER NOT NULL CHECK(line_total_aoa >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_products_moderation ON products(moderation_status, category);
CREATE INDEX idx_products_creator ON products(creator_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at);
CREATE INDEX idx_orders_buyer_status ON orders(buyer_id, status, created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
