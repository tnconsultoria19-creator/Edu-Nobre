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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products (Courses, E-books, Files, Events)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    product_type TEXT CHECK(product_type IN ('curso', 'ebook', 'arquivo', 'evento')) NOT NULL,
    category TEXT NOT NULL,
    price_aoa INTEGER NOT NULL, -- Stored in smallest currency unit (e.g., cents if applicable, or whole AOA)
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
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
