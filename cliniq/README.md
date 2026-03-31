# ClinIQ Monorepo

This is the Turborepo monorepo for ClinIQ.

## Structure

- `apps/web` — Next.js 14 App Router frontend
- `apps/api` — NestJS 10 backend
- `packages/shared-types` — shared Zod schemas and TypeScript types
- `packages/ui` — shared React UI library (Tailwind + shadcn/ui)
- `packages/config` — shared ESLint, Prettier, Tailwind configs

## Scripts

- `npm run dev` — run all dev servers via Turborepo
- `npm run build` — build all apps and packages
- `npm run lint` — run lint across the monorepo
- `npm run test` — run tests across the monorepo
- `npm run format` — format code with Prettier

