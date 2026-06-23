# Farmaku Admin Dashboard — Design System

Reference documentation extracted from the Farmaku Pharmacy Admin Dashboard UI (Dashboard, Categories, Product, Transaction, and Customer screens). Use this as the source of truth for colors, type, spacing, and component patterns when building or extending the product.

---

## 1. Brand & Visual Personality

Farmaku reads as clean, clinical, and trustworthy: a deep navy brand color paired with a soft, near-white canvas, generous white space, fully rounded cards, and a restrained accent palette used only inside icon chips, charts, and status badges. The tone is calm and data-forward rather than playful — appropriate for a healthcare/pharmacy back office.

---

## 2. Color Palette

### 2.1 Brand / Primary

| Token | Hex | Usage |
|---|---|---|
| `primary-900` (Navy) | `#1B2559` | Logo wordmark, active sidebar item, primary buttons, darkest chart/donut segment |
| `primary-800` (Navy Hover) | `#141C45` | Hover/pressed state for primary buttons and active nav |
| `primary-50` (Navy Tint) | `#EEF0FD` | "Available" badge background, light icon chip background |

### 2.2 Secondary / Chart Accent

| Token | Hex | Usage |
|---|---|---|
| `indigo-600` | `#4C5FD5` | Secondary donut segment, "Actual Revenue" bars, badge text |
| `indigo-400` | `#8C9AEB` | Tertiary donut segment, line chart secondary line |
| `indigo-200` | `#C7CFF7` | Lightest donut segment, "Target Revenue" bars |
| `teal-500` | `#1FAE8E` | Growth/positive line (Sales Performance), income icon chip |

### 2.3 Semantic / Status

| Token | Hex (bg / fg) | Usage |
|---|---|---|
| `success` | bg `#E1F7F0` / fg `#1FAE8E` | Positive trend, income |
| `warning` | bg `#FEF6DA` / fg `#C68A0A` | "Low Stock" badge, warning icon chip |
| `danger` | bg `#FCE8E8` / fg `#E5484D` | "Empty / Out of Stock" badge, error icon chip |
| `info` | bg `#EEF0FD` / fg `#4C5FD5` | "Available" badge |

### 2.4 Icon Chip Accents (stat cards)

These are light, desaturated tints used only as the 44–48px background square behind a stat-card icon — never as large surface fills.

| Token | Hex | Used for |
|---|---|---|
| `chip-blue` | `#E9EAFC` | Customers, Products |
| `chip-pink` | `#FCE9F4` | Transactions |
| `chip-orange` | `#FDEADB` | Sales |
| `chip-teal` | `#DFF7F0` | Income |
| `chip-green` | `#E3F6E9` | Types |
| `chip-yellow` | `#FEF6DA` | Low Stock |
| `chip-red` | `#FCE8E8` | Empty / Out of Stock |

### 2.5 Neutrals

| Token | Hex | Usage |
|---|---|---|
| `bg-canvas` | `#F6F7FB` | Page/app background |
| `surface` | `#FFFFFF` | Cards, sidebar, table, inputs |
| `border` | `#ECEEF5` | Card outlines, input borders |
| `divider` | `#F1F2F7` | Table row dividers |
| `text-primary` | `#161A30` | Headings, table cell text, stat values |
| `text-secondary` | `#8A8FA6` | Labels, table headers, helper text |
| `text-muted` | `#B0B4C4` | Placeholder text, section labels (MENU/OTHERS) |
| `text-on-primary` | `#FFFFFF` | Text/icons on navy surfaces |

### 2.6 Chart Sequential Scale (donuts)

Donut charts use a single-hue navy ramp, darkest segment = largest share:

`#1B2559` → `#4C5FD5` → `#8C9AEB` → `#C7CFF7`

---

## 3. Typography

**Font family:** A geometric/grotesque sans — visually consistent with **Plus Jakarta Sans** (fallback: Inter, system-ui, sans-serif). Numerals are tabular and bold for stat figures.

| Style | Size | Weight | Color | Usage |
|---|---|---|---|---|
| Stat Value | 28–32px | Bold (700) | `text-primary` | Big numbers in stat cards ("7,986") |
| Page Title (H1) | 24–28px | Bold (700) | `text-primary` | "Categories", "Product", "Transaction" |
| Card Title (H2) | 16–18px | SemiBold (600) | `text-primary` | "Sales Performance", "Payment Methods" |
| Card Subtitle | 13px | Regular (400) | `text-secondary` | "See how your sales grow month by month…" |
| Body / Table Cell | 14px | Medium (500) | `text-primary` | Table content, button labels |
| Table Header | 13px | Medium (500) | `text-secondary` | Column headers |
| Caption / Badge | 12–13px | Medium (500) | varies | Status pills, legend labels |
| Section Label | 11–12px | Medium (500), uppercase, +0.05em tracking | `text-muted` | "MENU", "OTHERS", "PREFERENCES" |

---

## 4. Spacing Scale

