# Migrate from Next.js to Vite

## Goal
Replace Next.js with Vite as the build tool for michaelsteward.com. Keep React 19 + TypeScript + CSS Modules. Output remains a fully static site deployed to Cloudflare Pages.

## Motivation
The site is a single static page (one `<h1>`) with no SSR, dynamic routes, or data fetching. Next.js is overkill: heavy dependency tree, frequent CVE churn (two security patches in recent commits), and slower iteration than Vite for a project this size.

## Scope
In:
- Swap build tooling (Next → Vite) while preserving the rendered output.
- Update build/dev scripts and TypeScript config.
- Update `.gitignore` for the new build output directory.

Out:
- No visual or content changes. The rendered HTML must look the same.
- No new features, no styling refresh.
- Cloudflare Pages dashboard config (output directory) is updated manually by the user post-merge — not in code.

## Architecture

**Stack:** Vite 7 + `@vitejs/plugin-react` + React 19 + TypeScript + CSS Modules.

**Layout (Vite convention):**
```
index.html              # entry HTML, <head> + <div id="root"> + script tag
vite.config.ts          # plugins: [react()]
src/
  main.tsx              # createRoot + render <App />
  App.tsx               # the <h1> component
  globals.css           # moved from styles/
  Home.module.css       # moved from styles/
public/                 # unchanged — favicons, manifest
tsconfig.json
package.json
```

## File-by-file changes

### Add

**`index.html`** (repo root) — Replaces what `next/head` produced. Contains exactly the head tags the current `pages/index.tsx` renders, no more:
- `<meta charset="UTF-8" />` and `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` (standard boilerplate Vite includes)
- `<title>Michael Steward</title>`
- `<meta name="description" content="Homepage for Michael Steward" />`
- `<meta name="theme-color" content="#317EFB" />`
- `<link rel="icon" href="/favicon.ico" />`
- `<div id="root"></div>`
- `<script type="module" src="/src/main.tsx"></script>`

The other assets in `public/` (apple-touch-icon, android-chrome PNGs, site.webmanifest) are currently served but not linked from the head — preserve that behavior (do not add new `<link>` tags for them).

**`vite.config.ts`** — minimal:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

**`src/main.tsx`**:
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**`src/App.tsx`** — replaces `pages/index.tsx`, drops `next/head` (the head tags now live in `index.html`):
```tsx
import styles from './Home.module.css';

export default function App() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>&gt; michael steward</h1>
    </main>
  );
}
```

### Move
- `styles/globals.css` → `src/globals.css`
- `styles/Home.module.css` → `src/Home.module.css`

### Delete
- `pages/` (whole directory)
- `next.config.js`
- `next-env.d.ts`
- `styles/` (after moving the two CSS files out)
- `.next/` and `out/` directories on disk (build artifacts)

### Update

**`package.json`:**
- Remove: `next`
- Add to `dependencies`: nothing new on the React side
- Add to `devDependencies`: `vite`, `@vitejs/plugin-react`, `@types/react-dom`
- Scripts:
  - `dev`: `vite`
  - `build`: `tsc --noEmit && vite build`
  - `preview`: `vite preview`

**`tsconfig.json`:**
- `include`: drop `next-env.d.ts`, add `src`
- `target`: bump from `es5` to `es2020` (Vite requires modern target)
- Keep `jsx: react-jsx`, `module: esnext`, `moduleResolution: bundler`

**`.gitignore`:**
- Remove: `/.next/`, `/out/`
- Add: `/dist/`

## Data flow
Same as today — none. Static page rendered at build time. Vite bundles `main.tsx` + CSS into hashed assets in `dist/`, references them from `dist/index.html`.

## Cloudflare Pages
No code change needed. After merging, the user updates the CF Pages dashboard:
- **Build command:** `npm run build` (unchanged)
- **Build output directory:** `out` → `dist`

This step is called out in the PR description for the user to action; it does not block the migration locally.

## Verification

1. `npm install` succeeds with no `next` in lockfile.
2. `npm run dev` — page loads at the Vite dev URL, shows `> michael steward`, favicon visible in tab, no console errors.
3. `npm run build` — TypeScript passes, Vite produces `dist/index.html` + hashed JS/CSS assets, favicons + manifest copied from `public/`.
4. `npm run preview` — built site renders identically to current `out/index.html` (visually compare in browser).
5. View-source check on built `dist/index.html`: `<title>`, meta description, theme-color, and favicon link are all present.

## Out-of-scope follow-ups
- Cloudflare Pages dashboard output directory change (manual, user does it).
- Future cleanup of unused CSS in `Home.module.css` (it has `.container`, `.footer`, `.description`, `.grid` rules unused by the current single-`<h1>` page) — leave as-is for this migration; that's a separate task.
