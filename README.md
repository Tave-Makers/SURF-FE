# SURF-FE

pnpm workspace + Turborepo monorepo for SURF frontends.

## Apps

- `apps/web`: Next.js user-facing web app
- `apps/admin`: Next.js admin app
- `apps/mobile`: Expo-based React Native app

## Mobile

`apps/mobile` reuses the shared workspace configuration:

- ESLint: `@surf/eslint-config/expo`
- TypeScript: `expo/tsconfig.base` + `@surf/typescript-config/base.json`
- Prettier: root `prettier.config.mjs`

Common commands:

```bash
pnpm install
pnpm dev:mobile
pnpm android:mobile
pnpm ios:mobile
pnpm web:mobile
pnpm lint:mobile
pnpm check-types:mobile
```
