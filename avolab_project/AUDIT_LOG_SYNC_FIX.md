# AVOLAB Audit Log Cross-Role Sync Fix

## What changed
- `audit_logs` is now a persistent MySQL source of truth.
- `/api/state` now returns the latest audit records instead of an empty array.
- Server-side order creation, order status changes, inventory changes, and BOPIS QR verification write audit records to MySQL and broadcast `audit.created` over SSE.
- Browser-originated actions using the existing `addAuditLog()` helper now POST to `/api/audit`, so Customer/Staff/Admin actions can appear in the Admin Audit Logs screen.
- Added `/api/audit` GET/POST endpoints.
- Added backward-compatible creation of `audit_logs` if an older database does not have the table.
- Existing SSE + 3-second snapshot reconciliation keeps Admin Audit Logs synchronized across tabs.

## Expected examples
- CUSTOMER: `PLACE_ORDER` for BOPIS or Delivery
- STAFF: `UPDATE_ORDER_STATUS` for PROCESSING -> PICKING -> PACKED -> READY_FOR_PICKUP / SHIPPED -> COMPLETED
- STAFF: `VERIFY_BOPIS_QR`
- STAFF: `ADJUST_INVENTORY`
- ADMIN: product, promotion, campaign, user, settings and other browser actions using `addAuditLog()`

## Test
1. Start MySQL/MariaDB in XAMPP.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open Customer, Staff and Admin in separate tabs/windows.
5. Place a BOPIS order as Customer.
6. Open Admin -> Audit Logs. The `PLACE_ORDER` event should appear.
7. Change the order status as Staff. Each status change should create a new audit entry.
8. Verify the BOPIS QR. `VERIFY_BOPIS_QR` should appear immediately in Admin Audit Logs.
