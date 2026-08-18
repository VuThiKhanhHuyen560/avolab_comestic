-- AVOLAB COSMETICS - MySQL / MariaDB schema for XAMPP
CREATE DATABASE IF NOT EXISTS `avolab_cosmetics` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `avolab_cosmetics`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

-- Drop tables in reverse foreign-key dependency order
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS support_ticket_messages;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS loyalty_transactions;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS order_reviews;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS marketplace_orders;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS rewards;
DROP TABLE IF EXISTS loyalty_tiers;
DROP TABLE IF EXISTS stock_transfers;
DROP TABLE IF EXISTS content_banners;
DROP TABLE IF EXISTS beauty_articles;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS sales_channels;
DROP TABLE IF EXISTS stores;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS customer_profiles;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- 1. USERS TABLE (Authentication & Global Accounts)
-- ============================================================================
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL CHECK (role IN ('CUSTOMER', 'STAFF', 'ADMIN')),
    avatar VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- 2. CUSTOMERS & CUSTOMER PROFILES (CRM 360 Core)
-- ============================================================================
CREATE TABLE customers (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    skin_type VARCHAR(50) DEFAULT 'Sensitive',
    skin_concerns TEXT DEFAULT '[]', -- JSON Array
    loyalty_points INTEGER NOT NULL DEFAULT 100,
    loyalty_tier VARCHAR(50) NOT NULL DEFAULT 'Seed',
    customer_segment VARCHAR(50) DEFAULT 'Botanical Enthusiast',
    lifetime_value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_orders INTEGER NOT NULL DEFAULT 0,
    last_order_at TIMESTAMP,
    avatar VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_code ON customers(customer_code);

CREATE TABLE customer_profiles (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    date_of_birth DATE,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip VARCHAR(20),
    address_country VARCHAR(100) DEFAULT 'USA',
    preferred_language VARCHAR(20) DEFAULT 'en',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. PHYSICAL STORES & WAREHOUSES
-- ============================================================================
CREATE TABLE stores (
    id VARCHAR(64) PRIMARY KEY,
    store_name VARCHAR(200) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    hours VARCHAR(100),
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    is_bopis_available BOOLEAN NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10000,
    current_stock INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 4. SALES CHANNELS (Omnichannel Architecture)
-- ============================================================================
CREATE TABLE sales_channels (
    id VARCHAR(64) PRIMARY KEY,
    channel_name VARCHAR(100) UNIQUE NOT NULL,
    channel_type VARCHAR(50) NOT NULL CHECK (channel_type IN ('WEBSITE', 'SHOPEE', 'TIKTOK_SHOP', 'LAZADA', 'PHYSICAL_STORE')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    commission_rate DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. CATEGORIES & PRODUCTS
-- ============================================================================
CREATE TABLE categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(500),
    parent_category VARCHAR(64),
    display_order INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id VARCHAR(64) PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    image VARCHAR(500) NOT NULL,
    secondary_images TEXT DEFAULT '[]', -- JSON Array
    description TEXT NOT NULL,
    benefits TEXT DEFAULT '[]',         -- JSON Array
    ingredients TEXT DEFAULT '[]',      -- JSON Array
    skin_types TEXT DEFAULT '[]',       -- JSON Array
    skin_concerns TEXT DEFAULT '[]',    -- JSON Array
    size VARCHAR(50) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    is_vegan BOOLEAN NOT NULL DEFAULT 1,
    is_featured BOOLEAN NOT NULL DEFAULT 0,
    tags TEXT DEFAULT '[]',             -- JSON Array
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);

CREATE TABLE product_variants (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 6. CENTRALIZED INVENTORY
-- ============================================================================
CREATE TABLE inventory (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id VARCHAR(64) REFERENCES product_variants(id) ON DELETE SET NULL,
    location_id VARCHAR(64) NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('STORE', 'WAREHOUSE')),
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 20,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_product_location UNIQUE (product_id, location_id)
);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);

-- ============================================================================
-- 7. ORDERS, ORDER ITEMS, PAYMENTS & MARKETPLACE ORDERS
-- ============================================================================
CREATE TABLE orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    channel_id VARCHAR(64) REFERENCES sales_channels(id),
    sales_channel VARCHAR(50) NOT NULL DEFAULT 'Website',
    fulfillment_type VARCHAR(20) NOT NULL DEFAULT 'DELIVERY' CHECK (fulfillment_type IN ('DELIVERY', 'BOPIS')),
    store_id VARCHAR(64) REFERENCES stores(id) ON DELETE SET NULL,
    store_name VARCHAR(200),
    shipping_street VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_country VARCHAR(100) DEFAULT 'USA',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CREDIT_CARD',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'FAILED', 'REFUNDED')),
    order_status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (order_status IN (
        'PENDING', 'PROCESSING', 'PICKING', 'PACKED', 'SHIPPED', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED', 'REFUNDED'
    )),
    qr_code_data VARCHAR(500),
    picked_by_staff VARCHAR(100),
    notes TEXT,
    external_order_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_channel ON orders(sales_channel);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE TABLE order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    variant_id VARCHAR(64) REFERENCES product_variants(id) ON DELETE SET NULL,
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE TABLE payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'PAID',
    paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marketplace_orders (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    channel_id VARCHAR(64) NOT NULL REFERENCES sales_channels(id),
    external_order_id VARCHAR(100) UNIQUE NOT NULL,
    external_customer_id VARCHAR(100),
    raw_status VARCHAR(50) NOT NULL,
    synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. CARTS, CART ITEMS & WISHLIST (Persistent Multi-Device)
-- ============================================================================
CREATE TABLE carts (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id VARCHAR(64) PRIMARY KEY,
    cart_id VARCHAR(64) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id VARCHAR(64) REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);

CREATE TABLE wishlist_items (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wishlist_customer_product UNIQUE (customer_id, product_id)
);

-- ============================================================================
-- ORDER-LEVEL REVIEWS & RATINGS
-- ============================================================================
CREATE TABLE order_reviews (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_number VARCHAR(64) NOT NULL,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_order_review_order UNIQUE (order_id)
);

CREATE INDEX idx_order_reviews_customer ON order_reviews(customer_id);

-- ============================================================================
-- 9. PRODUCT REVIEWS & RATINGS
-- ============================================================================
CREATE TABLE product_reviews (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    author VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);

-- ============================================================================
-- 10. LOYALTY PROGRAM & TRANSACTIONS
-- ============================================================================
CREATE TABLE loyalty_tiers (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    min_points INTEGER NOT NULL,
    discount_percent DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    benefits TEXT DEFAULT '[]', -- JSON Array
    birthday_reward VARCHAR(255),
    free_shipping BOOLEAN NOT NULL DEFAULT 0,
    early_access BOOLEAN NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE rewards (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    points_required INTEGER NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    expiration_days INTEGER NOT NULL DEFAULT 90,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE loyalty_transactions (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'EARN', 'REDEEM', 'BONUS', 'EXPIRE'
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 11. SUBSCRIPTIONS & AUTO-REFILL
-- ============================================================================
CREATE TABLE subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    interval_days INTEGER NOT NULL DEFAULT 30,
    next_refill_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 12. PROMOTIONS & MARKETING CAMPAIGNS
-- ============================================================================
CREATE TABLE promotions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(30) NOT NULL DEFAULT 'PERCENTAGE',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_limit INTEGER NOT NULL DEFAULT 1000,
    used_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    eligible_categories TEXT DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campaigns (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 13. CONTENT, FAQS, ARTICLES & BANNERS
-- ============================================================================
CREATE TABLE content_banners (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image VARCHAR(500) NOT NULL,
    cta_text VARCHAR(100),
    link_url VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE beauty_articles (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    cover_image VARCHAR(500) NOT NULL,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT DEFAULT '[]',
    publication_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED'
);

CREATE TABLE faqs (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 14. SUPPORT TICKETS & MESSAGES
-- ============================================================================
CREATE TABLE support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(id),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE support_ticket_messages (
    id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 15. AUDIT LOGS, NOTIFICATIONS, TRANSFERS & SYSTEM SETTINGS
-- ============================================================================
CREATE TABLE audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

CREATE TABLE notifications (
    id VARCHAR(64) PRIMARY KEY,
    recipient_role VARCHAR(20) NOT NULL DEFAULT 'ALL',
    recipient_user_id VARCHAR(64),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'SYSTEM',
    `read` BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    link VARCHAR(100) NULL
);

CREATE TABLE stock_transfers (
    id VARCHAR(64) PRIMARY KEY,
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    source_location_id VARCHAR(64) NOT NULL,
    source_location_name VARCHAR(200) NOT NULL,
    destination_location_id VARCHAR(64) NOT NULL,
    destination_location_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_settings (
    id VARCHAR(64) PRIMARY KEY,
    store_name VARCHAR(200) NOT NULL DEFAULT 'AVOLAB Botanical Cosmetics',
    contact_email VARCHAR(255) NOT NULL DEFAULT 'care@avolab.com',
    support_phone VARCHAR(50) NOT NULL DEFAULT '+1 (800) 555-AVOLAB',
    default_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '$',
    enable_bopis BOOLEAN NOT NULL DEFAULT 1,
    free_shipping_threshold DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    low_stock_threshold INTEGER NOT NULL DEFAULT 20,
    ai_recommendation_engine BOOLEAN NOT NULL DEFAULT 1,
    points_per_dollar INTEGER NOT NULL DEFAULT 1,
    redemption_ratio DECIMAL(5, 2) NOT NULL DEFAULT 0.05,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SEED DATA INITIALIZATION (Omnichannel AVOLAB Dataset)
-- ============================================================================

-- Sales Channels
INSERT INTO sales_channels (id, channel_name, channel_type, status, commission_rate) VALUES
('chan-1', 'Website', 'WEBSITE', 'ACTIVE', 0.00),
('chan-2', 'Shopee', 'SHOPEE', 'ACTIVE', 3.50),
('chan-3', 'TikTok Shop', 'TIKTOK_SHOP', 'ACTIVE', 4.00),
('chan-4', 'Lazada', 'LAZADA', 'ACTIVE', 3.00),
('chan-5', 'Physical Store', 'PHYSICAL_STORE', 'ACTIVE', 0.00);

-- Stores & Warehouses
INSERT INTO stores (id, store_name, address, city, phone, hours, latitude, longitude, is_bopis_available, status) VALUES
('store-1', 'AVOLAB Flagship Sanctuary - Soho', '482 Broome St', 'New York, NY 10013', '+1 (212) 555-0192', '10:00 AM - 8:00 PM', 40.7223, -73.9987, 1, 'ACTIVE'),
('store-2', 'AVOLAB Eco-Boutique - Venice Beach', '1301 Abbot Kinney Blvd', 'Venice, CA 90291', '+1 (310) 555-0144', '11:00 AM - 7:00 PM', 33.9903, -118.4651, 1, 'ACTIVE'),
('store-3', 'AVOLAB Botanical Lab - Austin Domain', '11601 Century Oaks Terrace', 'Austin, TX 78758', '+1 (512) 555-0188', '10:00 AM - 9:00 PM', 30.4014, -97.7247, 1, 'ACTIVE');

INSERT INTO warehouses (id, name, code, address, capacity, current_stock, status) VALUES
('wh-1', 'Central Fulfillment Hub - New Jersey', 'WH-NJ-01', '100 Distribution Way, Edison, NJ', 50000, 32400, 'ACTIVE'),
('wh-2', 'West Coast Logistics Center - Reno', 'WH-NV-02', '450 Desert Commerce Blvd, Reno, NV', 40000, 24600, 'ACTIVE');

-- Users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status) VALUES
('admin-01', 'admin@avolab.com', 'Demo@123', 'Victoria', 'Sterling', '+1 (800) 555-0100', 'ADMIN', 'ACTIVE'),
('staff-01', 'staff@avolab.com', 'Demo@123', 'Marcus', 'Chen', '+1 (800) 555-0101', 'STAFF', 'ACTIVE'),
('cust-01', 'claire.vance@example.com', 'Demo@123', 'Claire', 'Vance', '+1 (555) 234-5678', 'CUSTOMER', 'ACTIVE'),
('cust-02', 'elena.rostova@example.com', 'Demo@123', 'Elena', 'Rostova', '+1 (555) 345-6789', 'CUSTOMER', 'ACTIVE'),
('cust-03', 'sarah.jenkins@example.com', 'Demo@123', 'Sarah', 'Jenkins', '+1 (555) 456-7890', 'CUSTOMER', 'ACTIVE');

-- Customers
INSERT INTO customers (id, user_id, customer_code, name, email, phone, skin_type, skin_concerns, loyalty_points, loyalty_tier, customer_segment, lifetime_value, total_orders) VALUES
('cust-01', 'cust-01', 'AVO-CUST-001', 'Claire Vance', 'claire.vance@example.com', '+1 (555) 234-5678', 'Sensitive', '["Redness & Irritation", "Dryness & Dehydration"]', 480, 'Bloom', 'VIP High Lifetime Value', 624.50, 8),
('cust-02', 'cust-02', 'AVO-CUST-002', 'Elena Rostova', 'elena.rostova@example.com', '+1 (555) 345-6789', 'Combination', '["Acne & Blemishes", "Pore Size"]', 310, 'Sprout', 'TikTok Viral Converter', 345.00, 4),
('cust-03', 'cust-03', 'AVO-CUST-003', 'Sarah Jenkins', 'sarah.jenkins@example.com', '+1 (555) 456-7890', 'Dry', '["Aging & Fine Lines", "Dryness & Dehydration"]', 850, 'Flora', 'Subscription Loyal', 1120.00, 14);

-- System Settings
INSERT INTO system_settings (id, store_name, contact_email, support_phone, default_currency, currency_symbol, enable_bopis, free_shipping_threshold, low_stock_threshold, ai_recommendation_engine, points_per_dollar, redemption_ratio) VALUES
('settings-01', 'AVOLAB Botanical Cosmetics', 'care@avolab.com', '+1 (800) 555-AVOLAB', 'USD', '$', 1, 50.00, 20, 1, 1, 0.05);

-- (Database is fully ready for high concurrency transactions and query execution)

SET FOREIGN_KEY_CHECKS=1;
