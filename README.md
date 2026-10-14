# Portfolio

A single-page portfolio built with **Vite + React 19 + TypeScript + Tailwind CSS v4**.

## Run it

```bash
pnpm install     # or: npm install
pnpm dev         # or: npm run dev      -> http://localhost:5173
pnpm build       # or: npm run build    -> production files in dist/
pnpm preview     # or: npm run preview  -> serve the built site locally
```

Needs Node 20 or newer.

## Where things live

| What | Where |
| --- | --- |
| Page layout and the site text (hero, About, Capabilities, Contact, footer) | `src/App.tsx` |
| All projects: cards, case-study sections, pictures | `src/data/projects.ts` |
| Pictures used by the projects | `src/assets/projects/` |
| Vietnamese translations (the English text is the key) | `src/data/vi.ts` |
| ENG / VIE switch logic | `src/i18n.tsx` |
| Colours, fonts and base styles | `src/index.css` |
| Page title, description, Google Fonts link | `index.html` |
| Favicon | `public/favicon.svg` |

To add or change a Vietnamese line, find the English sentence in `src/data/vi.ts` and edit the text on the right.
