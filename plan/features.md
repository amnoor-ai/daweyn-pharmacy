# Daaweyn Pharmacy Admin Dashboard — Feature Roadmap

This document outlines the features grouped by module based on the sidebar navigation. It tracks implementation status for the Daaweyn pharmacy admin dashboard.

---

## 1. Dashboard
- `[x]` **Multi-team Invitations Modal**: Prompts users to accept or decline pending team invitations upon login.
- `[x]` **Layout Grid**: Main dashboard grid shell structured with placeholder layouts for analytics widgets.
- `[ ]` **Analytics Widgets**: Visual widgets showing sales statistics, transaction values, and product counts.
- `[ ]` **Low Stock Alert Widget**: Highlights items that are low in stock or out of stock directly on the dashboard.

## 2. Categories
- `[ ]` **Category Listing**: Table interface displaying pharmacy category names, slugs, and associated product counts.
- `[ ]` **Category Management**: Forms/modals to create, edit, and delete category items.
- `[ ]` **Search and Filter**: Real-time searching and filtering of categories by name.

## 3. Products
- `[ ]` **Product Catalog**: Data table listing medicines with SKU, category, price, quantity, and status.
- `[ ]` **Add/Edit Product Form**: Comprehensive form to input drug information, packaging details, and unit pricing.
- `[ ]` **Stock Warning System**: Flags items that drop below custom thresholds with warning/danger status badges.
- `[ ]` **Delete/Archive Product**: Action to archive or permanently delete obsolete products from the system.

## 4. Transactions
- `[ ]` **Transaction Ledger**: Historical view of all orders, total value, date range filters, and payment methods.
- `[ ]` **Invoice View**: Detailed modal/page summarizing itemized sales, applied taxes, discounts, and customer details.
- `[ ]` **Export Records**: Download transactional reports to CSV/Excel format for bookkeeping and auditing.

## 5. Customers
- `[ ]` **Customer Profiles**: List showing customer details, contact details, and total purchases.
- `[ ]` **Purchase History**: Detail page listing previous prescriptions filled and historical transactions for a customer.

## 6. Users
- `[ ]` **Staff Directory**: List showing all internal pharmacy users, email addresses, and active roles.
- `[ ]` **User Access Audit Logs**: Keep track of login timestamps and actions performed by administrators or cashiers.

## 7. Settings
- `[x]` **User Profile Edit**: Update personal user details, display name, and login email.
- `[x]` **Security Controls**: Update user password, set up multi-factor auth (2FA), and view recovery codes.
- `[x]` **FIDO2 Passkeys**: Register, view, and delete passkeys for passwordless authentication.
- `[x]` **Appearance Tabs**: In-app selector for Light, Dark, or System visual theme overrides.
- `[x]` **Team Settings**: Create new team workspaces, update team names, invite members, edit member roles, and delete teams.

## 8. Help
- `[ ]` **User Manual**: Contextual guides and documentation on how to perform sales, update stock, and register users.
- `[ ]` **Support Contact Form**: Built-in ticket submission form for staff to report bugs or request tech assistance.
