# AVOLAB Cross-Role Order Sync Fix

## Canonical data flow

MySQL/MariaDB is the single source of truth for orders, audit logs and notifications.
SSE is used for low-latency updates; `/api/state` polling is the reconciliation fallback.

## Order workflows

### BOPIS
PROCESSING -> PICKING -> PACKED -> READY_FOR_PICKUP -> QR Verification -> COMPLETED

### Home Delivery
PENDING/PROCESSING -> PICKING -> PACKED -> SHIPPED -> COMPLETED

## Cross-role behavior

- Customer creates the order through `POST /api/orders`.
- The server transaction creates/ensures the customer row, inserts the order and order items, updates stock, then commits.
- After commit, the same order object is broadcast as `order.created`.
- Staff and Admin receive role-specific notifications from the same committed order.
- Every status change is written to the SQL audit log before the realtime event is broadcast.
- Customer/Staff/Admin all reconcile from `/api/state` every 3 seconds while visible.
- Snapshot requests are sequence-protected so an older HTTP response cannot overwrite a newer state.
- BOPIS QR completion is single-use and is protected against concurrent duplicate completion.

## Notification destinations

- CUSTOMER order notifications -> `ORDERS`
- STAFF new/update delivery orders -> `STAFF_ORDERS`
- STAFF BOPIS READY_FOR_PICKUP / completion -> `STAFF_BOPIS`
- ADMIN order lifecycle -> `ADMIN_ORDERS`

## XAMPP run

```cmd
cd C:\xampp\htdocs\avolab_project
npm install
npm run dev
```

Open `http://localhost:3000`.

Do not delete/re-import the database just for this synchronization patch if the existing schema is already working. The server performs backward-compatible checks for `notifications.link` and `audit_logs`.


## BOPIS OMS visibility fix
- Staff Order Management System now surfaces every SQL-backed BOPIS order regardless of the currently selected staff store.
- The selected store is still retained/displayed, and BOPIS QR verification remains store-restricted in `StaffQRVerification`.
- Home Delivery visibility is unchanged.
