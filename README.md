# Inventory Manager — Frontend

> **Note:** This project was built as a study in [vibe coding](https://en.wikipedia.org/wiki/Vibe_coding) with [Claude Code](https://claude.ai/code). The entire codebase — from architecture decisions to component implementation — was developed through natural-language conversation with an AI pair programmer.

A React 19 + TypeScript single-page application for digitalizing and automating inventory control. The system replaces a manual, paper-based workflow by tracking product stock across multiple e-commerce sub-accounts, registering purchase entries (_notas fiscais_) and sale exits (_baixas_), and providing real-time visibility with a full movement history.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Decisions](#architecture-decisions)
5. [Getting Started](#getting-started)
6. [Routes](#routes)
7. [Domain Concepts and Business Rules](#domain-concepts-and-business-rules)
8. [Coding Standards](#coding-standards)
---

## Problem Statement

Inventory operations were previously tracked on paper across multiple e-commerce marketplace sub-accounts (Shopee, Mercado Livre, Amazon, etc.). This made it impossible to know the real-time stock level for any product, caused over-selling and under-ordering errors, and provided no movement history for auditing.

This frontend application solves the problem by providing:

- A centralized stock management view with search and state-based filtering.
- A per-product detail page with a general info tab and a full movement history tab.
- Entry (_dar entrada_) and exit (_dar baixa_) flows with a confirmation preview step.
- Configurable stock state thresholds so operators can define what "normal", "medium", and "low" mean for their business.
- E-commerce account management linked to each product.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.6 (strict mode) |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Component primitives | Radix UI (Dialog, Select, DropdownMenu, Popover, Checkbox, Toast, Tooltip, etc.) |
| Icons | Lucide React |
| State management | Zustand 5 |
| Routing | React Router v6 |
| Forms | React Hook Form 7 + Zod 4 |
| HTTP client | Axios 1 |
| Testing | Vitest 2 + React Testing Library 16 |
| Linting | ESLint 9 + typescript-eslint |
| Formatting | Prettier 3 |
| Conditional classes | clsx |

---

## Project Structure

```
src/
├── assets/            # Static files (images, icons)
├── components/
│   └── ui/            # Generic, stateless UI primitives
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── ConfirmDialog.tsx
│       ├── Dialog.tsx
│       ├── Input.tsx
│       ├── Pagination.tsx
│       ├── Select.tsx
│       └── Textarea.tsx
├── features/          # Feature-sliced domain modules
│   ├── accounts/      # E-commerce sub-account CRUD
│   ├── movements/     # Entry / exit modals and movement history table
│   ├── parameters/    # Stock threshold configuration
│   └── products/      # Product CRUD and stock display
├── hooks/             # Shared custom hooks (if any)
├── layouts/
│   ├── RootLayout.tsx # App shell (sidebar + main content area)
│   └── Sidebar.tsx    # Collapsible navigation sidebar
├── mocks/
│   └── data.ts        # In-memory seed data (replaces API until backend is ready)
├── pages/
│   ├── AccountsPage.tsx
│   ├── ParametersPage.tsx
│   ├── ProductDetailPage.tsx  # Also handles the "New product" route
│   └── StockManagementPage.tsx
├── router/
│   └── index.ts       # React Router configuration (lazy-loaded routes)
├── services/          # Axios instances and API endpoint functions (future)
├── store/             # Zustand stores
│   ├── useAccountStore.ts
│   ├── useMovementStore.ts
│   ├── useParameterStore.ts
│   └── useProductStore.ts
├── test/              # Vitest global setup
├── types/
│   └── index.ts       # Shared TypeScript interfaces and type aliases
└── utils/
    └── stock.ts       # Pure utility functions (getStockState, formatDate, etc.)
```

Each feature folder follows this internal pattern:

```
features/<feature>/
├── components/   # Feature-specific presentational components
├── hooks/        # Feature-specific custom hooks (data fetching, form logic)
├── schemas.ts    # Zod schemas — single source of truth for validation and types
└── index.ts      # Public barrel export (if needed)
```

---

## Architecture Decisions

### Feature-sliced structure

Code is grouped by domain feature, not by technical layer. The `accounts/`, `movements/`, `parameters/`, and `products/` folders each encapsulate everything needed for that domain concern: components, hooks, and schemas.

### Shared UI primitives in `components/ui/`

Only generic, stateless, reusable primitives live here. They wrap Radix UI components with Tailwind classes applied. Business-aware components belong inside the relevant `features/` folder.

### Radix UI as the interactive primitive layer

`Dialog`, `Select`, `Checkbox`, `Popover`, `DropdownMenu`, `Toast`, `Tooltip`, and other interactive widgets are always built on top of their Radix UI counterpart. Raw `<dialog>`, `<select>`, and similar HTML elements are not used for interactive components.

### Zustand for global state

One store per domain concern (`useAccountStore`, `useProductStore`, `useMovementStore`, `useParameterStore`). Stores are the single source of truth during the mock phase and will be replaced by API-backed hooks when a backend is available.

### Zod as the single source of truth for form contracts

Every form has a corresponding Zod schema in `features/<feature>/schemas.ts`. TypeScript types for form values are derived via `z.infer<>`. The same schema drives runtime validation through the `@hookform/resolvers/zod` resolver.

### Separation of concerns

Components are responsible for presentation only. Business logic lives outside of them:

| Logic type | Where it lives |
|---|---|
| Data fetching + async state | Custom hook in `features/<feature>/hooks/` |
| Form validation rules | Zod schema in `features/<feature>/schemas.ts` |
| Business calculations (stock state, thresholds) | Pure utility in `utils/` |
| Global state | Zustand store in `store/` |
| API call definitions | `services/` |

### Path alias

`@/` maps to `src/` for clean absolute imports across the codebase (e.g., `@/components/ui/Button`, `@/store/useProductStore`).

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Installation

```bash
git clone <repo-url>
cd inventory-manager-frontend
npm install
```

### Development commands

```bash
# Start the local development server (http://localhost:5173)
npm run dev

# Build for production (type-check + Vite bundle)
npm run build

# Preview the production build locally
npx vite preview

# Lint all TypeScript/TSX files
npm run lint

# Format with Prettier
npx prettier --write .

# Type-check without emitting output
npx tsc --noEmit

# Run tests
npx vitest

# Run tests with coverage report
npx vitest run --coverage
```

### Environment variables

Create a `.env.local` file at the project root when connecting to a real backend:

```env
VITE_API_BASE_URL=http://localhost:3000
```

This variable is currently unused — all data is served from `src/mocks/data.ts`.

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | — | Redirects to `/products` |
| `/products` | `StockManagementPage` | Product grid with search and stock state filter |
| `/products/new` | `ProductDetailPage` (new) | Create a new product |
| `/products/:id` | `ProductDetailPage` (existing) | Product general info + movement history tabs |
| `/accounts` | `AccountsPage` | CRUD for e-commerce sub-accounts |
| `/settings/parameters` | `ParametersPage` | Configure stock state thresholds |

All routes are lazy-loaded via React Router's `lazy` option. The shared `RootLayout` renders the collapsible sidebar and the `<Outlet />` for nested routes.

---

## Domain Concepts and Business Rules

### Glossary

| Portuguese term | English meaning |
|---|---|
| **Produto** | A product tracked in the inventory |
| **Conta** | An e-commerce marketplace sub-account |
| **Nota Fiscal** | Purchase invoice that triggers a stock entry |
| **Dar entrada** | Register a stock increase (purchase received) |
| **Dar baixa** | Register a stock deduction caused by a sale |
| **Baixa** | A sale-driven stock deduction (exit movement) |
| **Movimentação** | Any stock movement, either entry or exit |
| **Estoque Reserva** | Reserve stock; allows stock quantity to go negative when the main stock is depleted |
| **Parâmetros** | Configurable stock state thresholds |
| **Preview** | Pre-confirmation view showing current vs. resulting stock with a visual state indicator |

### Stock states

Every product's quantity is classified into one of these states, which drives the color of the `StockBadge` component:

| State | Condition | Default color |
|---|---|---|
| **Normal** | `quantity >= thresholds.normal` (default: 20) | Green `#16a34a` |
| **Médio** (Medium) | `thresholds.medium <= quantity < thresholds.normal` (default: 10) | Amber `#d97706` |
| **Baixo** (Low) | `0 <= quantity < thresholds.medium` | Red `#dc2626` |
| **Negativo** (Negative) | `quantity < 0` | Red `#dc2626` |

The thresholds are configurable at runtime via the **Parameters** page (`/settings/parameters`). The `useParameterStore` reacts to threshold changes, and `getStockState` (in `src/utils/stock.ts`) computes the state from a quantity + thresholds pair without any component-level logic.

### Unified stock pool

All e-commerce accounts share a single stock quantity per product. A sale on any account deducts from the same unified quantity. The account selected during an exit is recorded in the movement for traceability, not for stock partitioning.

### Negative quantities (reserve stock — _estoque reserva_)

Quantities below zero are valid. When an exit would push the quantity negative, the operator is warned in the preview step but is allowed to confirm. This models the real-world practice of fulfilling orders from a reserve that will be replenished shortly.

### Sale exit flow — 2 steps with preview

1. Operator opens the exit modal (_Dar baixa_) from the product detail page.
2. Operator selects the e-commerce account and enters the quantity sold.
3. The app computes a **preview**: current quantity → resulting quantity + visual state badge.
4. If the result is negative, a warning about reserve stock usage is shown.
5. Operator confirms → the movement is persisted to the store and the product quantity is updated.

### Stock entries

Entries are simpler: the operator inputs a quantity and an optional note (e.g., a _Nota Fiscal_ reference). There is no account selection because entries represent stock arriving at the warehouse, not tied to a specific marketplace account. The movement is recorded with `accountId: "manual"`.

---

## Coding Standards

### TypeScript

- Strict mode is enabled (`"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true`).
- Use `interface` for object shapes and `type` for unions, intersections, and aliases.
- `any` is forbidden — the ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`. Use `unknown` and narrow with type guards when the shape is truly unknown.
- Type-only imports must use `import type` — enforced by `@typescript-eslint/consistent-type-imports`.

### React components

- Functional components only — no class components.
- Named exports only — no default exports for components.
- Props interfaces named `<ComponentName>Props`.
- Components must not contain business logic, derived calculations, or direct store mutations.
- Custom hooks encapsulate all non-trivial side effects, data fetching, and form logic.
- Extract to sub-components when a file exceeds ~150 lines, along clear presentation boundaries.

### Naming conventions

| Entity | Convention | Example |
|---|---|---|
| Components | PascalCase | `StockBadge`, `ExitModal` |
| Hooks | camelCase, `use` prefix | `useProducts`, `useExitForm` |
| Zustand stores | camelCase, `use` + `Store` suffix | `useProductStore` |
| Files | kebab-case | `stock-badge.tsx`, `use-exit-form.ts` |
| Constants | UPPER_SNAKE_CASE | `STATE_FILTER_OPTIONS` |
| Event handlers | `handle<Event>` pattern | `handleConfirm`, `handleSubmit` |

### Styling

- Tailwind CSS utility classes only — no inline styles and no separate `.css` files unless unavoidable.
- Use `clsx` for conditional class merging.
- Stock state colors use the `stock.*` custom Tailwind tokens defined in `tailwind.config.js` (`stock.normal`, `stock.low`, `stock.negative`). Components that need the runtime color from the parameter store read it via `useParameterStore(s => s.getStateConfig(state)).color` and apply it as an inline `style` — the only sanctioned use of inline styles in the codebase.

### Prettier configuration

```
semi: false
singleQuote: true
trailingComma: 'all'
printWidth: 100
tabWidth: 2
```

### Testing

- Test files co-located with the source file: `<name>.test.tsx`.
- Test names follow: `it('should <behavior> when <condition>')`.
- Do not mock Zustand stores — use real store instances and reset state in `beforeEach`.
- Cover rendering, user interactions, and edge cases (zero stock, negative stock, empty lists).

> Claude Code Generated Repository - 2026-04-03