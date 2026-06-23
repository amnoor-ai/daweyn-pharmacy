# Daaweyn Pharmacy Admin Dashboard — Route & Page Map

This document catalogs all user-facing routes, URL schemas, and their respective frontend page components, matching Laravel and Inertia.js conventions.

---

## 1. Multi-Tenant Routes (`/{current_team}/...`)

The following dashboard and business modules are scoped per team (workspace/branch). These routes are dynamic and secure.

### 1.1 Dashboard
- **Route Name**: `dashboard`
- **URL Pattern**: `/{current_team}/dashboard`
- **Inertia Page Component**: `dashboard` (corresponds to [dashboard.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/dashboard.tsx))
- **Description**: Displays pharmacy KPIs, sales metrics, warning widgets, and multi-team announcements.
- **Status**: Implemented

### 1.2 Categories (Missing)
- **Route Name**: `categories.index`
- **URL Pattern**: `/{current_team}/categories`
- **Inertia Page Component**: `categories/index` (corresponds to `resources/js/pages/categories/index.tsx`)
- **Description**: Displays the search and lookup table for drug categories.
- **Status**: Missing

### 1.3 Products (Missing)
- **Route Name**: `products.index`
- **URL Pattern**: `/{current_team}/products`
- **Inertia Page Component**: `products/index` (corresponds to `resources/js/pages/products/index.tsx`)
- **Description**: Shows the database inventory catalog including quantities, pricing, and stock health pills.
- **Status**: Missing

- **Route Name**: `products.create`
- **URL Pattern**: `/{current_team}/products/create`
- **Inertia Page Component**: `products/create` (corresponds to `resources/js/pages/products/create.tsx`)
- **Description**: Multi-field form to add new pharmacy products to the catalog.
- **Status**: Missing

- **Route Name**: `products.edit`
- **URL Pattern**: `/{current_team}/products/{product}/edit`
- **Inertia Page Component**: `products/edit` (corresponds to `resources/js/pages/products/edit.tsx`)
- **Description**: Interface to modify drug attributes, adjust stock levels, and set price adjustments.
- **Status**: Missing

### 1.4 Transactions (Missing)
- **Route Name**: `transactions.index`
- **URL Pattern**: `/{current_team}/transactions`
- **Inertia Page Component**: `transactions/index` (corresponds to `resources/js/pages/transactions/index.tsx`)
- **Description**: Tabular log of historical sales transaction orders with time filtering.
- **Status**: Missing

- **Route Name**: `transactions.show`
- **URL Pattern**: `/{current_team}/transactions/{transaction}`
- **Inertia Page Component**: `transactions/show` (corresponds to `resources/js/pages/transactions/show.tsx`)
- **Description**: Displays itemized item list, cashier, taxes, and customer receipt details.
- **Status**: Missing

### 1.5 Customers (Missing)
- **Route Name**: `customers.index`
- **URL Pattern**: `/{current_team}/customers`
- **Inertia Page Component**: `customers/index` (corresponds to `resources/js/pages/customers/index.tsx`)
- **Description**: Customer listing, loyalty tiers, contact info, and total revenue contribution.
- **Status**: Missing

- **Route Name**: `customers.show`
- **URL Pattern**: `/{current_team}/customers/{customer}`
- **Inertia Page Component**: `customers/show` (corresponds to `resources/js/pages/customers/show.tsx`)
- **Description**: Chronological purchase logs and active medication/prescription profiles for a patient.
- **Status**: Missing

### 1.6 Users (Missing)
- **Route Name**: `users.index`
- **URL Pattern**: `/{current_team}/users`
- **Inertia Page Component**: `users/index` (corresponds to `resources/js/pages/users/index.tsx`)
- **Description**: View, audit, and configure staff lists and operational dashboard loggers.
- **Status**: Missing

---

## 2. Global Profile & Team Settings Routes (`/settings/...`)

These routes apply globally to the authenticated user and their tenant controls.

### 2.1 Profile
- **Route Name**: `profile.edit`
- **URL Pattern**: `/settings/profile`
- **Inertia Page Component**: `settings/profile` (corresponds to [settings/profile.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/settings/profile.tsx))
- **Description**: Panel to customize personal identification information and account details.
- **Status**: Implemented

### 2.2 Security
- **Route Name**: `security.edit`
- **URL Pattern**: `/settings/security`
- **Inertia Page Component**: `settings/security` (corresponds to [settings/security.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/settings/security.tsx))
- **Description**: Panel to toggle 2FA configurations, view recovery codes, rotate passwords, and register passkeys.
- **Status**: Implemented

### 2.3 Appearance
- **Route Name**: `appearance.edit`
- **URL Pattern**: `/settings/appearance`
- **Inertia Page Component**: `settings/appearance` (corresponds to [settings/appearance.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/settings/appearance.tsx))
- **Description**: System display settings switcher (Light mode, Dark mode, or System defaults).
- **Status**: Implemented

### 2.4 Team Workspaces
- **Route Name**: `teams.index`
- **URL Pattern**: `/settings/teams`
- **Inertia Page Component**: `teams/index` (corresponds to [teams/index.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/teams/index.tsx))
- **Description**: Lists all team workspaces the user is a member of and option to create new ones.
- **Status**: Implemented

- **Route Name**: `teams.edit`
- **URL Pattern**: `/settings/teams/{team}`
- **Inertia Page Component**: `teams/edit` (corresponds to [teams/edit.tsx](file:///c:/Users/abdul/Documents/GitHub/daweyn-pharmacy/resources/js/pages/teams/edit.tsx))
- **Description**: Adjust team name, invite members, modify roles, or leave/delete the team.
- **Status**: Implemented

---

## 3. Help & Support (`/help`)

- **Route Name**: `help`
- **URL Pattern**: `/help`
- **Inertia Page Component**: `help` (corresponds to `resources/js/pages/help.tsx`)
- **Description**: Built-in user manual documentation lookup and technical help ticket forms.
- **Status**: Missing
