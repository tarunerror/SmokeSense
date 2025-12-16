# Mobile Scaffold (Expo + React Native + TypeScript)

This repository contains a **cross‑platform Expo React Native app** scaffolded for long‑term iteration.

Goals of this foundation:

- Clean, scalable **`src/`** structure.
- **React Navigation** with a root stack and bottom tabs.
- A small, opinionated **design system** (tokens + themes + primitives) that supports a _minimal, supportive, non‑shaming_ aesthetic.
- **State management** via Zustand.
- An **offline‑first data layer** using Expo SQLite + Drizzle, with SecureStore for encrypted/secured keys.
- Linting/formatting + Jest/React Native Testing Library test harness.

## Quick start

```bash
npm install
npm run start
```

## Scripts

- `npm run start` – start Expo dev server
- `npm run ios` / `npm run android` / `npm run web`
- `npm run typecheck` – TypeScript checks
- `npm run lint` – ESLint
- `npm run format` – Prettier
- `npm run test` – Jest + React Native Testing Library
- `npm run ci` – convenience script for CI runners (`typecheck + lint + test`)

## Source layout

```text
src/
  app/
    AppRoot.tsx                 # top-level providers + navigation
    navigation/                 # stack + tabs
  components/
    ui/                         # reusable primitives (Button, Card, Meter, Text)
  design-system/
    theme.ts                    # tokens + light/dark themes
    typography.ts               # type scale
    spacing.ts                  # spacing scale
    ThemeProvider.tsx           # theme context + hook
  screens/                      # route screens
  services/
    db/                         # SQLite + Drizzle + repositories
    secure/                     # SecureStore wrappers (key material)
  store/                        # Zustand stores
```

## Navigation

- `RootNavigator` (native stack)
  - `MainTabs` (bottom tabs)
    - `Logging` (stack)
    - `Insights` (stack)
    - `Guidance` (stack)
    - `Settings` (stack)

This gives a predictable pattern for adding flows later:

- Root-level modals / onboarding can live in the root stack.
- Each tab can grow its own stack without coupling unrelated routes.

## Design system

The design system is intentionally small:

- **Tokens** live in `src/design-system/theme.ts`.
- **Light/Dark** themes are supported via `ThemeProvider`.
- **Typography scale** and **spacing scale** are centralized.
- UI primitives in `src/components/ui/` consume tokens via `useTheme()`.

Design principles:

- Minimal surfaces and gentle contrast.
- Color usage is semantic (primary/supportive/warning/danger) rather than brand-heavy.
- UI copy should avoid blame (e.g. “Try again” > “You failed”).

## State management (Zustand)

Global state is kept small and explicit in `src/store/`.

Current example:

- `themeMode`: `system | light | dark`

Add new stores when:

- state must be shared across many routes/components
- state is not a pure server/cache concern

## Offline-first data layer (SQLite + Drizzle + repositories)

The app uses:

- **Expo SQLite** for local persistence
- **Drizzle ORM** for typed schema + queries
- a **repository pattern** to keep reads/writes typed and swappable

Key modules:

- `src/services/db/schema.ts` – typed table definitions
- `src/services/db/client.ts` – SQLite open + migrations
- `src/services/db/repositories/*` – typed repositories (the integration point for future AI features)

### Secure key material

`expo-secure-store` is used to store key material (`getOrCreateDbKey`).

Note: Expo SQLite itself is not encrypted by default; the SecureStore key is stored now so we can later:

- derive encryption keys for an encrypted DB
- sign/verify local records
- protect user-specific secrets used by on-device AI modules

## Testing

Jest is configured via `jest-expo`.

- Tests live in `__tests__/`.
- Use React Native Testing Library for UI behavior tests.

## Adding future AI modules

When adding AI features, prefer integrating through repositories and typed boundaries:

- Keep LLM/agent logic in a separate `services/` module.
- Depend on repository interfaces rather than querying SQLite directly.
- Avoid UI components importing low-level database APIs.

This keeps the app testable and makes it easier to swap implementations (local-only, sync-to-cloud, mock for tests, etc.).
