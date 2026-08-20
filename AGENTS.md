# Blog Personal FE — Agent Guide

## Quick start

```sh
yarn install       # dependencies (yarn, not npm/pnpm)
yarn dev           # dev server at http://localhost:3000
yarn build         # production build
yarn start         # production server
yarn lint          # next lint (ESLint 9 flat config)
```

No typecheck or test scripts are configured.

## Architecture

- **Next.js 15 App Router** with `[locale]` prefix for i18n.
- **i18n**: `next-intl`, locales `["en", "vi"]`, default `"vi"`. Messages in `messages/{locale}.json`. Import navigation wrappers from `@/i18n/navigation` (not `next/link` / `next/navigation`).
- **Auth**: Clerk (`@clerk/nextjs` v6). Login/register use `<SignIn>` / `<SignUp>` components. Admin check: `user?.publicMetadata?.role === "admin"`.
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` in globals.css, not `@tailwind` directives). Dark mode via `class` strategy.
- **State**: Zustand (`store/`), TanStack Query (`app/[locale]/providers.tsx`), SWR (`api/useswr/`). All three are used — check which one a file already imports before adding more.
- **API**: Backend at `NEXT_PUBLIC_API_URL`. Socket server at `NEXT_PUBLIC_SOCKET_URL` (separate process).
- **Editor**: TipTap (`components/Editor/`) and React Quill (`components/cms/post/`) both exist. Match the existing pattern when working on a page.
- **Image upload**: ImageKit. Auth endpoint at `api/upload-auth/route.ts`.

## Project structure

```
app/[locale]/       # all routes are locale-scoped
├── cms/            # admin/personal dashboard (sidebar layout)
├── posts/[id]/     # post detail
├── write/          # create post
├── login/          # Clerk SignIn
├── register/       # Clerk SignUp
├── user/[id]/      # user profile
├── search/         # search page
├── notifications/  # notifications page
├── about/          # static about page
└── info/           # static info page
api/                # Next.js API routes (excluded from i18n middleware)
components/
├── cms/            # CMS-specific components (post/, user/, category/)
├── Editor/         # TipTap editor
└── ...             # shared UI components
interface/          # TypeScript types (Post, User, Category, Comment, etc.)
lib/utils.ts        # cn() helper
store/              # Zustand stores
hooks/              # useTheme, useNotificationSocket
messages/           # i18n JSON files
```

## Key conventions

- **Path alias**: `@/*` maps to project root (e.g. `@/components/NavBar`, `@/i18n/routing`).
- **Params are async**: Next.js 15 dynamic `params` is `Promise<{ locale: string }>` — always `await` it.
- **ESLint**: Flat config (`eslint.config.mjs`). Rules: `@typescript-eslint/no-unused-vars: warn` (prefix unused with `_`), `@typescript-eslint/no-explicit-any: warn`.
- **SWR fetchers** are in `api/useswr/index.ts`: `fetcherUseSWR` (public), `fetcherWithTokenUseSWR` (auth'd with Bearer token).
- **Socket notifications**: `useNotificationSocket` hook in `hooks/`, connects via WebSocket transport to the socket server. Events: `new-comment`, `new-like`, `new-post`, `new-follow`.

## Environment

Required vars (see `.env`):
- `NEXT_PUBLIC_API_URL` — backend REST API base
- `NEXT_PUBLIC_SOCKET_URL` — Socket.io server
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` — ImageKit endpoint
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — Clerk auth
- `IMAGEKIT_PRIVATE_KEY` / `NEXT_IMAGEKIT_PUBLIC_KEY` — ImageKit server-side auth
