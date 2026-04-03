# CLAUDE.md — Inventory Manager Frontend

This file provides persistent context for Claude Code agents working on this project.

---

## Project Overview

A React 19 + TypeScript frontend application for digitalizing and automating inventory control, replacing a manual paper-based workflow. The system tracks product stock across multiple e-commerce sub-accounts, registers purchase entries (notas fiscais) and sale exits, and provides real-time visibility with movement history.

---

## Terminal Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format

# Type-check (no emit)
npx tsc --noEmit
```

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **Component primitives:** Radix UI (unstyled, accessible primitives — Dialog, Select, Popover, DropdownMenu, etc.)
- **State management:** Zustand
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **HTTP client:** Axios (or fetch with custom hooks)
- **Testing:** Vitest + React Testing Library
- **Linting/Formatting:** ESLint + Prettier

---

## Project Structure

```
src/
├── assets/            # Static files (images, icons)
├── components/        # Shared/reusable UI components
│   └── ui/            # Primitive UI elements (Button, Input, Badge, Modal...)
├── features/          # Feature-sliced modules
│   ├── products/      # Product CRUD and stock display
│   ├── accounts/      # E-commerce sub-account management
│   ├── entries/       # Stock entry (purchase / nota fiscal) flows
│   ├── exits/         # Stock exit (sale) flows with preview
│   └── history/       # Movement history with filters
├── hooks/             # Custom shared hooks
├── layouts/           # Page layout wrappers
├── pages/             # Route-level page components
├── router/            # React Router configuration
├── services/          # API integration layer (axios instances, endpoints)
├── store/             # Zustand stores (global state)
├── types/             # Shared TypeScript types and interfaces
└── utils/             # Pure utility functions
```

Each feature folder follows the pattern:
```
features/<feature>/
├── components/   # Feature-specific components
├── hooks/        # Feature-specific hooks
├── schemas.ts    # Zod schemas (source of truth for types and validation)
├── types.ts      # Local types derived from schemas via z.infer<>
└── index.ts      # Public exports
```

---

## Architecture Decisions

- **Feature-sliced structure:** group code by domain feature, not by technical layer.
- **Shared UI in `components/ui/`:** only generic, stateless primitives live here. These wrap Radix UI primitives with Tailwind styles applied. Business logic belongs in features.
- **Radix UI as the primitive layer:** use Radix components (Dialog, Select, DropdownMenu, Popover, Checkbox, etc.) inside `components/ui/` wrappers. Never use raw HTML elements for interactive widgets when a Radix primitive exists.
- **Zustand for global state:** one store per domain concern (e.g., `useAccountStore`, `useProductStore`). Avoid prop-drilling through more than 2 levels.
- **Zod schemas as the single source of truth** for form validation and API response parsing. Derive TypeScript types from schemas via `z.infer<>`.
- **No default exports** for components — use named exports to improve refactoring and IDE indexing.

---

## Domain Terminology

| Term | Meaning |
|---|---|
| **Produto** | A product tracked in inventory |
| **Subempresa / Conta** | An e-commerce account (marketplace sub-account) |
| **Estoque Reserva** | Reserve stock; allows negative quantities when main stock is depleted |
| **Nota Fiscal** | Purchase invoice — triggers a stock entry |
| **Baixa** | A stock deduction caused by a sale |
| **Movimentação** | Any stock movement (entry or exit) |
| **Preview** | Pre-confirmation view showing current vs. resulting stock with visual state |

---

## Business Rules

### Stock States
Every product/stock quantity must be classified and displayed with a visual indicator:

| State | Condition | Color |
|---|---|---|
| **Normal** | quantity > low threshold | Green |
| **Baixo (Low)** | 0 < quantity ≤ low threshold | Yellow/Amber |
| **Negativo** | quantity < 0 | Red |

- Negative quantities are valid and must be persisted (reserve stock in use).
- The low threshold is a configurable value per product or global setting.

### Unified Stock
- All e-commerce accounts share a single stock pool per product.
- A sale on any account deducts from the same unified quantity.

### Sale Exit Flow
1. Operator selects the active e-commerce account.
2. Operator selects product and enters quantity sold.
3. App displays a **preview** with: current qty → resulting qty + visual state indicator.
4. Operator confirms → movement is persisted.

---

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true` in `tsconfig.json`).
- Prefer `interface` for object shapes, `type` for unions/intersections.
- No `any` — use `unknown` and narrow with type guards when necessary.
- Export all types from `src/types/` or the feature's `types.ts`.

