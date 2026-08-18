import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import QRCode from "qrcode";
import dotenv from "dotenv";
import { avolabDb } from "./server/database.js";
import { realtimeEngine } from "./server/realtimeState.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = Number(process.env.PORT || 3000);

// Resolve paths from server.ts itself, not from process.cwd(). This prevents
// broken assets when VS Code/tsx is launched from a different working folder.
const projectRoot = process.env.NODE_ENV === 'production'
  ? process.cwd()
  : path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(projectRoot, 'public');
const imagesPath = path.join(publicPath, 'images');
const sourceImagesPath = path.join(projectRoot, 'src', 'assets', 'images');

console.log('[Assets] Project root:', projectRoot);
console.log('[Assets] Images directory:', imagesPath);
console.log('[Assets] Images directory exists:', fs.existsSync(imagesPath));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY environment variable is not set or placeholder.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    brand: "AVOLAB COSMETICS",
    database: "Centralized SQL Database (Active)",
    timestamp: new Date().toISOString()
  });
});

// REAL-TIME SHARED DATA STREAM (Server-Sent Events)
app.get("/api/realtime/stream", (req, res) => {
  realtimeEngine.registerSseClient(res);

  req.on('close', () => {
    realtimeEngine.removeSseClient(res);
  });
});

// Master Snapshot State Endpoint (Single Source of Truth from SQL Database)
app.get("/api/state", async (req, res) => {
  try {
    const role = typeof req.query.role === 'string' ? req.query.role : undefined;
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    res.json(await realtimeEngine.getState(role, userId));
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to load system state.' });
  }
});

// Persistent cross-role audit trail API. Any role action that originates in
// the browser can write to the same SQL audit_logs table used by server-side
// order/inventory/BOPIS transactions. Admin Audit Logs therefore sees actions
// from Customer and Staff sessions as well as Admin actions.
app.get("/api/audit", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 500);
    const logs = await avolabDb.getAuditLogs(limit);
    res.json({ success: true, logs, count: logs.length, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to load audit logs.' });
  }
});

app.post("/api/audit", async (req, res) => {
  try {
    const { userRole, userId, userName, action, entity, entityId, details } = req.body || {};
    if (!['CUSTOMER', 'STAFF', 'ADMIN'].includes(userRole)) {
      return res.status(400).json({ success: false, error: 'Invalid audit user role.' });
    }
    if (!userId || !userName || !action || !entity || !entityId) {
      return res.status(400).json({ success: false, error: 'Missing required audit fields.' });
    }
    const log = await realtimeEngine.createClientAuditLog({
      userRole, userId, userName, action, entity, entityId, details: details || ''
    });
    res.status(201).json({ success: true, log });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to create audit log.' });
  }
});

