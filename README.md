# Blog Personal FE

Frontend for a personal blogging platform with a CMS/admin dashboard, built with Next.js 15 (App Router).

## Tech stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **i18n**: next-intl — locales `en` / `vi` (default `vi`)
- **Auth**: Clerk (`@clerk/nextjs`)
- **Styling**: Tailwind CSS v4, `next-themes` for dark mode
- **UI**: Ant Design, Radix UI, Framer Motion, Lucide/React Icons
- **State**: Zustand, TanStack Query, SWR (all three are in use depending on the feature)
- **Editors**: TipTap and React Quill (both exist, used in different flows)
- **Realtime**: Socket.io client (notifications)
- **Image upload**: ImageKit

## Getting started

This project uses **yarn** (not npm/pnpm).

```bash
yarn install       # install dependencies
yarn dev           # start dev server at http://localhost:3000
yarn build         # production build
yarn start         # run production build
yarn lint          # run ESLint
```

No typecheck or test scripts are configured.

## Environment variables

Create a `.env` with:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` / `NEXT_IMAGEKIT_PUBLIC_KEY` | ImageKit public keys |
| `NEXT_IMAGEKIT_PRIVATE_KEY` | ImageKit server-side auth |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth |

## Project structure

```text
app/[locale]/         # all routes are locale-scoped (next-intl)
├── cms/              # admin/personal dashboard (sidebar layout)
│   ├── personal/     # personal dashboard
│   ├── posts/        # manage posts
│   ├── edit/         # edit post / category
│   ├── save-post/    # create/save post
│   ├── post-schedule/
│   ├── category/
│   ├── tag/
│   ├── user/
│   └── settings/
├── posts/[id]/       # public post detail page
├── write/            # create post (public-facing entry)
├── user/[id]/        # user profile
├── search/           # search page
├── notifications/    # notifications page
├── login/            # Clerk SignIn
├── register/         # Clerk SignUp
├── about/             # static about page
└── info/             # static info page

api/                  # Next.js API routes (excluded from i18n middleware)
├── useswr/           # SWR fetchers (fetcherUseSWR, fetcherWithTokenUseSWR)
└── upload-auth/      # ImageKit upload auth endpoint

components/
├── cms/              # CMS-specific components (post/, user/, category/)
├── Editor/           # TipTap editor
└── ...               # shared UI components

interface/            # shared TypeScript types (Post, User, Category, Comment, Tag, Notification, ...)
lib/utils.ts          # cn() class-name helper
store/                # Zustand stores
hooks/                # useTheme, useNotificationSocket
i18n/                 # next-intl navigation/routing/request config
messages/             # i18n JSON files (en.json, vi.json)
public/               # static assets
```

## Key conventions

- **Path alias**: `@/*` maps to the project root (e.g. `@/components/NavBar`, `@/i18n/routing`).
- **i18n navigation**: use the wrappers from `@/i18n/navigation` instead of `next/link` / `next/navigation`.
- **Async params**: Next.js 15 dynamic `params` are `Promise<{ locale: string }>` — always `await` them.
- **Auth check**: admin/CMS access is gated by `user?.publicMetadata?.role === "admin"`.
- **Styling**: Tailwind v4 uses `@import "tailwindcss"` in `globals.css` (not the old `@tailwind` directives). Dark mode uses the `class` strategy.
- **State management**: check which of Zustand / TanStack Query / SWR a file already uses before introducing another.
- **Socket notifications**: `useNotificationSocket` (in `hooks/`) listens for `new-comment`, `new-like`, `new-post`, `new-follow`.
- **ESLint**: flat config (`eslint.config.mjs`); unused vars should be prefixed with `_`; `no-explicit-any` is a warning, not an error.

## More details

See [AGENTS.md](AGENTS.md) for a deeper architecture reference intended for AI coding agents working in this repo.
