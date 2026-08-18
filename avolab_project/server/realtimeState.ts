import { Response } from 'express';
import { avolabDb } from './database.js';
import {
  INITIAL_USERS, INITIAL_STORES, INITIAL_WAREHOUSES, INITIAL_CUSTOMER,
  INITIAL_CAMPAIGNS, INITIAL_NOTIFICATIONS, INITIAL_CATEGORIES, INITIAL_PROMOTIONS,
  INITIAL_LOYALTY_TIERS, INITIAL_REWARDS, INITIAL_STOCK_TRANSFERS, INITIAL_BANNERS,
  INITIAL_FAQS, INITIAL_ARTICLES, INITIAL_SYSTEM_SETTINGS, INITIAL_SUPPORT_TICKETS
} from '../src/data/initialData.js';
import { Product, Order, OrderStatus, Campaign, Promotion, AuditLog, NotificationItem, SupportTicket } from '../src/types.js';

class RealtimeStateEngine {
  private sseClients: Response[] = [];

  public registerSseClient(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);
    this.sseClients.push(res);
  }

  public removeSseClient(res: Response) {
    const idx = this.sseClients.indexOf(res);
    if (idx !== -1) this.sseClients.splice(idx, 1);
  }

  public broadcast(eventType: string, payload: any) {
    const eventMsg = `data: ${JSON.stringify({ type: 'EVENT', eventType, payload, timestamp: new Date().toISOString() })}\n\n`;
    this.sseClients.forEach(client => { try { client.write(eventMsg); } catch (_) {} });
  }

  public async getState(role?: string, userId?: string) {
    const [products, orders, customers, analytics] = await Promise.all([
      avolabDb.getProducts(), avolabDb.getOrders(), avolabDb.getCustomers(), avolabDb.getAnalytics()
    ]);
    return {
      users: INITIAL_USERS,
      products,
      stores: INITIAL_STORES,
      warehouses: INITIAL_WAREHOUSES,
      orders,
      customer: customers[0] || INITIAL_CUSTOMER,
      customers,
      campaigns: INITIAL_CAMPAIGNS,
      promotions: INITIAL_PROMOTIONS,
      categories: INITIAL_CATEGORIES,
      loyaltyTiers: INITIAL_LOYALTY_TIERS,
      rewards: INITIAL_REWARDS,
      stockTransfers: INITIAL_STOCK_TRANSFERS,
      banners: INITIAL_BANNERS,
      faqs: INITIAL_FAQS,
      articles: INITIAL_ARTICLES,
      systemSettings: INITIAL_SYSTEM_SETTINGS,
      notifications: await avolabDb.getNotifications(1000, role, userId),
      supportTickets: role === 'CUSTOMER' && userId
        ? await avolabDb.getSupportTickets(userId)
        : await avolabDb.getSupportTickets(),
      orderReviews: role === 'CUSTOMER' && userId
        ? await avolabDb.getOrderReviews(userId)
        : await avolabDb.getOrderReviews(),
      analytics,
      auditLogs: await avolabDb.getAuditLogs(1000),
      timestamp: new Date().toISOString()
    };
  }

  public async createAuditLog(
    userRole: 'CUSTOMER' | 'STAFF' | 'ADMIN',
    userName: string,
    action: string,
    entity: string,
    entityId: string,
    details: string,
    userId?: string,
    persistAndBroadcast = true
  ): Promise<AuditLog> {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10),
      timestamp: new Date().toISOString(),
      userId: userId || `${userRole.toLowerCase()}-01`,
      userName, userRole, action, entity, entityId, details
    };

    if (persistAndBroadcast) {
      try {
        await avolabDb.insertAuditLog(log);
        this.broadcast('audit.created', log);
      } catch (error) {
        console.error('[AuditLog] Failed to persist audit event:', error);
        // Do not broadcast a phantom audit record that is not in SQL.
      }
    }

    return log;
  }

  public async createClientAuditLog(input: {
    userRole: 'CUSTOMER' | 'STAFF' | 'ADMIN';
    userId: string; userName: string; action: string; entity: string; entityId: string; details: string;
  }) {
    return this.createAuditLog(
      input.userRole, input.userName, input.action, input.entity, input.entityId,
      input.details, input.userId, true
    );
  }

  public async createNotification(
    recipientRole: 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'ALL',
    title: string,
    message: string,
    type: 'ORDER' | 'INVENTORY' | 'PROMO' | 'SYSTEM' | 'LOYALTY',
    recipientUserId?: string,
    link?: string
  ): Promise<NotificationItem> {
    const notif: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10),
      recipientRole, recipientUserId, title, message, type, read: false,
      createdAt: new Date().toISOString(), link
    };

    // Persist FIRST. SSE is only an acceleration layer; never show a notification
    // that was not successfully committed to the centralized SQL database.
    await avolabDb.insertNotification(notif);
    this.broadcast('notification.created', notif);
    return notif;
  }

  private async emitOrderNotifications(order: Order, previousStatus?: OrderStatus, actorName?: string) {
    const statusLabel = order.orderStatus.replace(/_/g, ' ').toLowerCase();
    const isBopis = order.fulfillmentType === 'BOPIS';
    const customerLink = 'ORDERS';
    const staffLink = isBopis && order.orderStatus === 'READY_FOR_PICKUP' ? 'STAFF_BOPIS' : 'STAFF_ORDERS';
    const adminLink = 'ADMIN_ORDERS';

    // Customer: only this customer receives the message.
    if (previousStatus === undefined) {
      await this.createNotification(
        'CUSTOMER',
        `Order #${order.orderNumber} Confirmed`,
        `Your ${isBopis ? 'store pickup' : 'home delivery'} order has been received and is now ${statusLabel}.`,
        'ORDER', order.customerId, customerLink
      );
    } else {
      const customerMessage = isBopis && order.orderStatus === 'READY_FOR_PICKUP'
        ? `Your order is ready for pickup at ${order.storeName || 'the selected AVOLAB store'}. Please present your customer QR code at the counter.`
        : order.orderStatus === 'COMPLETED'
          ? `Your order has been completed successfully.`
          : `Your order status is now ${statusLabel}.`;
      await this.createNotification('CUSTOMER', `Order #${order.orderNumber} Update`, customerMessage, 'ORDER', order.customerId, customerLink);
    }

    // Staff: all staff see the operational event; link is chosen by workflow.
    let staffTitle = `Order #${order.orderNumber} ${order.orderStatus.replace(/_/g, ' ')}`;
    let staffMessage = `Order status changed to ${order.orderStatus.replace(/_/g, ' ')}.`;
    if (previousStatus === undefined) {
      staffTitle = `New ${order.fulfillmentType} Order #${order.orderNumber}`;
      staffMessage = `${order.customerName} placed a ${isBopis ? 'store pickup' : 'home delivery'} order. Open OMS to begin fulfillment.`;
    } else if (isBopis && order.orderStatus === 'READY_FOR_PICKUP') {
      staffTitle = `BOPIS Ready #${order.orderNumber}`;
      staffMessage = `${order.customerName}'s order is ready for counter pickup. Open BOPIS Verification.`;
    } else if (isBopis && order.orderStatus === 'COMPLETED') {
      staffTitle = `BOPIS Completed #${order.orderNumber}`;
      staffMessage = `Customer pickup was verified successfully${actorName ? ` by ${actorName}` : ''}.`;
    } else if (!isBopis && order.orderStatus === 'SHIPPED') {
      staffTitle = `Delivery Shipped #${order.orderNumber}`;
      staffMessage = `Order #${order.orderNumber} has been dispatched to the customer.`;
    } else if (!isBopis && order.orderStatus === 'COMPLETED') {
      staffTitle = `Delivery Completed #${order.orderNumber}`;
      staffMessage = `Order #${order.orderNumber} has been marked delivered.`;
    }
    await this.createNotification('STAFF', staffTitle, staffMessage, 'ORDER', undefined, staffLink);

    // Admin: every order lifecycle event is visible in the master order manager.
    let adminTitle = previousStatus === undefined
      ? `New Order #${order.orderNumber}`
      : `Order #${order.orderNumber} Updated`;
    let adminMessage = previousStatus === undefined
      ? `${isBopis ? 'BOPIS store pickup' : 'Home delivery'} order received from ${order.customerName}. Total $${Number(order.total).toFixed(2)}.`
      : `Order status changed from ${previousStatus} to ${order.orderStatus}.`;
    if (isBopis && order.orderStatus === 'READY_FOR_PICKUP') {
      adminTitle = `BOPIS Ready #${order.orderNumber}`;
      adminMessage = `Order #${order.orderNumber} is READY_FOR_PICKUP at ${order.storeName || order.storeId || 'assigned store'}.`;
    } else if (isBopis && order.orderStatus === 'COMPLETED') {
      adminTitle = `BOPIS Completed #${order.orderNumber}`;
      adminMessage = `QR verification completed${actorName ? ` by ${actorName}` : ''}. Order is now COMPLETED.`;
    }
    await this.createNotification('ADMIN', adminTitle, adminMessage, 'ORDER', undefined, adminLink);
  }

  public async createOrder(orderInput: Partial<Order>) {
    const result = await avolabDb.executeCreateOrderTransaction(orderInput);
    if (!result.success || !result.order) return result;
    const newOrder = result.order;
    await this.createAuditLog('CUSTOMER', newOrder.customerName, 'PLACE_ORDER', 'Order', newOrder.id, `Placed ${newOrder.fulfillmentType} order #${newOrder.orderNumber} via ${newOrder.salesChannel || 'Website'} ($${newOrder.total})`, newOrder.customerId);
    await this.emitOrderNotifications(newOrder);
    this.broadcast('order.created', newOrder);
    this.broadcast('inventory.updated', await avolabDb.getProducts());
    this.broadcast('analytics.updated', await avolabDb.getAnalytics());
    return { success: true, order: newOrder };
  }

  public async updateOrderStatus(orderId: string, newStatus: OrderStatus, notes?: string, staffName?: string, actorRole: 'STAFF' | 'ADMIN' = 'STAFF', actorUserId?: string) {
    const result = await avolabDb.executeUpdateOrderStatusTransaction(orderId, newStatus, notes, staffName);
    if (!result.success || !result.order) return result;
    const order = result.order;
    const actor = staffName || 'Staff Member';
    const previousStatus = result.previousStatus as OrderStatus | undefined;
    await this.createAuditLog(actorRole, actor, 'UPDATE_ORDER_STATUS', 'Order', order.id, `Order #${order.orderNumber} status changed from ${previousStatus || 'UNKNOWN'} to ${newStatus}`, actorUserId);
    await this.emitOrderNotifications(order, previousStatus, actor);
    this.broadcast('order.updated', order);
    this.broadcast('inventory.updated', await avolabDb.getProducts());
    this.broadcast('analytics.updated', await avolabDb.getAnalytics());
    return { success: true, order };
  }

  public async addProduct(prodInput: Omit<Product, 'id'>) {
    const newProd = await avolabDb.addProduct(prodInput);
    this.createAuditLog('ADMIN', 'Admin User', 'CREATE_PRODUCT', 'Product', newProd.id, `Created product "${newProd.name}" ($${newProd.price})`);
    this.broadcast('product.created', newProd);
    this.broadcast('inventory.updated', await avolabDb.getProducts());
    return newProd;
  }

  public async updateProduct(id: string, partial: Partial<Product>) {
    const updated = await avolabDb.updateProduct(id, partial);
    if (!updated) return null;
    this.createAuditLog('ADMIN', 'Admin User', 'UPDATE_PRODUCT', 'Product', updated.id, `Updated product details for "${updated.name}"`);
    this.broadcast('product.updated', updated);
    this.broadcast('inventory.updated', await avolabDb.getProducts());
    return updated;
  }

  public async adjustStock(productId: string, locationId: string, qtyDelta: number, reason?: string) {
    const updatedProduct = await avolabDb.executeAdjustStock(productId, locationId, qtyDelta, reason);
    if (!updatedProduct) return null;
    this.createAuditLog('STAFF', 'Inventory Staff', 'ADJUST_INVENTORY', 'Product', productId, `Adjusted stock by ${qtyDelta > 0 ? '+' : ''}${qtyDelta}. Reason: ${reason || 'Manual count'}`);
    this.broadcast('inventory.updated', await avolabDb.getProducts());
    this.broadcast('product.updated', updatedProduct);
    return updatedProduct;
  }

  public addCampaign(campaignInput: Omit<Campaign, 'id'>) {
    const newCamp = { ...campaignInput, id: 'camp-' + Date.now() };
    this.createAuditLog('ADMIN', 'Marketing Admin', 'CREATE_CAMPAIGN', 'Campaign', newCamp.id, `Created campaign "${newCamp.title}" (${newCamp.code})`);
    this.broadcast('campaign.created', newCamp);
    return newCamp;
  }
  public updateCampaign(id: string, partial: Partial<Campaign>) {
    this.createAuditLog('ADMIN', 'Marketing Admin', 'UPDATE_CAMPAIGN', 'Campaign', id, 'Updated campaign details');
    this.broadcast('campaign.updated', { id, ...partial });
    return { id, ...partial };
  }
  public addPromotion(promoInput: Omit<Promotion, 'id'>) {
    const newPromo = { ...promoInput, id: 'promo-' + Date.now() };
    this.createAuditLog('ADMIN', 'Marketing Admin', 'CREATE_PROMOTION', 'Promotion', newPromo.id, `Created promo "${newPromo.code}"`);
    this.broadcast('promotion.created', newPromo);
    return newPromo;
  }
  public updatePromotion(id: string, partial: Partial<Promotion>) {
    this.createAuditLog('ADMIN', 'Marketing Admin', 'UPDATE_PROMOTION', 'Promotion', id, 'Updated promo details');
    this.broadcast('promotion.updated', { id, ...partial });
    return { id, ...partial };
  }

  public async verifyAndCompleteBopisQr(qrData: string, staffName: string, staffStoreId?: string) {
    if (!qrData || typeof qrData !== 'string') {
      return { success: false, message: 'Invalid QR code format presented.' };
    }

    const normalizedQr = qrData.trim();
    const orders = await avolabDb.getOrders();

    // IMPORTANT: Do not split the QR string by '-' to extract the order ID.
    // AVOLAB order IDs and store IDs can themselves contain hyphens, e.g.
    // AVOLAB-BOPIS-ord-10088-store-1-VERIFIED.
    // Match the complete generated QR string against the actual order record first.
    let order = orders.find(o => {
      if (o.qrCodeData && o.qrCodeData.trim() === normalizedQr) return true;

      if (o.fulfillmentType !== 'BOPIS') return false;

      const expected = `AVOLAB-BOPIS-${o.id}-${o.storeId || 'STORE1'}-VERIFIED`;
      const expectedOrderNumber = `AVOLAB-BOPIS-${o.orderNumber}-${o.storeId || 'STORE1'}-VERIFIED`;
      return normalizedQr === expected || normalizedQr === expectedOrderNumber;
    });

    // Also accept a raw order ID / order number for staff-side testing.
    if (!order) {
      order = orders.find(o =>
        o.id === normalizedQr ||
        o.orderNumber === normalizedQr ||
        o.qrCodeData === normalizedQr
      );
    }

    if (!order) {
      return {
        success: false,
        message: 'Unable to match QR Code to an active AVOLAB BOPIS order.'
      };
    }

    if (order.fulfillmentType !== 'BOPIS') {
      return {
        success: false,
        message: `Order #${order.orderNumber} is not a BOPIS pickup order.`
      };
    }
    if (!order) return { success: false, message: 'Order record not found.' };
    if (staffStoreId && order.storeId && staffStoreId !== order.storeId) {
      return {
        success: false,
        message: `Order #${order.orderNumber} is assigned to ${order.storeName || order.storeId}. The active staff store is ${staffStoreId}.`
      };
    }
    if (order.orderStatus === 'COMPLETED') return { success: false, message: `Order #${order.orderNumber} pickup was already verified and completed previously!`, order };
    if (order.orderStatus === 'CANCELLED') return { success: false, message: `Order #${order.orderNumber} was cancelled. Cannot complete pickup.`, order };
    if (order.orderStatus !== 'READY_FOR_PICKUP') {
      return {
        success: false,
        message: `Order #${order.orderNumber} is ${order.orderStatus}. It must be READY_FOR_PICKUP before QR handover.`
      };
    }
    const result = await avolabDb.executeUpdateOrderStatusTransaction(order.id, 'COMPLETED', 'BOPIS Store Pickup Handover Verified', staffName, true);
    if (!result.success || !result.order) return { success: false, message: result.error || 'Failed to complete pickup transaction.' };
    const completedOrder = result.order;
    const actor = staffName || 'Store Counter Staff';
    await this.createAuditLog('STAFF', actor, 'VERIFY_BOPIS_QR', 'Order', completedOrder.id, `Verified BOPIS QR code and handed over items for Order #${completedOrder.orderNumber}`);
    await this.emitOrderNotifications(completedOrder, 'READY_FOR_PICKUP', actor);
    this.broadcast('order.updated', completedOrder);
    this.broadcast('bopis.completed', { order: completedOrder, verifiedBy: actor });
    this.broadcast('analytics.updated', await avolabDb.getAnalytics());
    return { success: true, message: `BOPIS Pickup verified! Order #${completedOrder.orderNumber} successfully completed.`, order: completedOrder };
  }

  public async createOrderReview(orderId: string, customerId: string, rating: number, comment: string) {
    const orders = await avolabDb.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, error: 'Order not found.' };
    if (order.customerId !== customerId) return { success: false, error: 'You can only review your own orders.' };
    if (order.orderStatus !== 'COMPLETED') return { success: false, error: 'Only completed orders can be reviewed.' };
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { success: false, error: 'Rating must be between 1 and 5 stars.' };
    const existingReviews = await avolabDb.getOrderReviews(customerId);
    const existingReview = existingReviews.find(r => r.orderId === order.id);
    if (existingReview) {
      return { success: true, alreadyReviewed: true, review: existingReview };
    }

    const cleanedComment = String(comment || '').trim();
    const review = await avolabDb.upsertOrderReview({
      id: 'review-' + order.id, orderId: order.id, orderNumber: order.orderNumber, customerId, rating, comment: cleanedComment || 'Great AVOLAB order experience.'
    });
    await this.createAuditLog('CUSTOMER', order.customerName, 'SUBMIT_ORDER_REVIEW', 'Order', order.id, `Submitted ${rating}-star review for Order #${order.orderNumber}`, customerId);
    this.broadcast('review.created', review);
    return { success: true, review };
  }

  public async createSupportTicket(customerId: string, customerName: string, customerEmail: string, subject: string, message: string) {
    const now = new Date().toISOString();
    const newTicket: SupportTicket = {
      id: 'tkt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      ticketNumber: 'TKT-2026-' + Math.floor(100 + Math.random() * 900),
      customerId, customerName, customerEmail, subject, status: 'OPEN', priority: 'MEDIUM', createdAt: now, updatedAt: now,
      messages: [{ id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8), senderRole: 'CUSTOMER', senderName: customerName, message, timestamp: now }]
    };
    await avolabDb.createSupportTicket(newTicket);
    await this.createAuditLog('CUSTOMER', customerName, 'START_SUPPORT_CHAT', 'SupportTicket', newTicket.id, `Started support chat #${newTicket.ticketNumber}`, customerId);
    await this.createNotification('STAFF', `New Support Chat #${newTicket.ticketNumber}`, `${customerName}: ${subject}`, 'SYSTEM', undefined, 'STAFF_SUPPORT');
    this.broadcast('ticket.created', newTicket);
    return newTicket;
  }

  public async addSupportReply(ticketId: string, senderRole: 'CUSTOMER' | 'STAFF' | 'ADMIN', senderName: string, message: string) {
    const ticket = await avolabDb.addSupportReply(ticketId, senderRole, senderName, message);
    if (!ticket) return null;
    const newReply = ticket.messages[ticket.messages.length - 1];
    await this.createAuditLog(senderRole, senderName, 'REPLY_SUPPORT_CHAT', 'SupportTicket', ticket.id, `Replied to support chat #${ticket.ticketNumber}`, senderRole === 'CUSTOMER' ? ticket.customerId : undefined);
    this.broadcast('ticket.updated', ticket);
    this.broadcast('ticket.reply', { ticketId, reply: newReply, updatedAt: ticket.updatedAt });
    const recipientRole = senderRole === 'CUSTOMER' ? 'STAFF' : 'CUSTOMER';
    const recipientUserId = senderRole === 'CUSTOMER' ? undefined : ticket.customerId;
    await this.createNotification(recipientRole, `Support Chat #${ticket.ticketNumber}`, senderRole === 'CUSTOMER' ? `${ticket.customerName} sent a new message.` : `${senderName} replied to your support chat.`, 'SYSTEM', recipientUserId, senderRole === 'CUSTOMER' ? 'STAFF_SUPPORT' : 'SUPPORT');
    return ticket;
  }
}

export const realtimeEngine = new RealtimeStateEngine();