// Persistent, role-aware notification APIs. Notifications are stored in SQL so a role
// that opens later still sees the correct messages. recipientUserId is used for
// customer-specific notifications; staff/admin messages are role-scoped.
app.get("/api/notifications", async (req, res) => {
  try {
    const limit = Number(req.query.limit || 500);
    const notifications = await avolabDb.getNotifications(limit);
    res.json({ success: true, notifications, count: notifications.length, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to load notifications.' });
  }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const { recipientRole, recipientUserId, title, message, type, link } = req.body || {};
    if (!['CUSTOMER', 'STAFF', 'ADMIN', 'ALL'].includes(recipientRole)) {
      return res.status(400).json({ success: false, error: 'Invalid notification recipient role.' });
    }
    if (!title || !message || !type) {
      return res.status(400).json({ success: false, error: 'Missing notification fields.' });
    }
    const notif = await realtimeEngine.createNotification(recipientRole, title, message, type, recipientUserId, link);
    res.status(201).json({ success: true, notification: notif });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to create notification.' });
  }
});

app.put("/api/notifications/:id/read", async (req, res) => {
  try {
    const { userId, role } = req.body || {};
    await avolabDb.markNotificationRead(req.params.id, userId, role);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to mark notification as read.' });
  }
});

// Database Analytics & BI API
app.get("/api/analytics/bi", async (_req, res) => {
  res.json(await avolabDb.getAnalytics());
});

// Canonical order collection endpoint. All roles read from the same SQL-backed
// order set; optional fulfillmentType/status/storeId filters are applied server-side.
app.get("/api/orders", async (req, res) => {
  try {
    let orders = await avolabDb.getOrders();
    const { fulfillmentType, status, storeId } = req.query;
    if (fulfillmentType) orders = orders.filter(o => o.fulfillmentType === fulfillmentType);
    if (status) orders = orders.filter(o => o.orderStatus === status);
    if (storeId) orders = orders.filter(o => o.storeId === storeId);
    res.json({ success: true, orders, count: orders.length, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to load orders.' });
  }
});

// Transaction-Safe Order Placement API
app.post("/api/orders", async (req, res) => {
  const result = await realtimeEngine.createOrder(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

// Real-Time Order Status Update API
app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, notes, staffName, actorRole, actorUserId } = req.body;
  const normalizedActorRole = actorRole === 'ADMIN' ? 'ADMIN' : 'STAFF';
  const result = await realtimeEngine.updateOrderStatus(id, status, notes, staffName, normalizedActorRole, actorUserId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Product CRUD APIs
app.post("/api/products", async (req, res) => {
  const product = await realtimeEngine.addProduct(req.body);
  res.status(201).json({ success: true, product });
});

app.put("/api/products/:id", async (req, res) => {
  const product = await realtimeEngine.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});

// Inventory Stock Adjustment API
app.post("/api/inventory/adjust", async (req, res) => {
  const { productId, locationId, qtyDelta, reason } = req.body;
  const product = await realtimeEngine.adjustStock(productId, locationId, qtyDelta, reason);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});

// Marketing & Campaign APIs
app.post("/api/campaigns", (req, res) => {
  const campaign = realtimeEngine.addCampaign(req.body);
  res.status(201).json({ success: true, campaign });
});

app.put("/api/campaigns/:id", (req, res) => {
  const campaign = realtimeEngine.updateCampaign(req.params.id, req.body);
  if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });
  res.json({ success: true, campaign });
});

// Promotion Coupon APIs
app.post("/api/promotions", (req, res) => {
  const promotion = realtimeEngine.addPromotion(req.body);
  res.status(201).json({ success: true, promotion });
});

app.put("/api/promotions/:id", (req, res) => {
  const promotion = realtimeEngine.updatePromotion(req.params.id, req.body);
  if (!promotion) return res.status(404).json({ success: false, message: "Promotion not found" });
  res.json({ success: true, promotion });
});

// Server-Side BOPIS Verification & Pickup Handover API
app.post("/api/bopis/verify-and-complete", async (req, res) => {
  const { qrData, staffName, storeId } = req.body;
  const result = await realtimeEngine.verifyAndCompleteBopisQr(qrData, staffName || 'Staff Member', storeId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Support Ticket APIs
app.get("/api/support/tickets", async (req, res) => {
  try {
    const role = String(req.query.role || '').toUpperCase();
    const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    const tickets = role === 'CUSTOMER' && userId ? await avolabDb.getSupportTickets(userId) : await avolabDb.getSupportTickets();
    res.json({ success: true, tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to load support chats.' });
  }
});

app.post("/api/support/tickets", async (req, res) => {
  try {
    const { customerId, customerName, customerEmail, subject, message } = req.body;
    if (!customerId || !customerName || !customerEmail || !subject || !message) return res.status(400).json({ success: false, error: 'Missing support chat fields.' });
    const ticket = await realtimeEngine.createSupportTicket(customerId, customerName, customerEmail, subject, message);
    res.status(201).json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to create support chat.' });
  }
});

app.post("/api/support/tickets/:id/reply", async (req, res) => {
  try {
    const { senderRole, senderName, message } = req.body;
    if (!['CUSTOMER', 'STAFF', 'ADMIN'].includes(senderRole) || !senderName || !message) return res.status(400).json({ success: false, error: 'Invalid support reply.' });
    const ticket = await realtimeEngine.addSupportReply(req.params.id, senderRole, senderName, message);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to send support reply.' });
  }
});

app.get("/api/order-reviews", async (req, res) => {
  try {
    const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined;
    const reviews = await avolabDb.getOrderReviews(customerId);
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to load order reviews.' });
  }
});

app.post("/api/order-reviews", async (req, res) => {
  try {
    const { orderId, customerId, rating, comment } = req.body || {};
    const result = await realtimeEngine.createOrderReview(orderId, customerId, Number(rating), String(comment || ''));
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Unable to save order review.' });
  }
});

// Smart AI Assistant Helper Function for AVOLAB COSMETICS
function generateSmartAssistantReply(messages: any[], userProfile: any = {}): string {
  const userMessages = (messages || []).filter((m: any) => m.role === 'user');
  const lastUserMsg = userMessages[userMessages.length - 1]?.content || '';
  const text = lastUserMsg.toLowerCase().trim();

  // Combine all user messages in history to maintain cumulative context
  const fullUserContext = userMessages.map((m: any) => m.content.toLowerCase()).join(' ');

  // 1. LANGUAGE DETECTION
  const isVietnamese = /xin chào|chào|cảm ơn|da nhạy cảm|da dầu|da khô|da hỗn hợp|rửa mặt|khoảng|dưới|giá|bao nhiêu|cần|tư vấn|sản phẩm|cửa hàng|tốt|nhẹ hơn|rẻ hơn|mụn/i.test(lastUserMsg);

  // 2. CUMULATIVE SKIN TYPE EXTRACTION
  let skinType = userProfile.skinType || 'Sensitive';
  if (fullUserContext.includes('sensitive') || fullUserContext.includes('nhạy cảm')) skinType = 'Sensitive';
  else if (fullUserContext.includes('dry') || fullUserContext.includes('khô')) skinType = 'Dry';
  else if (fullUserContext.includes('oily') || fullUserContext.includes('dầu')) skinType = 'Oily';
  else if (fullUserContext.includes('combination') || fullUserContext.includes('hỗn hợp')) skinType = 'Combination';
  else if (fullUserContext.includes('normal') || fullUserContext.includes('thường')) skinType = 'Normal';

  // 3. CUMULATIVE BUDGET EXTRACTION
  let extractedBudget: number | null = null;
  const budgetMatch = text.match(/(?:under|less than|around|budget of|dưới|khoảng|dollars?|\$)?\s*\$?(\d{2,4})\b/i);
  if (budgetMatch) {
    const parsedNum = parseInt(budgetMatch[1], 10);
    // Ignore numbers representing step counts or small non-price numbers
    if (parsedNum >= 15 && parsedNum <= 1000 && !text.includes(`${parsedNum}-step`) && !text.includes(`${parsedNum} step`) && !text.includes(`${parsedNum} bước`)) {
      extractedBudget = parsedNum;
    }
  }

  const isCheaperRequested = /cheaper|less expensive|lower budget|more affordable|rẻ hơn|giảm giá|tiết kiệm|less money|cheaper option/i.test(text);
  const isBudgetIntent = extractedBudget !== null || isCheaperRequested || /budget|around|under|less than|affordable|cheap|price|giá|khoảng/i.test(text);

  // 4. STEP COUNT & ROUTINE INTENT
  let requestedSteps = 0;
  const stepMatch = text.match(/(\d+)\s*(-|\s)?\s*(step|bước)/i);
  if (stepMatch) {
    requestedSteps = parseInt(stepMatch[1], 10);
  }

  const isMorning = /morning|am routine|sáng|ban sáng/i.test(text);
  const isEvening = /evening|pm routine|night|tối|ban đêm/i.test(text);
  const isRoutine = requestedSteps > 0 || isMorning || isEvening || /routine|quy trình|chu trình/i.test(text);

  // 5. INTENT RECOGNITION
  const isGreeting = /^(hi|hello|hey|good morning|good evening|xin chào|chào|hola|greetings)[\s!.]*$/i.test(text) || text === 'hi' || text === 'hello';
  const isLoyalty = /loyalty|point|reward|tier|club|điểm thưởng|thành viên/i.test(text);
  const isStore = /store|flagship|location|address|where is|nearest|cửa hàng|chi nhánh|ở đâu/i.test(text);
  const isRefill = /refill|tái sử dụng|nạp lại/i.test(text);
  const isVitaminC = /vitamin c|vit c|ascorbic/i.test(text);
  const isComparison = /difference|compare|versus| vs |which one|so sánh|khác nhau|loại nào tốt hơn|which is better|which cleaner/i.test(text);
  const isDarkSpots = /dark spot|pigmentation|hyperpigmentation|discoloration|thâm|nám|sạm|brighten/i.test(text);
  const isAcne = /acne|blemish|breakout|pimple|blackhead|mụn|lỗ chân lông/i.test(text);
  const isCleanser = /cleanser|wash|cleanse|sữa rửa mặt|tẩy trang/i.test(text);
  const isProductInfo = /what does|tell me about|ingredients|how to use|phytosterol|bakuchiol|cloud cream|tác dụng|thành phần/i.test(text);
  const isVague = /recommend something|gợi ý|tư vấn cho tôi|suggest something|recommend for me/i.test(text) && !fullUserContext.includes('sensitive') && !fullUserContext.includes('dry') && !fullUserContext.includes('oily') && !fullUserContext.includes('combination') && !extractedBudget;

  // --- VIETNAMESE RESPONSES ---
  if (isVietnamese) {
    if (isGreeting) {
      return `Xin chào! Chào mừng bạn đến với AVOLAB COSMETICS. ✨\n\nTôi là AVOBOT, cố vấn chăm sóc da AI của bạn. Bạn cần tư vấn về loại da (${skinType}), gợi ý quy trình skincare hay tìm sản phẩm theo ngân sách hôm nay?`;
    }
    if (isLoyalty) {
      return `Chào mừng bạn đến với AVOLAB Botanical Loyalty Club! 🌿\n\n• Tích điểm: Tích 10 điểm cho mỗi $1 chi tiêu.\n• Quà chào mừng: Nhận 100 điểm thưởng ngay khi đăng ký tài khoản!\n• Đổi điểm: 500 điểm = Voucher $10 giảm giá trực tiếp khi thanh toán.`;
    }
    if (isStore) {
      return `AVOLAB COSMETICS hiện có 3 cửa hàng Flagship chính:\n\n1. NYC SoHo Flagship — 120 Botanical Way, Suite 400, New York, NY\n2. Beverly Hills Boutique — 450 N Canon Dr, Beverly Hills, CA\n3. Tokyo Ginza Studio — 6-10-1 Ginza, Chuo-ku, Tokyo, Japan`;
    }
    if (isBudgetIntent) {
      const budgetVal = extractedBudget || 100;
      return `Rất sẵn lòng! Với ngân sách khoảng $${budgetVal} cho da ${skinType}, đây là gợi ý tối ưu từ AVOLAB:\n\n1. Sữa rửa mặt Gentle Avocado Foaming Cleanser — $20\n2. Tinh chất phục hồi Hyaluronic Phytosterol Barrier Serum — $42\n3. Kem dưỡng dạng gel Fresh Avocado Water Gel Cloud Cream — $36\n\nTổng chi phí ước tính: $98.\n\nSản phẩm dịu nhẹ, thuần chay và bảo vệ màng ẩm tự nhiên của da!`;
    }
  }

  // --- ENGLISH RESPONSES ---

  // 1. GREETING
  if (isGreeting) {
    return `Hello! Welcome to AVOLAB COSMETICS. ✨\n\nI am AVOBOT, your AI Skincare & Beauty Advisor. How can I assist you today? Feel free to ask for product recommendations based on your skin type (${skinType}), custom routines, or budget-friendly options!`;
  }

  // 2. VAGUE CLARIFICATION
  if (isVague) {
    return `I would love to help you find the perfect AVOLAB products! To give you the best recommendation, what is your skin type (Sensitive, Dry, Oily, or Combination) or do you have a target budget in mind?`;
  }

  // 3. LOYALTY PROGRAM
  if (isLoyalty) {
    return `Welcome to the AVOLAB Botanical Loyalty Club! 🌿\n\nHere is how our rewards program works:\n• Earn Points: Receive 10 points for every $1 spent on all AVOLAB purchases.\n• Member Perks: Earn 100 free bonus points when creating your account!\n• Tiers & Rewards: Progress through Green Seedling, Avocado Grove, and Botanical Master tiers for exclusive birthday gifts, free shipping, and early access to new launches.\n• Redeeming Points: Convert 500 points into a $10 discount voucher directly at checkout.`;
  }

  // 4. FLAGSHIP STORES
  if (isStore) {
    return `AVOLAB COSMETICS has flagship store locations where you can experience 1-on-1 skin barrier analysis and try our full clean product collection:\n\n1. NYC SoHo Flagship — 120 Botanical Way, Suite 400, New York, NY\n2. Beverly Hills Boutique — 450 N Canon Dr, Beverly Hills, CA\n3. Tokyo Ginza Studio — 6-10-1 Ginza, Chuo-ku, Tokyo, Japan\n\nVisit our Flagship Stores page in the menu to check store hours or schedule a complimentary skin consultation!`;
  }

  // 5. CHEAPER REQUEST / FOLLOW-UP BUDGET MODIFICATION
  if (isCheaperRequested) {
    if (skinType === 'Sensitive' || skinType === 'Dry') {
      return `Sure! Here is a more budget-friendly 2-step option for ${skinType} skin that cuts down the overall cost:\n\n1. Oat Milk & Avocado Calming Cleansing Milk — $22\n   Gentle non-foaming cream cleanser that cleanses without irritation.\n\n2. Fresh Avocado Water Gel Cloud Cream — $36\n   Weightless, soothing daily moisturizer.\n\nEstimated Total: $58\n\nThis streamlined 2-step combo provides essential cleansing and barrier hydration while saving money!`;
    } else {
      return `Sure! Here is a lower-cost 2-step option for ${skinType} skin:\n\n1. Gentle Avocado Foaming Cleanser — $20\n2. Fresh Avocado Water Gel Cloud Cream — $36\n\nEstimated Total: $56\n\nThis basic routine covers cleansing and daily hydration while keeping your budget under $60!`;
    }
  }

  // 6. BUDGET / PRICE-BASED RECOMMENDATIONS
  if (isBudgetIntent) {
    const budgetVal = extractedBudget || 100;

    if (budgetVal <= 30) {
      return `Here are top clean skincare recommendations from AVOLAB priced under $30:\n\n• Gentle Avocado Foaming Cleanser — $20\n  Sulfate-free cloud foam that cleanses without stripping lipids.\n\n• Oat Milk & Avocado Calming Cleansing Milk — $22\n  Ultra-gentle non-foaming cleanser for hyper-reactive skin.\n\n• Botanical Hydrating Tinted Lip Oil — $22\n  Nourishing avocado lip oil with a natural, healthy glow.\n\n• Avocado & Green Tea Milky Balancing Toner — $24\n  Hydrating botanical essence toner that preps and balances pH.`;
    }

    if (budgetVal <= 65) {
      return `With a budget of around $${budgetVal}, here is a high-impact 2-product routine for ${skinType} skin:\n\n1. Gentle Avocado Foaming Cleanser — $20\n   Mild, pH-balanced cloud foam.\n\n2. Fresh Avocado Water Gel Cloud Cream — $36\n   Weightless 72-hour moisture barrier hydration.\n\nEstimated Total: $56\n\nThis core duo keeps your skin fresh, clean, and deeply hydrated well within your budget!`;
    }

    // Default around $80-$100
    if (skinType === 'Oily') {
      return `For Oily skin with a budget around $${budgetVal}, here is a targeted routine:\n\n1. Purifying Matcha & Avocado Gel Jelly Cleanser — $26\n2. Niacinamide 10% + Zinc Pore Minimizing Serum — $38\n3. Fresh Avocado Water Gel Cloud Cream — $36\n\nEstimated Total: $100\n\nThis combination controls excess oil, tightens pore texture, and delivers oil-free hydration!`;
    }

    return `Absolutely! With a budget of around $${budgetVal}, here is a complete, barrier-strengthening 3-step routine tailored for ${skinType} skin:\n\n1. Gentle Avocado Foaming Cleanser — $20\n   Sulfate-free daily cleanser that lifts impurities gently.\n\n2. Hyaluronic Phytosterol Barrier Repair Serum — $42\n   Deeply replenishes moisture and calms facial redness.\n\n3. Fresh Avocado Water Gel Cloud Cream — $36\n   Lightweight, soothing hydration.\n\nEstimated Total: $98\n\nOptionally, you can also grab 'The Daily Botanical Barrier Trio Set' bundle for $85 (a $98 total value!).`;
  }

  // 7. VITAMIN C COMPATIBILITY & USAGE
  if (isVitaminC) {
    return `Yes! You can definitely incorporate Vitamin C into your routine. Here is how to use our Vitamin C Brightening Glow Serum ($48) effectively:\n\n• Morning Application: Apply 3–4 drops in the AM after cleansing and toning, before your moisturizer and sunscreen.\n• Sun Protection Synergy: Vitamin C works synergistically with our Daily Invisible Mineral Sunscreen SPF 50+ ($34) to defend against environmental free radicals.\n• Sensitive Skin Tip: If you have sensitive skin, start using it every other morning and pair with our Hyaluronic Barrier Serum ($42) to keep skin calm.`;
  }

  // 8. PRODUCT COMPARISON
  if (isComparison) {
    if (text.includes('cleanser') || text.includes('wash')) {
      return `Here is a comparison of our top AVOLAB cleansers:\n\n• Gentle Avocado Foaming Cleanser ($20):\n  Sulfate-free cream foam ideal for Sensitive, Dry, and Normal skin. Hydrates while cleansing.\n\n• Barrier Renewal Oil-to-Milk Cleanser ($28):\n  Rich oil-to-milk formula for double-cleansing and removing heavy waterproof SPF & makeup.\n\n• Purifying Matcha & Avocado Gel Jelly Cleanser ($26):\n  Cooling jelly cleanser with Willow Bark BHA for Oily & Acne-prone skin.`;
    }
    return `Here is a comparison between our top two moisturizers:\n\n• Fresh Avocado Water Gel Cloud Cream ($36):\n  Ultra-lightweight, oil-free gel moisturizer. Ideal for Oily, Combination, and Sensitive skin needing weightless hydration.\n\n• Cold-Pressed Avocado Phytosterol Intensive Cream ($44):\n  Rich lipid cream formulated for Dry, Flaky, or Compromised barriers needing deep moisture repair.\n\nFor Dry skin, choose the Intensive Cream ($44). For Oily/Combination skin, choose the Water Gel Cloud Cream ($36)!`;
  }

  // 9. PRODUCT INFORMATION / BENEFITS
  if (isProductInfo) {
    if (text.includes('phytosterol') || text.includes('barrier') || text.includes('avocado')) {
      return `Our Avocado Phytosterol line is engineered to repair compromised moisture barriers:\n\n1. Hyaluronic Phytosterol Barrier Repair Serum ($42):\n   Combines multi-depth Hyaluronic Acid with Avocado Phytosterols to lock in moisture, soothe redness, and plump skin.\n\n2. Cold-Pressed Avocado Phytosterol Intensive Cream ($44):\n   Rich lipid cream that seals in hydration and restores essential skin fatty acids.\n\nBoth formulas are 100% vegan, cruelty-free, and non-comedogenic!`;
    }
    if (text.includes('bakuchiol')) {
      return `Our Bakuchiol 2% Botanical Retinol-Alternative Serum ($52) is a gentle anti-aging serum:\n\n• Key Ingredient: 2% Pure Bakuchiol + Avocado Peptides\n• Benefits: Smooths fine lines and boosts elasticity without the peeling, redness, or sun sensitivity associated with traditional retinol.\n• Suitable For: All skin types, including sensitive skin!`;
    }
  }

  // 10. DARK SPOTS / HYPERPIGMENTATION
  if (isDarkSpots) {
    return `To target dark spots, post-acne marks, and uneven skin tone, we recommend this brightening trio:\n\n1. Vitamin C Brightening Glow Serum ($48) — Fades sun spots and boosts skin radiance.\n2. Niacinamide 10% + Zinc Pore Minimizing Serum ($38) — Evens skin tone and calms redness.\n3. Daily Invisible Mineral Sunscreen SPF 50+ ($34) — Prevents dark spots from darkening further.\n\nConsistent AM application will visibly clarify tone within 4–6 weeks!`;
  }

  // 11. ACNE / BLEMISHES
  if (isAcne) {
    return `For acne-prone or breakout-sensitive skin, we recommend a pore-clarifying routine:\n\n1. Cleanse — Purifying Matcha & Avocado Gel Jelly Cleanser ($26)\n   Unclogs pores and regulates excess oil gently.\n\n2. Treat — Niacinamide 10% + Zinc Pore Minimizing Serum ($38)\n   Controls daytime shine, reduces redness, and smooths texture.\n\n3. Hydrate — Fresh Avocado Water Gel Cloud Cream ($36)\n   Oil-free hydration that won't clog pores.\n\n4. Weekly Mask — Green Tea & Kaolin Detoxifying Clay Mask ($30)\n   Draws out impurities 1–2 times per week.`;
  }

  // 12. CLEANSER SPECIFIC QUESTION
  if (isCleanser) {
    if (skinType === 'Oily' || skinType === 'Combination') {
      return `For Oily or Combination skin, our top recommendation is the Purifying Matcha & Avocado Gel Jelly Cleanser ($26)! 🍃\n\nWhy it works:\n• Infused with ceremonial matcha & gentle willow bark BHA\n• Deeply clarifies pores and controls excess shine\n• Leaves skin fresh, clean, and balanced without feeling tight.`;
    } else {
      return `For ${skinType} skin, our top recommendation is the Gentle Avocado Foaming Cleanser ($20)! 🥑\n\nWhy it works:\n• Cold-pressed organic avocado lipids protect the natural skin barrier\n• Gentle cloud foam that lifts impurities without stripping\n• Leaves skin soft, calm, and hydrated!`;
    }
  }

  // 13. ROUTINE RECOMMENDATIONS (3-step, 5-step, Morning, Evening)
  if (isRoutine) {
    const numSteps = requestedSteps > 0 ? requestedSteps : 3;

    if (isMorning) {
      return `Here is a complete 3-step morning routine tailored for ${skinType} skin:\n\n1. Cleanse — Gentle Avocado Foaming Cleanser ($20)\n   Refreshes skin and removes overnight buildup gently.\n\n2. Treat — Vitamin C Brightening Glow Serum ($48)\n   Provides 15% Vitamin C antioxidant defense against daily free radicals.\n\n3. Protect — Daily Invisible Mineral Sunscreen SPF 50+ ($34)\n   100% mineral non-nano zinc sunscreen with zero white cast.\n\nTotal Estimated Price: $102.`;
    }

    if (numSteps === 5) {
      return `Here is a comprehensive 5-step routine tailored for ${skinType} skin:\n\n1. Cleanse — Gentle Avocado Foaming Cleanser ($20)\n2. Tone — Avocado & Green Tea Milky Balancing Toner ($24)\n3. Serum (AM) — Vitamin C Brightening Glow Serum ($48)\n4. Serum (PM) — Hyaluronic Phytosterol Barrier Repair Serum ($42)\n5. Moisturize & Protect — Fresh Avocado Water Gel Cloud Cream ($36) / Daily Invisible Mineral Sunscreen SPF 50+ ($34)\n\nThis 5-step regimen covers cleansing, prep, brightening, deep barrier repair, and daily sun defense!`;
    }

    // Default 3-step routine
    if (skinType === 'Sensitive') {
      return `Absolutely! Since your skin type is Sensitive, I recommend a gentle 3-step routine:\n\n1. Cleanse — Gentle Avocado Foaming Cleanser ($20)\n   Mild cloud foam to remove impurities without stripping the skin barrier.\n\n2. Treat — Hyaluronic Phytosterol Barrier Repair Serum ($42)\n   Helps replenish hydration and soothe facial redness.\n\n3. Moisturize — Fresh Avocado Water Gel Cloud Cream ($36)\n   Provides lightweight, soothing moisture.\n\nTotal Estimated Price: $98 (or get 'The Daily Botanical Barrier Trio Set' bundle for $85!).`;
    } else if (skinType === 'Oily') {
      return `Here is a refreshing 3-step routine designed for Oily skin:\n\n1. Cleanse — Purifying Matcha & Avocado Gel Jelly Cleanser ($26)\n2. Treat — Niacinamide 10% + Zinc Pore Minimizing Serum ($38)\n3. Moisturize — Fresh Avocado Water Gel Cloud Cream ($36)\n\nTotal Estimated Price: $100.`;
    } else if (skinType === 'Dry') {
      return `Here is a deeply hydrating 3-step routine for Dry skin:\n\n1. Cleanse — Gentle Avocado Foaming Cleanser ($20)\n2. Treat — Hyaluronic Phytosterol Barrier Repair Serum ($42)\n3. Moisturize — Cold-Pressed Avocado Phytosterol Intensive Cream ($44)\n\nTotal Estimated Price: $106.`;
    } else {
      return `Here is a balanced 3-step routine for ${skinType} skin:\n\n1. Cleanse — Gentle Avocado Foaming Cleanser ($20)\n2. Treat — Hyaluronic Phytosterol Barrier Repair Serum ($42)\n3. Moisturize — Fresh Avocado Water Gel Cloud Cream ($36)\n\nTotal Estimated Price: $98.`;
    }
  }

  // 14. DEFAULT FALLBACK
  return `Thank you for reaching out! For ${skinType} skin, we recommend starting with our Gentle Avocado Foaming Cleanser ($20) paired with the Hyaluronic Phytosterol Barrier Repair Serum ($42) and Fresh Avocado Water Gel Cloud Cream ($36).\n\nWould you like a personalized morning routine, or a budget recommendation for a specific price range?`;
}

// AI Beauty Assistant Endpoint
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { messages = [], userProfile = {} } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const systemInstruction = `
You are AVOBOT, the expert AI Beauty & Skincare Assistant for AVOLAB COSMETICS — a premium vegan skincare brand.
Brand Characteristics: Clean, gentle, natural-inspired, science-backed, non-comedogenic, vegan, and cruelty-free.

AVOLAB PRODUCT CATALOG WITH REAL PRICES:
- Gentle Avocado Foaming Cleanser — $20 (Sulfate-free daily cloud foam)
- Barrier Renewal Oil-to-Milk Cleanser — $28 (Double cleansing oil-to-milk)
- Purifying Matcha & Avocado Gel Jelly Cleanser — $26 (Matcha + Willow Bark BHA for oily/acne skin)
- Oat Milk & Avocado Calming Cleansing Milk — $22 (Zero-sting cream cleanser)
- Phytosterol AHA/BHA Resurfacing Cleanser — $28 (2% Lactic + 0.5% Salicylic acid)
- Avocado & Green Tea Milky Balancing Toner — $24 (Hydrating botanical essence toner)
- Hyaluronic Phytosterol Barrier Repair Serum — $42 (Multi-depth HA + Phytosterols)
- Vitamin C Brightening Glow Serum (15%) — $48 (15% Vitamin C + Ferulic Acid)
- Niacinamide 10% + Zinc Pore Minimizing Serum — $38 (Sebum control & pore refining)
- Bakuchiol 2% Botanical Retinol Serum — $52 (Gentle botanical retinol alternative)
- Fresh Avocado Water Gel Cloud Cream — $36 (Oil-free 72hr weightless hydration)
- Cold-Pressed Avocado Phytosterol Intensive Cream — $44 (Rich lipid cream for dry/flaky skin)
- Daily Invisible Mineral Sunscreen SPF 50+ — $34 (100% mineral non-nano zinc)
- Green Tea & Kaolin Detoxifying Clay Mask — $30 (Pore purifying kaolin clay)
- Botanical Hydrating Tinted Lip Oil — $22 (Avocado lip oil)
- Avocado Peptide & Caffeine Eye Cream — $40 (Depuffs dark circles)
- The Daily Botanical Barrier Trio Set — $85 (Cleanser $20 + Barrier Serum $42 + Cloud Cream $36 = $98 value for $85!)

CRITICAL RULES:
1. ALWAYS answer the customer's question directly FIRST. Never give a generic canned response.
2. BUDGET QUESTIONS: If user mentions a budget (e.g., "$100", "under $30", "under $50", "cheaper"):
   - Extract the budget amount.
   - For "under $30", immediately list products priced under $30 (e.g. Gentle Avocado Foaming Cleanser — $20, Oat Milk & Avocado Calming Cleansing Milk — $22, Botanical Hydrating Tinted Lip Oil — $22, Avocado & Green Tea Milky Balancing Toner — $24).
   - Recommend real AVOLAB products matching their skin type (${userProfile.skinType || 'Sensitive'}) that fit within that budget.
   - List each product with its REAL price and calculate the Total Estimated Price. Never invent prices.
3. FOLLOW-UPS: Maintain conversation context! If user says "can you make it cheaper?", modify the previous recommendation with lower-cost items instead of restarting.
4. ROUTINES: If user asks for N steps (e.g. 3-step, 5-step), provide EXACTLY N numbered steps with product names and prices.
5. NON-SKINCARE: Answer loyalty program or flagship store questions directly without forcing product recommendations.
6. LANGUAGE: Respond in the exact same language as the customer's latest message (e.g., English or Vietnamese).
        `;

        const promptText = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: promptText,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        if (response && response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiError) {
        // Gemini model access error or project quota - fallback seamlessly
      }
    }

    const reply = generateSmartAssistantReply(messages, userProfile);
    res.json({ reply });
  } catch (error: any) {
    const reply = generateSmartAssistantReply(req.body?.messages || [], req.body?.userProfile || {});
    res.json({ reply });
  }
});

// AI Demand Forecasting Endpoint
app.post("/api/gemini/demand-forecast", async (req, res) => {
  try {
    const { products, salesHistory } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Rule-based fallback calculation if API key is not active
      const forecasts = (products || []).map((p: any) => {
        const currentStock = p.stockQuantity || 50;
        const salesVelocity = Math.max(1, Math.round(p.reviewsCount / 10));
        const predictedDemand = salesVelocity * 30;
        const stockoutRisk = currentStock < 40 ? 'HIGH' : currentStock < 80 ? 'MEDIUM' : 'LOW';
        return {
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          category: p.category,
          currentStock,
          predictedDemand30Days: predictedDemand,
          stockoutRisk,
          recommendedReorderQty: stockoutRisk === 'HIGH' ? 100 : stockoutRisk === 'MEDIUM' ? 50 : 0,
          salesVelocityPerDay: salesVelocity,
          trend: stockoutRisk === 'HIGH' ? 'UP' : 'STABLE'
        };
      });

      return res.json({ forecasts, aiSummary: "Demand forecast generated using sales velocity algorithms. High reorder priority detected for low-stock items like Avocado Barrier Cream." });
    }

    const systemInstruction = `
You are the AI Operations & Demand Analyst for AVOLAB COSMETICS.
Analyze product stock levels, categories, and sales velocity data.
Provide a JSON forecast array for each product with fields:
- productId
- productName
- sku
- category
- currentStock
- predictedDemand30Days
- stockoutRisk ("HIGH" | "MEDIUM" | "LOW")
- recommendedReorderQty
- salesVelocityPerDay
- trend ("UP" | "STABLE" | "DOWN")
Also provide an 'aiSummary' explaining key inventory risks and procurement actions for executive management.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Products Data: ${JSON.stringify(products)}\nSales History: ${JSON.stringify(salesHistory)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch {
      res.json({ error: "Failed to parse AI response" });
    }
  } catch (err: any) {
    console.error("Demand Forecast error:", err);
    res.status(500).json({ error: "Forecast generation failed" });
  }
});

// QR Code Generation Endpoint
app.post("/api/qr/generate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text string is required for QR code generation" });
    }
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#2E4A32',
        light: '#FAF8F5'
      }
    });
    res.json({ qrDataUrl });
  } catch (error: any) {
    console.error("QR Code generation error:", error);
    res.status(500).json({ error: "Failed to generate QR Code" });
  }
});

// QR Code Verification Endpoint
app.post("/api/qr/verify", async (req, res) => {
  try {
    const { qrData, staffName, storeId } = req.body;
    const result = await realtimeEngine.verifyAndCompleteBopisQr(qrData, staffName || 'Counter Staff', storeId);
    if (!result.success) {
      return res.status(400).json({ valid: false, ...result });
    }

    return res.json({
      valid: true,
      success: true,
      completed: true,
      order: result.order,
      message: result.message
    });
  } catch (err: any) {
    return res.status(500).json({ valid: false, success: false, error: 'Verification process failed' });
  }
});

// -----------------------------------------------------------------------------
// STATIC IMAGE ASSETS — explicit binary delivery for XAMPP/Windows
// -----------------------------------------------------------------------------
// IMPORTANT: images are delivered as raw binary buffers with an explicit
// Content-Type. This avoids Vite/Express fallback behavior and makes the
// /images/<filename> URL work reliably on Windows/XAMPP.

const imageRoots = Array.from(new Set([
  path.join(projectRoot, 'public', 'images'),
  path.join(projectRoot, 'src', 'assets', 'images'),
  path.join(process.cwd(), 'public', 'images'),
  path.join(process.cwd(), 'src', 'assets', 'images')
]));

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

console.log('[Images] Search roots:');
for (const root of imageRoots) {
  console.log(`  - ${root} ${fs.existsSync(root) ? '[OK]' : '[MISSING]'}`);
}

// Explicit image handler. It reads the file as binary and sets the MIME type
// before sending it. Do NOT move this below Vite middleware.
app.use('/images', (req, res, next) => {
  try {
    const requested = decodeURIComponent(req.path.replace(/^\/+/, ''));
    const filename = path.basename(requested);

    if (!filename || filename === '.' || filename === '..') {
      return res.status(400).json({ error: 'Invalid image filename' });
    }

    const ext = path.extname(filename).toLowerCase();
    const mime = MIME_TYPES[ext];
    if (!mime) return next();

    for (const root of imageRoots) {
      const candidate = path.join(root, filename);
      if (!fs.existsSync(candidate)) continue;

      const stat = fs.statSync(candidate);
      if (!stat.isFile()) continue;

      const buffer = fs.readFileSync(candidate);
      console.log(`[Images] 200 ${filename} (${buffer.length} bytes)`);

      res.status(200);
      res.setHeader('Content-Type', mime);
      res.setHeader('Content-Length', String(buffer.length));
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      return res.end(buffer);
    }

    console.error(`[Images] 404 ${filename}`);
    return res.status(404).json({
      error: 'Image not found',
      filename,
      checkedRoots: imageRoots
    });
  } catch (error) {
    console.error('[Images] delivery error:', error);
    return res.status(500).json({ error: 'Image delivery failed' });
  }
});

// Diagnostic endpoint for ALL images.
app.get('/api/debug/images', (_req, res) => {
  const files = new Set<string>();

  for (const root of imageRoots) {
    if (!fs.existsSync(root)) continue;
    for (const file of fs.readdirSync(root)) {
      if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) files.add(file);
    }
  }

  const sorted = [...files].sort();
  const imageStatus = sorted.map(filename => {
    const locations = imageRoots
      .map(root => path.join(root, filename))
      .filter(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());

    const size = locations[0] ? fs.statSync(locations[0]).size : 0;
    return {
      filename,
      url: `/images/${encodeURIComponent(filename)}`,
      exists: locations.length > 0,
      size,
      locations
    };
  });

  res.json({
    projectRoot,
    cwd: process.cwd(),
    imageRoots,
    totalImages: imageStatus.length,
    validImageFiles: imageStatus.filter(x => x.exists && x.size > 0).length,
    images: imageStatus
  });
});

// Other files under public/ are served normally.
app.use(express.static(publicPath));

// Start Express Server with Vite integration
async function startServer() {
  // Initialize and verify Centralized SQL Database
  try {
    await avolabDb.initialize();
    console.log("AVOLAB Centralized SQL Database Initialized Successfully.");
  } catch (err) {
    console.error("Database initialization error:", err);
    process.exit(1);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AVOLAB COSMETICS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
