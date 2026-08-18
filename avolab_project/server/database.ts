import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql, { Pool, RowDataPacket } from 'mysql2/promise';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CATEGORIES,
  INITIAL_PROMOTIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_LOYALTY_TIERS,
  INITIAL_REWARDS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_TICKETS,
} from '../src/data/initialData.js';
import { Product, Order, OrderStatus, FulfillmentType, CustomerProfile, SupportTicket } from '../src/types.js';

const PROJECT_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SQL_SCHEMA_PATH = path.join(PROJECT_ROOT, '..', 'database.sql');

function mysqlDate(value?: string | Date | null): string | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).replace('T', ' ').replace('Z', '').slice(0, 19);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function jsonArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(String(value)); } catch { return []; }
}

export class AvolabDatabase {
  private pool: Pool | null = null;
  private isInitialized = false;

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'avolab_cosmetics';

    this.pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      dateStrings: true,
    });

    await this.pool.query('SELECT 1');
    console.log(`[Database] Connected to MySQL/MariaDB ${host}:${port}/${database}`);

    // The database/schema is created by phpMyAdmin/XAMPP from database.sql.
    // The application only verifies the tables and seeds the richer demo catalog.
    await this.ensureSchema();
    await this.seedApplicationData();

    this.isInitialized = true;
    console.log('[Database] MySQL database initialized successfully.');
  }

  private get db(): Pool {
    if (!this.pool) throw new Error('Database not initialized');
    return this.pool;
  }

  private async ensureSchema(): Promise<void> {
    const [rows] = await this.db.query<RowDataPacket[]>('SHOW TABLES LIKE \'users\'');
    if (rows.length === 0) {
      throw new Error(
        'Database schema is missing. Create/import database.sql in phpMyAdmin first, then run npm run dev again.'
      );
    }

    // Backward-compatible safety: older AVOLAB databases may predate the
    // persistent audit table. Create it automatically so Audit Logs works
    // without forcing the user to recreate the whole database.
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        recipient_role VARCHAR(20) NOT NULL DEFAULT 'ALL',
        recipient_user_id VARCHAR(64),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(30) NOT NULL DEFAULT 'SYSTEM',
        \`read\` BOOLEAN NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        link VARCHAR(100) NULL
      )
    `);

    try { await this.db.query('ALTER TABLE notifications ADD COLUMN link VARCHAR(100) NULL'); } catch (_) { /* column already exists */ }

    await this.db.query(`
      CREATE TABLE IF NOT EXISTS order_reviews (
        id VARCHAR(64) PRIMARY KEY,
        order_id VARCHAR(64) NOT NULL,
        order_number VARCHAR(64) NOT NULL,
        customer_id VARCHAR(64) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_order_review_order (order_id)
      )
    `);

    await this.db.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(64) PRIMARY KEY,
        ticket_number VARCHAR(50) UNIQUE NOT NULL,
        customer_id VARCHAR(64) NOT NULL,
        customer_name VARCHAR(200) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
        priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS support_ticket_messages (
        id VARCHAR(64) PRIMARY KEY,
        ticket_id VARCHAR(64) NOT NULL,
        sender_role VARCHAR(20) NOT NULL,
        sender_name VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await this.db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(64) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        user_role VARCHAR(20) NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(100) NOT NULL,
        entity_id VARCHAR(100) NOT NULL,
        details TEXT NOT NULL
      )
    `);
  }

  private async seedApplicationData(): Promise<void> {
    const [countRows] = await this.db.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM products');
    const productCount = Number(countRows[0]?.count || 0);

    // The SQL file contains the core enterprise seed data. The TypeScript seed
    // contains the richer demo catalog used by the UI, so ensure it exists too.
    if (productCount === 0) {
      await this.seedProductsAndInventory();
    }

    await this.seedInitialOrders();
    await this.seedInitialDataCollections();
  }

  private async upsert(sql: string, params: any[]): Promise<void> {
    await this.db.execute(sql, params);
  }

  private async seedProductsAndInventory(): Promise<void> {
    for (const p of INITIAL_PRODUCTS) {
      await this.upsert(
        `INSERT INTO products (
          id, sku, name, category, price, discount_price, image, secondary_images,
          description, benefits, ingredients, skin_types, skin_concerns, size,
          stock_quantity, rating, reviews_count, is_vegan, is_featured, tags, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          sku=VALUES(sku), name=VALUES(name), category=VALUES(category), price=VALUES(price),
          discount_price=VALUES(discount_price), image=VALUES(image), secondary_images=VALUES(secondary_images),
          description=VALUES(description), benefits=VALUES(benefits), ingredients=VALUES(ingredients),
          skin_types=VALUES(skin_types), skin_concerns=VALUES(skin_concerns), size=VALUES(size),
          stock_quantity=VALUES(stock_quantity), rating=VALUES(rating), reviews_count=VALUES(reviews_count),
          is_vegan=VALUES(is_vegan), is_featured=VALUES(is_featured), tags=VALUES(tags), status=VALUES(status)`,
        [
          p.id, p.sku, p.name, p.category, p.price, p.discountPrice ?? null, p.image,
          JSON.stringify(p.secondaryImages || []), p.description,
          JSON.stringify(p.benefits || []), JSON.stringify(p.ingredients || []),
          JSON.stringify(p.skinTypes || []), JSON.stringify(p.skinConcerns || []), p.size,
          p.stockQuantity, p.rating, p.reviewsCount, p.isVegan ? 1 : 0,
          p.isFeatured ? 1 : 0, JSON.stringify(p.tags || []), 'ACTIVE'
        ]
      );

      if (p.stockByLocation?.length) {
        for (const loc of p.stockByLocation) {
          await this.upsert(
            `INSERT INTO inventory (
              id, product_id, location_id, location_name, location_type,
              quantity, reserved_quantity, available_quantity, reorder_level
            ) VALUES (?, ?, ?, ?, ?, ?, 0, ?, 20)
            ON DUPLICATE KEY UPDATE
              location_name=VALUES(location_name), location_type=VALUES(location_type),
              quantity=VALUES(quantity), available_quantity=VALUES(available_quantity)`,
            [`inv-${p.id}-${loc.locationId}`, p.id, loc.locationId, loc.locationName,
             loc.locationType, loc.quantity, loc.quantity]
          );
        }
      }
    }
  }

  private async seedInitialOrders(): Promise<void> {
    for (const o of INITIAL_ORDERS) {
      await this.upsert(
        `INSERT INTO orders (
          id, order_number, customer_id, customer_name, customer_email, customer_phone,
          sales_channel, fulfillment_type, store_id, store_name,
          shipping_street, shipping_city, shipping_state, shipping_zip,
          subtotal, discount, shipping_fee, total, currency, payment_method, payment_status,
          order_status, qr_code_data, picked_by_staff, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          order_number=VALUES(order_number), customer_name=VALUES(customer_name), customer_email=VALUES(customer_email),
          customer_phone=VALUES(customer_phone), sales_channel=VALUES(sales_channel), fulfillment_type=VALUES(fulfillment_type),
          store_id=VALUES(store_id), store_name=VALUES(store_name), subtotal=VALUES(subtotal), discount=VALUES(discount),
          shipping_fee=VALUES(shipping_fee), total=VALUES(total), payment_method=VALUES(payment_method),
          payment_status=VALUES(payment_status), order_status=VALUES(order_status), qr_code_data=VALUES(qr_code_data),
          picked_by_staff=VALUES(picked_by_staff), notes=VALUES(notes), updated_at=VALUES(updated_at)`,
        [o.id, o.orderNumber, o.customerId, o.customerName, o.customerEmail, o.customerPhone,
         o.salesChannel || o.channel || 'Website', o.fulfillmentType, o.storeId || null, o.storeName || null,
         o.shippingAddress?.street || '', o.shippingAddress?.city || '', o.shippingAddress?.state || '', o.shippingAddress?.zipCode || '',
         o.subtotal, o.discount, o.shippingFee, o.total, 'USD', o.paymentMethod, o.paymentStatus,
         o.orderStatus, o.qrCodeData || null, o.pickedByStaff || null, o.notes || null,
         mysqlDate(o.createdAt), mysqlDate(o.updatedAt)]
      );

      if (o.items?.length) {
        for (let idx = 0; idx < o.items.length; idx++) {
          const itm = o.items[idx];
          await this.upsert(
            `INSERT INTO order_items (
              id, order_id, product_id, sku, product_name, product_image, category,
              quantity, unit_price, discount_amount, total_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity=VALUES(quantity), unit_price=VALUES(unit_price), total_amount=VALUES(total_amount)`,
            [`item-${o.id}-${idx}`, o.id, itm.productId, itm.sku || 'SKU-GEN', itm.productName,
             itm.productImage, itm.category || 'Skincare', itm.quantity, itm.price, 0, itm.price * itm.quantity]
          );
        }
      }
    }
  }

  private async seedInitialDataCollections(): Promise<void> {
    for (const cat of INITIAL_CATEGORIES) {
      await this.upsert(
        `INSERT INTO categories (id, name, slug, description, image, display_order, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description), image=VALUES(image), display_order=VALUES(display_order), status=VALUES(status)`,
        [cat.id, cat.name, cat.slug, cat.description, cat.image, cat.displayOrder, cat.status]
      );
    }

    for (const promo of INITIAL_PROMOTIONS) {
      await this.upsert(
        `INSERT INTO promotions (id, name, code, description, discount_type, discount_value, min_order, max_discount,
          start_date, end_date, usage_limit, used_count, status, eligible_categories)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), discount_type=VALUES(discount_type),
          discount_value=VALUES(discount_value), min_order=VALUES(min_order), max_discount=VALUES(max_discount),
          start_date=VALUES(start_date), end_date=VALUES(end_date), usage_limit=VALUES(usage_limit), used_count=VALUES(used_count),
          status=VALUES(status), eligible_categories=VALUES(eligible_categories)`,
        [promo.id, promo.name, promo.code, promo.description, promo.discountType, promo.discountValue,
         promo.minOrder, promo.maxDiscount, promo.startDate, promo.endDate, promo.usageLimit, promo.usedCount,
         promo.status, JSON.stringify((promo as any).eligibleCategories || [])]
      );
    }

    for (const camp of INITIAL_CAMPAIGNS) {
      await this.upsert(
        `INSERT INTO campaigns (id, title, code, discount_percentage, start_date, end_date, status, usage_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), discount_percentage=VALUES(discount_percentage),
          start_date=VALUES(start_date), end_date=VALUES(end_date), status=VALUES(status), usage_count=VALUES(usage_count)`,
        [camp.id, camp.title, camp.code, camp.discountPercentage, camp.startDate, camp.endDate, camp.status, camp.usageCount]
      );
    }

    for (const tier of INITIAL_LOYALTY_TIERS) {
      await this.upsert(
        `INSERT INTO loyalty_tiers (id, name, min_points, discount_percent, benefits, birthday_reward, free_shipping, early_access, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), min_points=VALUES(min_points), discount_percent=VALUES(discount_percent),
          benefits=VALUES(benefits), birthday_reward=VALUES(birthday_reward), free_shipping=VALUES(free_shipping),
          early_access=VALUES(early_access), status=VALUES(status)`,
        [tier.id, tier.name, tier.minPoints, tier.discountPercent, JSON.stringify(tier.benefits || []), tier.birthdayReward,
         tier.freeShipping ? 1 : 0, tier.earlyAccess ? 1 : 0, tier.status]
      );
    }

    for (const rew of INITIAL_REWARDS) {
      await this.upsert(
        `INSERT INTO rewards (id, name, description, points_required, discount_value, expiration_days, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), points_required=VALUES(points_required),
          discount_value=VALUES(discount_value), expiration_days=VALUES(expiration_days), status=VALUES(status)`,
        [rew.id, rew.name, rew.description, rew.pointsRequired, rew.discountValue, rew.expirationDays, rew.status]
      );
    }

    for (const log of INITIAL_AUDIT_LOGS) {
      await this.upsert(
        `INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, entity, entity_id, details)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE timestamp=VALUES(timestamp), details=VALUES(details)`,
        [log.id, mysqlDate(log.timestamp), log.userId, log.userName, log.userRole, log.action, log.entity, log.entityId, log.details]
      );
    }

    for (const notif of INITIAL_NOTIFICATIONS) {
      await this.upsert(
        `INSERT INTO notifications (id, recipient_role, recipient_user_id, title, message, type, \`read\`, created_at, link)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           recipient_role=VALUES(recipient_role),
           recipient_user_id=VALUES(recipient_user_id),
           title=VALUES(title),
           message=VALUES(message),
           type=VALUES(type),
           \`read\`=VALUES(\`read\`),
           created_at=VALUES(created_at),
           link=VALUES(link)`,
        [
          notif.id,
          notif.recipientRole,
          notif.recipientUserId || null,
          notif.title,
          notif.message,
          notif.type,
          notif.read ? 1 : 0,
          mysqlDate(notif.createdAt),
          notif.link || null
        ]
      );
    }

    for (const t of INITIAL_SUPPORT_TICKETS) {
      await this.upsert(
        `INSERT INTO support_tickets (id, ticket_number, customer_id, customer_name, customer_email, subject, status, priority, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE subject=VALUES(subject), status=VALUES(status), priority=VALUES(priority), updated_at=VALUES(updated_at)`,
        [t.id, t.ticketNumber, t.customerId, t.customerName, t.customerEmail, t.subject, t.status, t.priority, mysqlDate(t.createdAt), mysqlDate(t.updatedAt)]
      );
      for (const msg of t.messages || []) {
        await this.upsert(
          `INSERT INTO support_ticket_messages (id, ticket_id, sender_role, sender_name, message, timestamp)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE message=VALUES(message), timestamp=VALUES(timestamp)`,
          [msg.id, t.id, msg.senderRole, msg.senderName, msg.message, mysqlDate(msg.timestamp)]
        );
      }
    }

    // Backfill demo reviews for every completed historical order exactly once.
    // Ratings are intentionally limited to 4 or 5 stars for the demo dataset.
    const [reviewRows] = await this.db.query<RowDataPacket[]>(
      `SELECT id, order_number, customer_id FROM orders WHERE order_status='COMPLETED'`
    );
    for (const order of reviewRows) {
      const reviewId = `review-seed-${order.id}`;
      const rating = Math.random() < 0.5 ? 4 : 5;
      await this.upsert(
        `INSERT INTO order_reviews (id, order_id, order_number, customer_id, rating, comment)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE order_number=VALUES(order_number)`,
        [reviewId, order.id, order.order_number, order.customer_id, rating, rating === 5 ? 'Loved the AVOLAB experience. Everything arrived exactly as expected.' : 'Great experience overall. The order was smooth and well handled.']
      );
    }
  }

  public async getProducts(): Promise<Product[]> {
    const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM products ORDER BY is_featured DESC, name ASC');
    const products: Product[] = [];

    for (const row of rows) {
      const [invRows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM inventory WHERE product_id = ?', [row.id]);
      const stockByLocation = invRows.map((r: any) => ({
        locationId: r.location_id,
        locationName: r.location_name,
        locationType: r.location_type,
        quantity: Number(r.quantity),
      }));
      const totalStock = stockByLocation.reduce((s, r) => s + r.quantity, 0);
      products.push({
        id: row.id, sku: row.sku, name: row.name, category: row.category, price: Number(row.price),
        discountPrice: row.discount_price != null ? Number(row.discount_price) : undefined,
        image: row.image, secondaryImages: jsonArray(row.secondary_images), description: row.description,
        benefits: jsonArray(row.benefits), ingredients: jsonArray(row.ingredients), skinTypes: jsonArray(row.skin_types),
        skinConcerns: jsonArray(row.skin_concerns), size: row.size,
        stockQuantity: totalStock > 0 ? totalStock : Number(row.stock_quantity),
        totalStock: totalStock > 0 ? totalStock : Number(row.stock_quantity), stockByLocation,
        rating: Number(row.rating), reviewsCount: Number(row.reviews_count), isVegan: Boolean(row.is_vegan),
        isFeatured: Boolean(row.is_featured), tags: jsonArray(row.tags),
      });
    }
    return products;
  }

  public async getOrders(): Promise<Order[]> {
    const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM orders ORDER BY created_at DESC');
    const orders: Order[] = [];
    for (const row of rows) {
      const [itemRows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM order_items WHERE order_id = ?', [row.id]);
      const items = itemRows.map((r: any) => ({
        productId: r.product_id, productName: r.product_name, productImage: r.product_image,
        sku: r.sku, price: Number(r.unit_price), quantity: Number(r.quantity), category: r.category,
      }));
      orders.push({
        id: row.id, orderNumber: row.order_number, customerId: row.customer_id, customerName: row.customer_name,
        customerEmail: row.customer_email, customerPhone: row.customer_phone || '', channel: row.sales_channel || 'Website',
        salesChannel: row.sales_channel || 'Website', fulfillmentType: row.fulfillment_type || 'DELIVERY',
        storeId: row.store_id || undefined, storeName: row.store_name || undefined,
        shippingAddress: { street: row.shipping_street || '', city: row.shipping_city || '', state: row.shipping_state || '', zipCode: row.shipping_zip || '' },
        items, subtotal: Number(row.subtotal), discount: Number(row.discount), shippingFee: Number(row.shipping_fee),
        total: Number(row.total), paymentMethod: row.payment_method, paymentStatus: row.payment_status,
        orderStatus: row.order_status, qrCodeData: row.qr_code_data || undefined, pickedByStaff: row.picked_by_staff || undefined,
        notes: row.notes || undefined, createdAt: row.created_at, updatedAt: row.updated_at,
      });
    }
    return orders;
  }

  public async getOrderReviews(customerId?: string): Promise<any[]> {
    let rows: RowDataPacket[];
    if (customerId) {
      const [result] = await this.db.execute<RowDataPacket[]>(
        `SELECT id, order_id, order_number, customer_id, rating, comment, created_at, updated_at
         FROM order_reviews WHERE customer_id=? ORDER BY created_at DESC`, [customerId]
      );
      rows = result;
    } else {
      const [result] = await this.db.query<RowDataPacket[]>(
        `SELECT id, order_id, order_number, customer_id, rating, comment, created_at, updated_at
         FROM order_reviews ORDER BY created_at DESC`
      );
      rows = result;
    }
    return rows.map((row: any) => ({
      id: row.id, orderId: row.order_id, orderNumber: row.order_number, customerId: row.customer_id,
      rating: Number(row.rating), comment: row.comment, createdAt: row.created_at, updatedAt: row.updated_at
    }));
  }

  public async upsertOrderReview(input: { id: string; orderId: string; orderNumber: string; customerId: string; rating: number; comment: string }): Promise<any> {
    await this.db.execute(
      `INSERT INTO order_reviews (id, order_id, order_number, customer_id, rating, comment, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE rating=VALUES(rating), comment=VALUES(comment), updated_at=CURRENT_TIMESTAMP`,
      [input.id, input.orderId, input.orderNumber, input.customerId, input.rating, input.comment]
    );
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `SELECT id, order_id, order_number, customer_id, rating, comment, created_at, updated_at FROM order_reviews WHERE order_id=? LIMIT 1`,
      [input.orderId]
    );
    const row: any = rows[0];
    return { id: row.id, orderId: row.order_id, orderNumber: row.order_number, customerId: row.customer_id, rating: Number(row.rating), comment: row.comment, createdAt: row.created_at, updatedAt: row.updated_at };
  }

  public async getSupportTickets(customerId?: string): Promise<SupportTicket[]> {
    let rows: RowDataPacket[];
    if (customerId) {
      const [result] = await this.db.execute<RowDataPacket[]>(`SELECT * FROM support_tickets WHERE customer_id=? ORDER BY updated_at DESC`, [customerId]);
      rows = result;
    } else {
      const [result] = await this.db.query<RowDataPacket[]>(`SELECT * FROM support_tickets ORDER BY updated_at DESC`);
      rows = result;
    }
    const tickets: SupportTicket[] = [];
    for (const row of rows) {
      const [messages] = await this.db.execute<RowDataPacket[]>(`SELECT id, sender_role, sender_name, message, timestamp FROM support_ticket_messages WHERE ticket_id=? ORDER BY timestamp ASC`, [row.id]);
      tickets.push({
        id: row.id, ticketNumber: row.ticket_number, customerId: row.customer_id, customerName: row.customer_name, customerEmail: row.customer_email,
        subject: row.subject, status: row.status, priority: row.priority, createdAt: row.created_at, updatedAt: row.updated_at,
        messages: messages.map((m: any) => ({ id: m.id, senderRole: m.sender_role, senderName: m.sender_name, message: m.message, timestamp: m.timestamp }))
      } as SupportTicket);
    }
    return tickets;
  }

  public async createSupportTicket(input: SupportTicket): Promise<SupportTicket> {
    await this.db.execute(
      `INSERT INTO support_tickets (id, ticket_number, customer_id, customer_name, customer_email, subject, status, priority, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.id, input.ticketNumber, input.customerId, input.customerName, input.customerEmail, input.subject, input.status, input.priority, mysqlDate(input.createdAt), mysqlDate(input.updatedAt)]
    );
    const first = input.messages?.[0];
    if (first) {
      await this.db.execute(
        `INSERT INTO support_ticket_messages (id, ticket_id, sender_role, sender_name, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        [first.id, input.id, first.senderRole, first.senderName, first.message, mysqlDate(first.timestamp)]
      );
    }
    return input;
  }

  public async addSupportReply(ticketId: string, senderRole: string, senderName: string, message: string): Promise<SupportTicket | null> {
    const reply = { id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), senderRole, senderName, message, timestamp: new Date().toISOString() };
    await this.db.execute(
      `INSERT INTO support_ticket_messages (id, ticket_id, sender_role, sender_name, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
      [reply.id, ticketId, senderRole, senderName, message, mysqlDate(reply.timestamp)]
    );
    await this.db.execute(`UPDATE support_tickets SET status=?, updated_at=? WHERE id=?`, [senderRole === 'CUSTOMER' ? 'OPEN' : 'IN_PROGRESS', mysqlDate(reply.timestamp), ticketId]);
    const tickets = await this.getSupportTickets();
    return tickets.find(t => t.id === ticketId) || null;
  }

  public async getAuditLogs(limit = 500): Promise<any[]> {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 500, 2000));
    const [rows] = await this.db.query<RowDataPacket[]>(
      `SELECT id, timestamp, user_id, user_name, user_role, action, entity, entity_id, details
       FROM audit_logs
       ORDER BY timestamp DESC
       LIMIT ${safeLimit}`
    );
    return rows.map((row: any) => ({
      id: row.id,
      timestamp: row.timestamp,
      userId: row.user_id,
      userName: row.user_name,
      userRole: String(row.user_role || 'ADMIN').toUpperCase(),
      action: row.action,
      entity: row.entity,
      entityId: row.entity_id,
      details: row.details,
    }));
  }

  public async insertAuditLog(log: {
    id: string; timestamp: string; userId: string; userName: string;
    userRole: string; action: string; entity: string; entityId: string; details: string;
  }): Promise<void> {
    await this.db.execute(
      `INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, entity, entity_id, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         timestamp=VALUES(timestamp), user_id=VALUES(user_id), user_name=VALUES(user_name),
         user_role=VALUES(user_role), action=VALUES(action), entity=VALUES(entity),
         entity_id=VALUES(entity_id), details=VALUES(details)`,
      [log.id, mysqlDate(log.timestamp), log.userId, log.userName, log.userRole, log.action, log.entity, log.entityId, log.details]
    );
  }

  public async getNotifications(limit = 500, role?: string, userId?: string): Promise<any[]> {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 500, 2000));
    const normalizedRole = role ? String(role).toUpperCase() : undefined;
    let rows: RowDataPacket[];

    if (normalizedRole && userId) {
      const [result] = await this.db.execute<RowDataPacket[]>(
        `SELECT id, recipient_role, recipient_user_id, title, message, type, \`read\`, created_at, link
         FROM notifications
         WHERE recipient_role='ALL'
            OR (recipient_role=? AND (recipient_user_id IS NULL OR recipient_user_id=?))
         ORDER BY created_at DESC
         LIMIT ${safeLimit}`,
        [normalizedRole, userId]
      );
      rows = result;
    } else if (normalizedRole) {
      const [result] = await this.db.execute<RowDataPacket[]>(
        `SELECT id, recipient_role, recipient_user_id, title, message, type, \`read\`, created_at, link
         FROM notifications
         WHERE recipient_role='ALL' OR recipient_role=?
         ORDER BY created_at DESC
         LIMIT ${safeLimit}`,
        [normalizedRole]
      );
      rows = result;
    } else {
      const [result] = await this.db.query<RowDataPacket[]>(
        `SELECT id, recipient_role, recipient_user_id, title, message, type, \`read\`, created_at, link
         FROM notifications
         ORDER BY created_at DESC
         LIMIT ${safeLimit}`
      );
      rows = result;
    }
    return rows.map((row: any) => ({
      id: row.id,
      recipientRole: String(row.recipient_role || 'ALL').toUpperCase(),
      recipientUserId: row.recipient_user_id || undefined,
      title: row.title,
      message: row.message,
      type: row.type,
      read: !!row.read,
      createdAt: row.created_at,
      link: row.link || undefined,
    }));
  }

  public async insertNotification(notif: {
    id: string; recipientRole: string; recipientUserId?: string; title: string;
    message: string; type: string; read?: boolean; createdAt: string; link?: string;
  }): Promise<void> {
    await this.db.execute(
      `INSERT INTO notifications (id, recipient_role, recipient_user_id, title, message, type, \`read\`, created_at, link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title=VALUES(title), message=VALUES(message), type=VALUES(type), recipient_role=VALUES(recipient_role), recipient_user_id=VALUES(recipient_user_id), link=VALUES(link)`,
      [notif.id, notif.recipientRole, notif.recipientUserId || null, notif.title, notif.message, notif.type, notif.read ? 1 : 0, mysqlDate(notif.createdAt), notif.link || null]
    );
  }

  public async markNotificationRead(id: string, userId?: string, role?: string): Promise<void> {
    const normalizedRole = role ? String(role).toUpperCase() : undefined;

    if (userId && normalizedRole) {
      await this.db.execute(
        `UPDATE notifications
         SET \`read\`=1
         WHERE id=?
           AND (
             recipient_role='ALL'
             OR (recipient_role=? AND recipient_user_id IS NULL)
             OR recipient_user_id=?
           )`,
        [id, normalizedRole, userId]
      );
    } else if (userId) {
      await this.db.execute(
        `UPDATE notifications SET \`read\`=1 WHERE id=? AND (recipient_user_id=? OR recipient_role='ALL')`,
        [id, userId]
      );
    } else if (normalizedRole) {
      await this.db.execute(
        `UPDATE notifications SET \`read\`=1 WHERE id=? AND (recipient_role=? OR recipient_role='ALL')`,
        [id, normalizedRole]
      );
    }
  }

  public async getCustomers(): Promise<CustomerProfile[]> {
    const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM customers ORDER BY lifetime_value DESC');
    return rows.map((row: any) => this.mapCustomer(row));
  }

  public async getCustomer(id: string): Promise<CustomerProfile | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
    return rows.length ? this.mapCustomer(rows[0]) : null;
  }

  private mapCustomer(row: any): CustomerProfile {
    return {
      id: row.id, name: row.name, email: row.email, phone: row.phone || '',
      skinType: row.skin_type || 'Sensitive', skinConcerns: jsonArray(row.skin_concerns),
      loyaltyPoints: Number(row.loyalty_points), loyaltyTier: row.loyalty_tier || 'Seed',
      joinedDate: row.created_at ? String(row.created_at).split(/[T ]/)[0] : '2026-01-01',
      totalSpent: Number(row.lifetime_value), orderCount: Number(row.total_orders), avatar: row.avatar || '',
    };
  }

  public async executeCreateOrderTransaction(orderInput: Partial<Order>): Promise<{ success: boolean; order?: Order; error?: string }> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();
      for (const item of orderInput.items || []) {
        const [rows] = await conn.execute<RowDataPacket[]>('SELECT stock_quantity, name FROM products WHERE id = ? FOR UPDATE', [item.productId]);
        if (!rows.length) throw new Error(`Product ${item.productName || item.productId} not found in database.`);
        const currentStock = Number(rows[0].stock_quantity);
        if (currentStock < Number(item.quantity)) throw new Error(`Insufficient stock for ${rows[0].name}. Requested: ${item.quantity}, Available: ${currentStock}.`);
        await conn.execute('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [item.quantity, item.productId]);
        const targetLoc = orderInput.storeId || 'store-1';
        await conn.execute('UPDATE inventory SET quantity = GREATEST(0, quantity - ?), available_quantity = GREATEST(0, available_quantity - ?) WHERE product_id = ? AND location_id = ?', [item.quantity, item.quantity, item.productId, targetLoc]);
      }

      const orderId = 'ord-' + Date.now();
      const orderNumber = 'AVO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      const createdAt = new Date();
      const custId = orderInput.customerId || 'cust-01';
      const custName = orderInput.customerName || 'Claire Vance';
      const custEmail = orderInput.customerEmail || 'claire.vance@example.com';
      const custPhone = orderInput.customerPhone || '+1 (555) 234-5678';
      const fulfillment = orderInput.fulfillmentType === 'BOPIS' ? 'BOPIS' : 'DELIVERY';
      const orderStatus: OrderStatus = fulfillment === 'BOPIS' ? 'PROCESSING' : 'PENDING';
      const qrData = fulfillment === 'BOPIS' ? `AVOLAB-BOPIS-${orderId}-${orderInput.storeId || 'STORE1'}-VERIFIED` : null;

      // IMPORTANT: the checkout UI can create a newly registered customer in
      // localStorage before that customer exists in SQL. The orders table has a
      // foreign key to customers, so make the customer row durable BEFORE the
      // order insert. This prevents seemingly random checkout failures where the
      // customer sees success but Staff/Admin never receive an order.
      const [existingCustomer] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM customers WHERE id = ? FOR UPDATE',
        [custId]
      );
      if (!existingCustomer.length) {
        await conn.execute(
          `INSERT INTO customers (id, user_id, customer_code, name, email, phone, skin_type, skin_concerns, loyalty_points, loyalty_tier, lifetime_value, total_orders, avatar)
           VALUES (?, NULL, ?, ?, ?, ?, 'Sensitive', '[]', 100, 'Seed', 0, 0, NULL)`,
          [custId, `CUST-${custId}`, custName, custEmail, custPhone]
        );
      } else {
        await conn.execute(
          `UPDATE customers SET name=?, email=?, phone=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
          [custName, custEmail, custPhone, custId]
        );
      }

      await conn.execute(
        `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone,
          sales_channel, fulfillment_type, store_id, store_name, shipping_street, shipping_city, shipping_state, shipping_zip,
          subtotal, discount, shipping_fee, total, currency, payment_method, payment_status, order_status, qr_code_data, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, orderNumber, custId, custName, custEmail, custPhone, orderInput.salesChannel || orderInput.channel || 'Website', fulfillment,
         orderInput.storeId || null, orderInput.storeName || null, orderInput.shippingAddress?.street || '', orderInput.shippingAddress?.city || '',
         orderInput.shippingAddress?.state || '', orderInput.shippingAddress?.zipCode || '', orderInput.subtotal || 0, orderInput.discount || 0,
         orderInput.shippingFee || 0, orderInput.total || 0, 'USD', orderInput.paymentMethod || 'CREDIT_CARD', 'PAID', orderStatus, qrData,
         orderInput.notes || null, createdAt, createdAt]
      );

      for (let i = 0; i < (orderInput.items || []).length; i++) {
        const itm = orderInput.items![i];
        await conn.execute(
          `INSERT INTO order_items (id, order_id, product_id, sku, product_name, product_image, category, quantity, unit_price, discount_amount, total_amount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [`item-${orderId}-${i}`, orderId, itm.productId, itm.sku || 'SKU-ORD', itm.productName, itm.productImage, itm.category || 'Skincare', itm.quantity, itm.price, 0, Number(itm.price) * Number(itm.quantity)]
        );
      }

      await conn.execute('UPDATE customers SET total_orders = total_orders + 1, lifetime_value = lifetime_value + ?, last_order_at = ? WHERE id = ?', [orderInput.total || 0, createdAt, custId]);
      await conn.commit();

      return {
        success: true,
        order: {
          id: orderId, orderNumber, customerId: custId, customerName: custName, customerEmail: custEmail, customerPhone: custPhone,
          channel: (orderInput.salesChannel || orderInput.channel || 'Website') as any, salesChannel: (orderInput.salesChannel || orderInput.channel || 'Website') as any,
          fulfillmentType: fulfillment as any, storeId: orderInput.storeId, storeName: orderInput.storeName, shippingAddress: orderInput.shippingAddress,
          items: orderInput.items || [], subtotal: orderInput.subtotal || 0, discount: orderInput.discount || 0, shippingFee: orderInput.shippingFee || 0,
          total: orderInput.total || 0, paymentMethod: orderInput.paymentMethod || 'CREDIT_CARD', paymentStatus: 'PAID', orderStatus,
          qrCodeData: qrData || undefined, createdAt: createdAt.toISOString(), updatedAt: createdAt.toISOString(),
        } as Order,
      };
    } catch (err: any) {
      await conn.rollback();
      console.error('[Database Transaction Error in executeCreateOrderTransaction]:', err);
      return { success: false, error: err.message || 'Transaction failed' };
    } finally {
      conn.release();
    }
  }

  public async executeUpdateOrderStatusTransaction(orderId: string, newStatus: OrderStatus, notes?: string, staffName?: string, allowBopisQrCompletion = false): Promise<{ success: boolean; order?: Order; error?: string; previousStatus?: OrderStatus }> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM orders WHERE id = ? FOR UPDATE', [orderId]);
      if (!rows.length) { await conn.rollback(); return { success: false, error: 'Order not found' }; }
      const existing = rows[0];
      const prevStatus = existing.order_status as OrderStatus;
      const fulfillment = existing.fulfillment_type as FulfillmentType;
      const updatedAt = new Date();

      // QR completion must be single-use. If another staff terminal already
      // completed the pickup while this request was in flight, reject the
      // second completion instead of creating another audit/notification trail.
      if (allowBopisQrCompletion && fulfillment === 'BOPIS' && newStatus === 'COMPLETED' && prevStatus !== 'READY_FOR_PICKUP') {
        await conn.rollback();
        return { success: false, error: prevStatus === 'COMPLETED'
          ? 'BOPIS pickup has already been verified and completed.'
          : `BOPIS order must be READY_FOR_PICKUP before QR completion. Current status: ${prevStatus}.` };
      }

      // Single source of truth for order-state transitions. Every role writes
      // through this transaction, so Admin/Staff/other pages cannot silently
      // create a different workflow than the OMS/BOPIS UI.
      if (prevStatus !== newStatus) {
        if (newStatus === 'CANCELLED' || newStatus === 'REFUNDED') {
          // cancellation/refund remains an explicit exception path
        } else if (fulfillment === 'BOPIS') {
          const allowed: Record<string, string[]> = {
            PROCESSING: ['PICKING'],
            PICKING: ['PACKED'],
            PACKED: ['READY_FOR_PICKUP'],
            READY_FOR_PICKUP: allowBopisQrCompletion ? ['COMPLETED'] : [],
          };
          if (!allowed[prevStatus]?.includes(newStatus)) {
            await conn.rollback();
            if (prevStatus === 'READY_FOR_PICKUP' && newStatus === 'COMPLETED') {
              return { success: false, error: 'BOPIS orders can only be completed after Customer QR verification.' };
            }
            return { success: false, error: `Invalid BOPIS transition: ${prevStatus} -> ${newStatus}. Required flow: PROCESSING -> PICKING -> PACKED -> READY_FOR_PICKUP -> QR Verification -> COMPLETED.` };
          }
        } else {
          const allowed: Record<string, string[]> = {
            PENDING: ['PICKING'],
            PROCESSING: ['PICKING'],
            PICKING: ['PACKED'],
            PACKED: ['SHIPPED'],
            SHIPPED: ['COMPLETED'],
          };
          if (!allowed[prevStatus]?.includes(newStatus)) {
            await conn.rollback();
            return { success: false, error: `Invalid DELIVERY transition: ${prevStatus} -> ${newStatus}. Required flow: PENDING/PROCESSING -> PICKING -> PACKED -> SHIPPED -> COMPLETED.` };
          }
        }
      }

      await conn.execute('UPDATE orders SET order_status = ?, notes = COALESCE(?, notes), picked_by_staff = COALESCE(?, picked_by_staff), updated_at = ? WHERE id = ?', [newStatus, notes || null, staffName || null, updatedAt, orderId]);

      if ((newStatus === 'CANCELLED' || newStatus === 'REFUNDED') && prevStatus !== 'CANCELLED' && prevStatus !== 'REFUNDED') {
        const [items] = await conn.execute<RowDataPacket[]>('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
        for (const itm of items) await conn.execute('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?', [itm.quantity, itm.product_id]);
      }

      if (newStatus === 'COMPLETED' && prevStatus !== 'COMPLETED') {
        const earnedPoints = Math.round(Number(existing.total));
        await conn.execute('UPDATE customers SET loyalty_points = loyalty_points + ? WHERE id = ?', [earnedPoints, existing.customer_id]);
        await conn.execute('INSERT INTO loyalty_transactions (id, customer_id, order_id, points, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?)', [`lt-${Date.now()}`, existing.customer_id, orderId, earnedPoints, 'EARN', `Earned from Order #${existing.order_number}`]);
      }

      await conn.commit();
      const orders = await this.getOrders();
      return { success: true, order: orders.find(o => o.id === orderId), previousStatus: prevStatus };
    } catch (err: any) {
      await conn.rollback();
      console.error('[Database Transaction Error in executeUpdateOrderStatusTransaction]:', err);
      return { success: false, error: err.message || 'Transaction failed' };
    } finally { conn.release(); }
  }

  public async executeAdjustStock(productId: string, locationId: string, qtyDelta: number, reason?: string): Promise<Product | null> {
    const conn = await this.db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute(
        `INSERT INTO inventory (id, product_id, location_id, location_name, location_type, quantity, reserved_quantity, available_quantity, reorder_level)
         VALUES (?, ?, ?, ?, ?, GREATEST(0, ?), 0, GREATEST(0, ?), 20)
         ON DUPLICATE KEY UPDATE
           quantity = GREATEST(0, quantity + ?),
           available_quantity = GREATEST(0, available_quantity + ?),
           updated_at = CURRENT_TIMESTAMP`,
        [`inv-${productId}-${locationId}`, productId, locationId, locationId.startsWith('wh') ? 'Warehouse' : 'Store Location', locationId.startsWith('wh') ? 'WAREHOUSE' : 'STORE', qtyDelta, qtyDelta, qtyDelta, qtyDelta]
      );
      const [sumRows] = await conn.execute<RowDataPacket[]>('SELECT COALESCE(SUM(quantity),0) AS total FROM inventory WHERE product_id = ?', [productId]);
      const totalQty = Number(sumRows[0]?.total || 0);
      await conn.execute('UPDATE products SET stock_quantity = ? WHERE id = ?', [totalQty, productId]);
      await conn.commit();
      const products = await this.getProducts();
      return products.find(p => p.id === productId) || null;
    } catch (err) {
      await conn.rollback();
      console.error('executeAdjustStock error:', err);
      return null;
    } finally { conn.release(); }
  }

  public async addProduct(input: Omit<Product, 'id'>): Promise<Product> {
    const id = 'prod-' + Date.now();
    await this.upsert(
      `INSERT INTO products (id, sku, name, category, price, discount_price, image, secondary_images, description, benefits, ingredients, skin_types, skin_concerns, size, stock_quantity, rating, reviews_count, is_vegan, is_featured, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
      [id, input.sku, input.name, input.category, input.price, input.discountPrice ?? null, input.image, JSON.stringify(input.secondaryImages || []), input.description,
       JSON.stringify(input.benefits || []), JSON.stringify(input.ingredients || []), JSON.stringify(input.skinTypes || []), JSON.stringify(input.skinConcerns || []), input.size,
       input.stockQuantity || 0, input.rating || 5, input.reviewsCount || 0, input.isVegan ? 1 : 0, input.isFeatured ? 1 : 0, JSON.stringify(input.tags || [])]
    );
    const products = await this.getProducts();
    return products.find(p => p.id === id)!;
  }

  public async updateProduct(id: string, partial: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts();
    const existing = products.find(p => p.id === id);
    if (!existing) return null;
    const merged = { ...existing, ...partial };
    await this.db.execute(
      `UPDATE products SET sku=?, name=?, category=?, price=?, discount_price=?, image=?, secondary_images=?, description=?, benefits=?, ingredients=?, skin_types=?, skin_concerns=?, size=?, stock_quantity=?, rating=?, reviews_count=?, is_vegan=?, is_featured=?, tags=? WHERE id=?`,
      [merged.sku, merged.name, merged.category, merged.price, merged.discountPrice ?? null, merged.image, JSON.stringify(merged.secondaryImages || []), merged.description,
       JSON.stringify(merged.benefits || []), JSON.stringify(merged.ingredients || []), JSON.stringify(merged.skinTypes || []), JSON.stringify(merged.skinConcerns || []), merged.size,
       merged.stockQuantity, merged.rating, merged.reviewsCount, merged.isVegan ? 1 : 0, merged.isFeatured ? 1 : 0, JSON.stringify(merged.tags || []), id]
    );
    return (await this.getProducts()).find(p => p.id === id) || null;
  }

  public async getAnalytics() {
    const orders = await this.getOrders();
    const products = await this.getProducts();
    const customers = await this.getCustomers();
    const grossRevenue = orders.reduce((sum, o) => sum + (!['CANCELLED', 'REFUNDED'].includes(o.orderStatus) ? o.total : 0), 0);
    const totalOrders = orders.length;
    const channelBreakdown: Record<string, { count: number; revenue: number }> = { Website: { count: 0, revenue: 0 }, Shopee: { count: 0, revenue: 0 }, 'TikTok Shop': { count: 0, revenue: 0 } };
    for (const o of orders) {
      const ch = o.salesChannel || o.channel || 'Website';
      if (!channelBreakdown[ch]) channelBreakdown[ch] = { count: 0, revenue: 0 };
      channelBreakdown[ch].count++;
      if (!['CANCELLED', 'REFUNDED'].includes(o.orderStatus)) channelBreakdown[ch].revenue += o.total;
    }
    return {
      grossRevenue,
      totalOrders,
      avgOrderValue: totalOrders ? grossRevenue / totalOrders : 0,
      customerCount: customers.length,
      lowStockCount: products.filter(p => p.stockQuantity < 20).length,
      channelBreakdown,
      topProducts: products.slice(0, 5),
      recentOrders: orders.slice(0, 10),
    };
  }
}

export const avolabDb = new AvolabDatabase();
