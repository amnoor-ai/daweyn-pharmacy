# Daaweyn Pharmacy Admin Dashboard — Phased Build Tasks

This checklist outlines the remaining implementation steps for the Daaweyn pharmacy dashboard.

---

## Completed Base Infrastructure
- `[x]` Auth system configuration (Laravel Fortify + Passkey authenticators)
- `[x]` Multi-tenant workspace teams (create, join, invite, switch, and delete)
- `[x]` Profile Settings panels & visual appearance overrides (light/dark switcher tabs)
- `[x]` Fixed sidebar navigation drawer
- `[x]` Initial Dashboard skeleton container

---

## Phase 1 — Categories (CRUD)
Managing drug classes (e.g. Prescription, OTC, Generic, Vaccines).

### Backend
- `[x]` Create `Category` Model and Database Migration (fields: `id`, `team_id`, `name`, `slug`, `description`, timestamps)
- `[x]` Implement category database constraints (scoped unique constraint on `team_id` and `slug`)
- `[x]` Build `CategoryController` (CRUD: `index`, `store`, `update`, `destroy`)
- `[x]` Register multi-tenant routes in `routes/web.php` (under `{current_team}` prefix and auth middleware)
- `[ ]` Create test suite for category CRUD logic and authorization rules

### Frontend
- `[x]` Create Inertia Page `resources/js/pages/categories/index.tsx`
- `[x]` Implement `CategoryTable` showing names, product counts, and actions
- `[x]` Implement `CategoryDialog` modal for adding/editing categories
- `[x]` Connect form submissions using Inertia's `useForm` hook and display success toast messages
- `[ ]` Regenerate Wayfinder TypeScript routes using `php artisan boost:update` or equivalent command

---

## Phase 2 — Products & Inventory (CRUD + Stock Tracking)
Managing drug products, unit costs, pricing, and stock alerts.

### Backend
- `[x]` Create `Product` Model and Database Migration (fields: `id`, `team_id`, `category_id`, `sku`, `name`, `description`, `cost_price`, `selling_price`, `stock_quantity`, `alert_threshold`, timestamps)
- `[x]` Implement product database constraints and index configurations (foreign key to `categories`, index on `sku`)
- `[x]` Build `ProductController` (CRUD: `index`, `create`, `store`, `edit`, `update`, `destroy`)
- `[x]` Add validation rules for cost and selling prices (ensure positive numbers, logical decimal limits)
- `[x]` Register multi-tenant routes in `routes/web.php`

### Frontend
- `[x]` Create Inertia Page `resources/js/pages/products/index.tsx` (product listing with alert badges)
- `[x]` Build `ProductTable` component supporting pagination, category filtering, and search queries
- `[x]` Create `ProductForm` component (pages: `products/create.tsx` and `products/edit.tsx`)
- `[x]` Implement color-coded `StockAlertBadge` using status colors (success, warning, danger)
- `[x]` Rebuild Wayfinder type declarations and verify form navigation routes

---

## Phase 3 — Customers
Managing customer profiles and patient record tracking.

### Backend
- `[x]` Create `Customer` Model and Database Migration (fields: `id`, `team_id`, `name`, `email`, `phone`, `address`, `loyalty_points`, timestamps)
- `[x]` Create customer index on fields for speedy search (indexes on `phone` and `name`)
- `[x]` Build `CustomerController` (`index`, `show`, `store`, `update`)
- `[x]` Register multi-tenant routes in `routes/web.php`

### Frontend
- `[x]` Create Inertia Page `resources/js/pages/customers/index.tsx`
- `[x]` Build `CustomerTable` component with search inputs and summary indicators
- `[x]` Create Inertia Page `resources/js/pages/customers/show.tsx` showing medication logs and details
- `[x]` Create `CustomerHistoryTimeline` component to display chronological filled items
- `[x]` Recompile route endpoints and verify customer profiles view

---

## Phase 4 — Transactions & Sales
Handling purchases, invoices, and sales performance data.

### Backend
- `[x]` Create `Transaction` Model and Database Migration (fields: `id`, `team_id`, `customer_id`, `invoice_number`, `subtotal`, `tax`, `discount`, `total`, `payment_method`, `cashier_id`, timestamps)
- `[x]` Create `TransactionItem` Model and Database Migration (fields: `id`, `transaction_id`, `product_id`, `quantity`, `unit_price`, `total`, timestamps)
- `[x]` Implement database triggers/logic to automatically decrement product inventory stock on successful transaction checkout
- `[x]` Build `TransactionController` (`index`, `show`, `store` for sales checkout)
- `[x]` Register multi-tenant routes in `routes/web.php`

### Frontend
- `[x]` Create Inertia Page `resources/js/pages/transactions/index.tsx`
- `[x]` Build `TransactionTable` showing sales records, payment pill badges, and totals
- `[x]` Create `InvoiceSheet` side drawer displaying itemized invoice listings
- `[ ]` Set up checkout form endpoints to process test pharmacy sales
- `[x]` Rebuild Wayfinder endpoints

---

## Phase 5 — Users & Role Management
Controlling staff profiles and access levels (e.g. Administrator, Pharmacist, Cashier).

### Backend
- `[x]` Build `UserController` (specifically mapping users linked to the active tenant team)
- `[x]` Create database seeders representing standard roles and default staff accounts
- `[x]` Implement policy rules authorizing changes (e.g. only administrators can modify user list or toggle permissions)
- `[x]` Register team staff routes in `routes/web.php`

### Frontend
- `[x]` Create Inertia Page `resources/js/pages/users/index.tsx`
- `[x]` Build `StaffTable` component detailing emails, role pills, and statuses
- `[x]` Build `InviteStaffDialog` modal allowing custom email delivery with assigned access roles
- `[x]` Rebuild route indexes and verify policy authorizations

---

## Phase 6 — Reports & Help Page
Interactive analytics dashboard modules and manuals.

### Backend
- `[x]` Extend `DashboardController` to compute actual vs target sales performance, payment counts, and stock level warnings
- `[x]` Build support ticket endpoint logic for the help section (transmits ticket text to email/log)
- `[x]` Register `help` route in `routes/web.php`

### Frontend
- `[x]` Update [dashboard.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/dashboard.tsx) to render real metrics (replacing grey placeholder grids)
- `[x]` Implement `RevenueLineChart` using visual lines (navy theme accents)
- `[x]` Implement `PaymentMethodDonut` summarizing cash, card, and insurance payments
- `[x]` Create Inertia Page `resources/js/pages/help.tsx` with a searchable FAQ list and support ticket form
- `[x]` Verify dashboard data hydration and help submission flows

---

## Phase 7 — Polish, Testing, & Mobile Responsiveness
Validating UX design parameters and application stability.

### Checklists
- `[x]` Verify Tailwind v4 theme variables match design system spec in [plan/design-system.md](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/plan/design-system.md)
- `[x]` Ensure sidebar and header elements collapse cleanly on mobile layout widths
- `[x]` Run test commands: `php artisan test` (validates all PHP assertions)
- `[x]` Run build verification: `npm run build` (validates TypeScript types and bundler packaging)
- `[x]` Run formatting checklist: `npm run format:check` and lint checks `npm run lint:check`
- `[x]` Perform manual review of interactive dashboard modals, sliders, and drawers
