# AVOLAB BOPIS Cross-Role Synchronization Fix

## Problem fixed
BOPIS orders created by the Customer role could be missing from Staff/Admin views if a browser tab missed the `order.created` SSE event. Later `order.updated` events only replaced existing local orders, so a missing BOPIS order stayed invisible. Delivery orders appeared more reliably because they were already present in local/demo state.

## Fixes
- MySQL remains the single source of truth.
- Added `GET /api/orders` for canonical SQL-backed order retrieval.
- `order.updated` is now an UPSERT: an order is inserted into the local React state if the tab missed `order.created`.
- `bopis.completed` is also an UPSERT.
- Every open Customer/Staff/Admin page reconciles with `/api/state` every 3 seconds while visible.
- Returning to a browser tab immediately triggers a full SQL snapshot refresh.
- Existing BOPIS workflow is unchanged:
  `PROCESSING -> PICKING -> PACKED -> READY_FOR_PICKUP -> QR Verification -> COMPLETED`
- Existing Delivery workflow is unchanged.

## Test
1. Start MySQL/MariaDB in XAMPP.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open Customer, Staff, and Admin in separate tabs/windows.
5. Place a new BOPIS order as Customer.
6. Staff OMS/Ops Dashboard and Admin Orders should show the same order without a manual refresh (within the realtime/polling window).
7. Move the BOPIS order through the existing workflow and verify that every role sees the same status.

## Direct diagnostic endpoint
Open:
`http://localhost:3000/api/orders?fulfillmentType=BOPIS`

This must return the BOPIS orders currently stored in MySQL.
