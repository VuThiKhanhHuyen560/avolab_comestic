# AVOLAB BOPIS workflow

## Canonical workflow

Customer places an in-store pickup order -> `PROCESSING` -> OMS -> `PICKING` -> `PACKED` -> `READY_FOR_PICKUP` -> open `BOPIS Verification` -> scan/enter the customer's QR -> atomic server verification + handover -> `COMPLETED`.

## Synchronization

MySQL is the source of truth. Every order create/status mutation is persisted server-side and broadcast through SSE as `order.created` / `order.updated`. All open customer, staff, and admin sessions consume those events. Analytics are refreshed after order mutations.

## QR rule

A BOPIS order cannot be completed through the generic order-status endpoint. `COMPLETED` is only allowed through the QR verification transaction, which validates the QR against the order and store and then commits the completion in the same server operation.

## Delivery remains separate

Delivery uses `PENDING/PROCESSING -> PICKING -> PACKED -> SHIPPED -> COMPLETED`. BOPIS never uses `SHIPPED`.
