# Daaweyn Pharmacy Admin Dashboard — Component Catalog

This document indexes existing and planned React components for the Daaweyn application, detailing their purpose, design system tokens, Shadcn UI dependencies, and implementation status.

---

## 1. Global & Layout Components

These components structure the application layout and viewport frames.

| Component Name | Purpose | Styling / Tokens Used | Status |
| :--- | :--- | :--- | :--- |
| [app-sidebar.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/app-sidebar.tsx) | Fixed left sidebar navigation; includes brand header, collapsible sections, and footer selectors. | Canvas: `#F6F7FB`<br>Active fill: `#1B2559`<br>Border: `#ECEEF5`<br>Radius: `radius-md` (12px) | Built |
| [app-shell.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/app-shell.tsx) | Outer viewport wrapper grouping the sidebar, top header, and page content frame. | Canvas: `#F6F7FB` | Built |
| [app-header.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/app-header.tsx) | Main top header containing welcome messages, search input, notification buttons, and team selector. | Border: `#ECEEF5`<br>Text: `#161A30` | Built |
| [settings/layout.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/layouts/settings/layout.tsx) | Uniform grid-based wrapper layout for all sub-settings views. | Canvas: `#F6F7FB`<br>Border: `#ECEEF5` | Built |

---

## 2. Shadcn UI Primitives (`resources/js/components/ui/`)

These atomic elements form the foundation of our pages and feature components.

| Component Name | Purpose | Status |
| :--- | :--- | :--- |
| [button.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/button.tsx) | Standard interactive clickable buttons (navy filled, outlined, ghost, icon-only) | Built |
| [badge.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/badge.tsx) | Rounded pills representing states (Success, Danger, Warning, Info) | Built |
| [card.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/card.tsx) | Standard surfaces with `radius-xl` (20px) and soft low-contrast shadow | Built |
| [dialog.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/dialog.tsx) | Accessible overlay modals for critical confirmations and actions | Built |
| [dropdown-menu.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/dropdown-menu.tsx) | Context action lists and selector options | Built |
| [select.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/select.tsx) | Custom dropdown select fields styled to match input elements | Built |
| [input.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/input.tsx) | Text field inputs with border `#ECEEF5` and radius `radius-md` (12px) | Built |
| [sheet.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/sheet.tsx) | Side drawer slide-overs for displaying detailed layouts or quick forms | Built |
| [tooltip.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/tooltip.tsx) | Info tooltips appearing on hover of condensed layouts | Built |
| [checkbox.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/components/ui/checkbox.tsx) | Input checkboxes for multi-row tables or configuration checklists | Built |

---

## 3. Feature-Specific Components Needed

These components support the missing modules and represent custom dashboards, forms, and widgets.

### 3.1 Categories
- **`CategoryTable`**
  - *Purpose*: Lists pharmacy categories, displaying category metadata, slug, product counts, and action pencil/trash controls.
  - *Shadcn Primitives*: `button`, `input` (search bar).
  - *Status*: **Missing**
- **`CategoryDialog`**
  - *Purpose*: Renders a modal form to quickly add a new category or edit an existing one.
  - *Shadcn Primitives*: `dialog`, `input`, `label`, `button`.
  - *Status*: **Missing**

### 3.2 Products
- **`ProductTable`**
  - *Purpose*: Searchable and filterable data grid listing drug catalog items with their stock health.
  - *Shadcn Primitives*: `button`, `input`, `badge`, `dropdown-menu`.
  - *Status*: **Missing**
- **`StockAlertBadge`**
  - *Purpose*: Renders color-coded status capsules matching the design tokens (`success` = Available, `warning` = Low Stock, `danger` = Out of Stock).
  - *Shadcn Primitives*: `badge`.
  - *Status*: **Missing**
- **`ProductForm`**
  - *Purpose*: Comprehensive form containing SKU, drug name, category selector, unit cost, base price, and stock warning threshold inputs.
  - *Shadcn Primitives*: `input`, `select`, `label`, `button`.
  - *Status*: **Missing**

### 3.3 Transactions
- **`TransactionTable`**
  - *Purpose*: Ledger of historical sales, showing date ranges, totals, payment types, and detailed drawer anchors.
  - *Shadcn Primitives*: `button`, `input`, `badge`, `select` (payment filter).
  - *Status*: **Missing**
- **`InvoiceSheet`**
  - *Purpose*: Slide-out drawer summarizing detailed transaction lines, items, tax calculations, discounts, and cashier records.
  - *Shadcn Primitives*: `sheet`, `separator`, `button`.
  - *Status*: **Missing**
- **`RevenueLineChart`**
  - *Purpose*: Graph illustrating the daily/monthly actual vs target sales revenue curves.
  - *Design System*: Uses `indigo-600` (`#4C5FD5`) for actual and `indigo-200` (`#C7CFF7`) for targets.
  - *Status*: **Missing**
- **`PaymentMethodDonut`**
  - *Purpose*: Circular graphic visualizing payment distributions.
  - *Design System*: Uses sequential navy scale (`#1B2559` → `#4C5FD5` → `#8C9AEB` → `#C7CFF7`).
  - *Status*: **Missing**

### 3.4 Customers
- **`CustomerTable`**
  - *Purpose*: Searchable ledger listing patients, their contact points, last prescription fill dates, and loyalty ranks.
  - *Shadcn Primitives*: `button`, `input`, `badge`.
  - *Status*: **Missing**
- **`CustomerHistoryTimeline`**
  - *Purpose*: Vertical visual timeline summarizing previous patient orders and medications.
  - *Shadcn Primitives*: `card`.
  - *Status*: **Missing**

### 3.5 Users
- **`StaffTable`**
  - *Purpose*: Admin list displaying operational user accounts, email coordinates, active roles, and invite statuses.
  - *Shadcn Primitives*: `button`, `badge`, `dropdown-menu`.
  - *Status*: **Missing**
- **`InviteStaffDialog`**
  - *Purpose*: Form modal to input email and select roles to dispatch new invitations.
  - *Shadcn Primitives*: `dialog`, `input`, `select`, `button`.
  - *Status*: **Missing**
