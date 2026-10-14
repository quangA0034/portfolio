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

## Put it on GitHub Pages

GitHub Pages can only host the **built** site, not the source files. Uploading this project as it is gives a blank page, because the browser can't run `src/main.tsx`.

**Option A (automatic, recommended)**
1. Push this whole project to a GitHub repository, with the branch named `main`.
2. In the repository go to **Settings → Pages**, and under **Source** choose **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it on every push. Check the **Actions** tab for progress. The address is shown in **Settings → Pages**.

**Option B (manual)**
1. Run `npm install` and `npm run build` on your computer.
2. Upload the *contents* of the new `dist/` folder (not the folder itself) to your Pages repository, so `index.html` sits at the top level.
3. In **Settings → Pages**, publish from the branch you uploaded to.

`vite.config.ts` sets `base: './'`, so the site works both at `username.github.io` and at `username.github.io/repository-name/`.
