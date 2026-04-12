# AGENTS.md

## Project snapshot
- Angular 21 app in `src/` with SSR enabled (`src/main.server.ts`, `src/server.ts`).
- The root shell in `src/app/app.ts` provides the root layout via `app.html`, rendering `<router-outlet />` alongside global shell components like `<z-toaster />`.
- Routes are lazy-loaded standalone components in `src/app/app.routes.ts` (`login`, `register`, `dashboard`, `interns`, `interns/new`, `interns/:id`). Dashboard and intern routes are wrapped by `src/app/layouts/main/main-layout.component.ts`.

## Architecture to follow
- Use the feature-sliced layout already in place: `features/<domain>/{domain,data,application,presentation}`.
- For auth, the flow is `presentation` component -> `application/AuthUseCase` -> `domain/AuthRepository` -> `data/AuthApiService`.
- The API base URL comes from `.env` (using `BASE_API_URL`). The node script `scripts/set-env.js` auto-generates `environment.ts` and `environment.prod.ts` providing `publicApi` and `privateApi` via npm `prestart`/`prebuild`/`prewatch` hooks.
- If you add server routes or prerender behavior, update `src/app/app.routes.server.ts` and `src/server.ts` together.

## Shared UI conventions
- Reuse shared primitives from `src/app/shared/components/*` instead of ad hoc UI code.
- Public imports come from the local `index.ts` files under `button/`, `calendar/`, `card/`, `date-picker/`, `dialog/`, `input/`, `popover/`, `select/`, `toast/`, and `shared/core`.
- Components/directives use `z-*` selectors: `z-button`, `z-calendar`, `z-card`, `z-date-picker`, `z-dialog`, `z-input`, `z-popover` (or `[zPopover]`), `z-select`, `z-toaster`, `zardId`, `zStringTemplateOutlet`.
- Icons are managed natively via `@ng-icons/core` and `@ng-icons/lucide`.
- Variants are defined with `class-variance-authority` and class concatenation goes through `mergeClasses()` in `src/app/shared/utils/merge-classes.ts`.

## Styling and tokens
- Global styling is Tailwind v4 in `src/styles.scss`, not a separate Tailwind config file.
- Theme colors are CSS variables exposed through `@theme inline`; dark mode is class-based (`.dark`).
- Preserve the existing `@source "../app/**/*.ts"` and `@source "../app/**/*.html"` scanning paths when adding UI.

## TypeScript / Angular patterns
- Path alias `@/*` maps to `src/app/*`; `components.json` also expects `@/shared/components`, `@/shared/utils`, `@/shared/core`, and `@/shared/services`.
- Standalone components/directives are the norm; keep imports explicit in each component.
- Forms are reactive and use Angular signals for local UI state (see `login.component.ts` and `register.component.ts`).

## Developer workflows
- `npm start` / `ng serve` for local dev.
- `npm run build` for production bundles; `npm run watch` for incremental build output.
- `npm test` runs the Vitest-based Angular unit test target.
- `npm run serve:ssr:intern-fe` serves the built SSR app from `dist/intern-fe/server/server.mjs`.

## Useful references
- App bootstrap: `src/main.ts`, `src/app/app.config.ts`
- SSR bootstrap: `src/main.server.ts`, `src/app/app.config.server.ts`
- Shared exports: `src/app/shared/**/index.ts`
- Example feature slice: `src/app/features/auth/**`
