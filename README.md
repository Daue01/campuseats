# 🍽️ CampusEats — Campus Food Ordering Platform

> "Hot food. Fast delivery. Zero stress."

A full-stack-ready Next.js 14 food ordering platform built for Nigerian university campuses. Styled with Tailwind CSS, fully typed with TypeScript, and production-ready out of the box.

---

## 📁 Project Structure

```
campuseats/
├── app/
│   ├── layout.tsx              # Root layout — wraps all pages with Header + Footer
│   ├── globals.css             # Global styles, animations, Tailwind base
│   ├── page.tsx                # Landing / Marketing homepage
│   ├── feed/
│   │   └── page.tsx            # Student app home feed (logged-in)
│   ├── vendor/
│   │   └── [id]/
│   │       └── page.tsx        # Vendor profile + menu page
│   ├── cart/
│   │   └── page.tsx            # Cart → Checkout → Order confirmation
│   ├── dashboard/
│   │   └── page.tsx            # Vendor dashboard (orders, menu, analytics)
│   └── admin/
│       └── page.tsx            # Super admin panel
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky top nav (shared across all pages)
│   │   ├── Footer.tsx          # Footer with links, socials, copyright
│   │   └── BottomNav.tsx       # Mobile bottom tab bar (5 tabs)
│   └── ui/
│       ├── VendorCard.tsx      # Vendor card — full + compact variants
│       ├── FoodItemCard.tsx    # Food item card — grid + row variants
│       ├── CategoryPill.tsx    # Horizontal scrollable category chips
│       ├── SkeletonLoader.tsx  # Shimmer skeletons for loading states
│       ├── EmptyState.tsx      # Illustrated empty states with CTAs
│       ├── OrderStatusBanner.tsx # Live order tracking progress card
│       ├── ToastNotification.tsx # Auto-dismiss toast (success/error/info)
│       └── CartDrawer.tsx      # Slide-in cart (right on desktop, up on mobile)
│
├── lib/
│   ├── types.ts                # TypeScript interfaces (Vendor, FoodItem, etc.)
│   ├── data.ts                 # All demo data (vendors, food items, categories)
│   └── utils.ts                # cn() helper + formatPrice()
│
├── public/                     # Static assets
├── tailwind.config.ts          # Custom colors, animations, shadows
├── tsconfig.json
├── next.config.js              # Image domain allowlist (Unsplash)
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Install & Run

```bash
# 1. Clone or extract the project
cd campuseats

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open in browser
http://localhost:3000
```

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing / marketing homepage |
| `/feed` | Student app home feed |
| `/vendor/[id]` | Vendor profile + menu |
| `/cart` | Cart → Checkout → Confirmation |
| `/dashboard` | Vendor dashboard |
| `/admin` | Super admin panel |

### Demo Vendor Routes
- `/vendor/mama-titi`
- `/vendor/suya-spot`
- `/vendor/snack-shack`
- `/vendor/freshman-buka`
- `/vendor/campus-grill`

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary orange | `#FF5C00` |
| Near-black | `#1A1A1A` |
| Warm cream | `#FFF3EC` |
| Success | `#12B76A` |
| Warning | `#F79009` |
| Danger | `#F04438` |
| Card radius | `16px` |
| Card shadow | `0 1px 2px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.08)` |
| Transition | `200ms ease-out` |

---

## 🧩 Reusable Components

### `<VendorCard vendor={...} compact? />`
Full card (4-column grid) or compact card (160px horizontal scroll).

### `<FoodItemCard item={...} layout="grid | row" />`
Grid variant for trending meals, row variant for vendor menus.

### `<OrderStatusBanner vendorName currentStep estimatedTime />`
Animated 4-step progress tracker with live pulse indicator.

### `<CartDrawer isOpen onClose />`
Slides from right on desktop, slides up from bottom on mobile.

### `<ToastNotification message type onDismiss />`
Auto-dismisses after 3 seconds. Types: `success | error | info`.

### `<EmptyState type />`
Types: `cart | orders | search | favourites`.

### `<SkeletonLoader />`
`VendorCardSkeleton`, `FoodItemCardSkeleton`, `FeedSkeletonRow`.

---

## 🗄️ Database Integration (PostgreSQL)

This project is UI-only. To connect a real database:

1. Install `prisma` + `@prisma/client`
2. Create `prisma/schema.prisma` with models for `Vendor`, `FoodItem`, `Order`, `User`
3. Replace `lib/data.ts` static exports with Prisma queries in Server Components
4. Add Next.js API Routes or Server Actions for mutations

### Suggested Schema (Prisma)
```prisma
model Vendor {
  id           String     @id @default(cuid())
  name         String
  category     String
  rating       Float
  isOpen       Boolean    @default(true)
  foodItems    FoodItem[]
  orders       Order[]
  createdAt    DateTime   @default(now())
}

model FoodItem {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Int
  imageUrl    String
  available   Boolean  @default(true)
  vendorId    String
  vendor      Vendor   @relation(fields: [vendorId], references: [id])
}

model Order {
  id          String   @id @default(cuid())
  status      String   @default("confirmed")
  total       Int
  vendorId    String
  vendor      Vendor   @relation(fields: [vendorId], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## ⚡ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Images | Unsplash |
| State | React `useState` / `useContext` |
| Database (recommended) | PostgreSQL + Prisma |
| Auth (recommended) | NextAuth.js |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | 375px+ | 1-col, bottom nav, full-screen modals |
| Tablet | 768px+ | 2-col grids, sidebar begins |
| Desktop | 1280px+ | 4-col grids, full sidebar, split views |

---

Made with ❤️ for Nigerian students.