Base unit: **4px**.

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64`

- Card internal padding: 20–24px
- Gap between cards in a grid: 24px
- Sidebar item padding: 12px vertical / 16px horizontal
- Table row vertical padding: 16px

---

## 5. Radius & Elevation

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | Small icon buttons (notification, three-dot menu) |
| `radius-md` | 10–12px | Inputs, buttons, sidebar nav items, icon chips |
| `radius-lg` | 16px | Table containers, smaller cards |
| `radius-xl` | 20px | Stat cards, chart cards |
| `radius-full` | 9999px | Status badges, avatar |

**Shadow:** one soft, low-contrast elevation used uniformly on cards —
`box-shadow: 0 2px 10px rgba(20, 28, 64, 0.05);`
No heavier elevation levels are used; depth comes from whitespace and the light `bg-canvas` vs. white `surface` contrast, not from shadow intensity.

---

## 6. Layout

- **Sidebar:** fixed left, ~280px wide, white surface, collapsible (toggle icon next to logo).
- **Top bar:** greeting text (left), global search (center-left), notification icon + user avatar/name/chevron (right).
- **Content grid:** 4-column stat card row → 2/3 + 1/3 chart row → 1/2 + 1/2 chart/table row. 24px gutters throughout.
- **Page anatomy pattern** (repeats on every module — Dashboard, Categories, Product, Transaction, Customer):
  1. Page title + top bar
  2. Row of 4 stat cards
  3. Primary data table with search + filters + primary action button
  4. Supporting analytics row (1–2 chart cards: donut + bar/line, or donut + secondary table)

---

## 7. Components

### 7.1 Sidebar Navigation
- Default item: `text-secondary` icon + label, transparent background, `radius-md`.
- Active item: `primary-900` background, white text/icon, `radius-md`, full-width fill within padding.
- Hover: `bg-canvas` background.
- Section labels (MENU / OTHERS / PREFERENCES): `text-muted`, uppercase, small.
- Preferences footer includes a Dark Mode toggle switch, Settings, and Help — styled like nav items with a trailing toggle for Dark Mode. *(No dark-mode screens were available to extract exact dark-theme tokens — treat as an extension point: invert `bg-canvas`/`surface` and re-test contrast against the existing semantic colors.)*

### 7.2 Buttons
| Variant | Style |
|---|---|
| Primary | `primary-900` fill, white text, `radius-md`, 10px/20px padding (e.g. "+ Add New", "Export") |
| Secondary / Outline | White fill, `border` outline, `text-primary` label (e.g. "See All", "Filter") |
| Icon Button | `bg-canvas` fill, `radius-sm`, centered icon (notification, three-dot menu, collapse) |

### 7.3 Inputs & Filters
- Search input: white/`bg-canvas` fill, `border` outline, `radius-md`, leading search icon, "Search anything" placeholder.
- Dropdown filter (Category/Type/Status/Date range): white fill, `border` outline, `radius-md`, trailing chevron.

### 7.4 Stat Card
White surface, `radius-xl`, soft shadow, 20–24px padding. Layout: icon chip (top-left, colored per §2.4) → label (`text-secondary`, 13px) → value (Bold, 28–32px, `text-primary`).

### 7.5 Chart Card
White surface, `radius-xl`. Header row: title + optional subtitle (left), filter dropdown(s) and a three-dot overflow menu (right). Body holds a line/area chart, bar chart, or donut chart. Donut charts center a large bold total value inside the ring, with an external legend of color-dot + label pairs below.

### 7.6 Data Table
- Header row: `text-secondary`, 13px, no fill, bottom `divider`.
- Body rows: `text-primary`, 14px, `divider` between rows, generous 16px vertical padding, no zebra striping.
- Action column: ghost icon buttons only (eye = view, pencil = edit, trash = delete), `text-secondary` default, no background.

### 7.7 Status Badge
Pill shape (`radius-full`), 4px/12px padding, 12–13px medium text, semantic background + matching foreground text per §2.3 (`info` = Available, `warning` = Low Stock, `danger` = Empty/Out of Stock).

### 7.8 Iconography
Outline/line-style icon set (consistent stroke weight, ~1.5–2px), no filled icons except inside colored chips. Sizes: 18–20px in nav/table contexts, 20–24px inside stat-card icon chips.

---

## 8. Design Tokens (CSS Variables)

```css
:root {
  /* Brand */
  --color-primary-900: #1B2559;
  --color-primary-800: #141C45;
  --color-primary-50: #EEF0FD;

  /* Chart / accent */
  --color-indigo-600: #4C5FD5;
  --color-indigo-400: #8C9AEB;
  --color-indigo-200: #C7CFF7;
  --color-teal-500: #1FAE8E;

  /* Semantic */
  --color-success-bg: #E1F7F0;
  --color-success-fg: #1FAE8E;
  --color-warning-bg: #FEF6DA;
  --color-warning-fg: #C68A0A;
  --color-danger-bg: #FCE8E8;
  --color-danger-fg: #E5484D;
  --color-info-bg: #EEF0FD;
  --color-info-fg: #4C5FD5;

  /* Icon chips */
  --chip-blue: #E9EAFC;
  --chip-pink: #FCE9F4;
  --chip-orange: #FDEADB;
  --chip-teal: #DFF7F0;
  --chip-green: #E3F6E9;
  --chip-yellow: #FEF6DA;
  --chip-red: #FCE8E8;

  /* Neutrals */
  --bg-canvas: #F6F7FB;
  --surface: #FFFFFF;
  --border: #ECEEF5;
  --divider: #F1F2F7;
  --text-primary: #161A30;
  --text-secondary: #8A8FA6;
  --text-muted: #B0B4C4;
  --text-on-primary: #FFFFFF;

  /* Typography */
  --font-family-base: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-card: 0 2px 10px rgba(20, 28, 64, 0.05);

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

---

## 9. Notes & Assumptions

- Exact hex values are best-effort extractions from screenshots, not pixel-sampled from source files — verify against any Figma source before production use.
- Dark mode exists as a toggle in the UI but no dark-theme screens were provided, so dark tokens are not specified here.
- Font family is a visual match (Plus Jakarta Sans), not confirmed against the original Figma file's font settings.