### React — Separation of Concerns

Components are responsible for **presentation only**. Business logic must live outside of them.

**Components must NOT contain:**
- Derived calculations or business rules (e.g., determining stock state from quantity)
- Direct store mutations or complex multi-step state transitions
- API calls — these belong in hooks via services
- Validation logic beyond what is passed in as props or returned by a hook

**Where business logic lives:**
| Logic type | Where it goes |
|---|---|
| Data fetching + async state | Custom hook (`use<Feature>.ts`) |
| Form validation rules | Zod schema in `features/<feature>/schemas.ts` |
| Business calculations (stock state, thresholds) | Pure utility in `utils/` or domain helper in `features/<feature>/` |
| Cross-cutting global state | Zustand store in `store/` |
| API call definitions | `services/<resource>.ts` |

**The component's job** is to receive data and callbacks as props (or from hooks), render JSX, and delegate every user action to a handler provided by a hook.

Example pattern:
```tsx
// BAD — logic inside component
function StockBadge({ quantity, min }: Props) {
  const state = quantity < 0 ? 'negative' : quantity <= min ? 'low' : 'normal'
  return <span className={stateColors[state]}>{quantity}</span>
}

// GOOD — logic in utility, component only renders
import { getStockState } from '@/utils/stock'
function StockBadge({ quantity, min }: Props) {
  const state = getStockState(quantity, min)
  return <span className={stateColors[state]}>{quantity}</span>
}
```

**Additional rules:**
- Functional components only — no class components.
- Custom hooks for all non-trivial side effects and data fetching.
- Props interfaces named `<ComponentName>Props`.
- Extract to sub-components when a file exceeds ~150 lines, but only along clear presentation boundaries.

### Naming Conventions
- **Components:** PascalCase (`StockBadge`, `ExitPreviewModal`)
- **Hooks:** camelCase prefixed with `use` (`useStockExit`, `useProductList`)
- **Stores:** camelCase prefixed with `use` + `Store` suffix (`useProductStore`)
- **Files:** kebab-case (`stock-badge.tsx`, `use-stock-exit.ts`)
- **Constants:** UPPER_SNAKE_CASE
- **Event handlers:** `handle<Event>` pattern (`handleConfirm`, `handleQuantityChange`)

### Styling
- Tailwind CSS utility classes only — no inline styles, no separate CSS files unless strictly necessary.
- Use `clsx` for conditional class merging.
- Color tokens for stock states must use the `stock.*` custom colors defined in `tailwind.config.js`, not hardcoded hex values.

### Testing
- Test files co-located with source: `<component>.test.tsx`
- Test names follow: `it('should <behavior> when <condition>')`
- Cover: rendering, user interactions, edge cases (zero, negative stock)
- Do not mock Zustand stores — use real store instances with reset in `beforeEach`

---

## Development Workflow

When implementing a new feature:
1. Define types/schemas in `features/<feature>/schemas.ts` and `types.ts`
2. Create/update Zustand store slice if global state is needed
3. Implement API service functions in `services/`
4. Build custom hook(s) encapsulating async logic and state
5. Build UI components bottom-up (primitives → composed → page)
6. Wire to router in `router/`
7. Write tests for hooks and key components

**Always show a plan and ask for confirmation before making structural or architectural changes.**

---

## Git Conventions

- Commit messages follow **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `test:`, `docs:`
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- No direct commits to `main` — use feature branches and PRs

---

## What to Avoid

- No `any` types.
- No class components.
- No inline styles.
- No business logic inside components or pages — delegate to hooks, utils, or stores.
- No raw `<dialog>`, `<select>`, or other interactive HTML elements when a Radix UI primitive exists for it.
- No hardcoded stock threshold values — make them configurable.
- Do not create abstraction layers for single-use operations.
- Do not add error handling for scenarios that cannot happen.