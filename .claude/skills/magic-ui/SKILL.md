---
name: magic-ui
description: Install and use Magic UI components in this project via the shadcn CLI. Use when the user asks to add a Magic UI component (e.g. "add the marquee from magic ui", "install magic ui's animated beam"), or wants animated/marketing UI elements (particles, globe, marquee, animated beams, text effects, dock, bento grid, etc).
---

# Magic UI

This project uses [Magic UI](https://magicui.design) components layered on top of shadcn/ui. The registry is already configured in [components.json](../../../components.json) as `@magicui`, so components install through the shadcn CLI, not a separate package.

## Installing a component

```bash
npx shadcn@latest add @magicui/<component-name>
```

Examples:
```bash
npx shadcn@latest add @magicui/marquee
npx shadcn@latest add @magicui/animated-beam
npx shadcn@latest add @magicui/bento-grid
npx shadcn@latest add @magicui/dock
```

This drops the component into `components/ui/` (per the `ui` alias in components.json) alongside regular shadcn components. Already-installed examples in this repo: `globe.tsx`, `particles.tsx`.

## Finding the right component name

Browse https://magicui.design/docs/components for the full catalog and exact slugs (they match the URL path, e.g. `https://magicui.design/docs/components/marquee` → `@magicui/marquee`). Don't guess a slug — confirm it against the docs page before running `add` if unsure.

## After installing

- Import from `@/components/ui/<component-name>` per the project's path aliases.
- Magic UI components often need Tailwind keyframes/animations already present in `app/globals.css` (e.g. for marquee, shine, orbit). If a component renders without its animation, check that the required `@keyframes`/`animate-*` utility exists in globals.css — the shadcn CLI usually injects these automatically on `add`, but verify after install.
- Some components (e.g. particles, globe) are client components (`"use client"`) — use them inside client boundaries or wrap appropriately in RSC pages.
