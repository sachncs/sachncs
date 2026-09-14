# site — Product page

A standalone product page for **Sachin — Applied AI Architect & Engineer**.
Built as a Vite + React + TypeScript SPA, styled with Tailwind, animated
with Framer Motion. Outputs a fully static build to `dist/`.

## Stack

- **Vite 5** — build & dev server
- **React 18 + TypeScript** — UI
- **Tailwind CSS 3** — design system & layout
- **Framer Motion** — refined motion / interaction
- **Lucide React** — icon set

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → ./dist
npm run preview   # preview the built site
```

## Layout

```
src/
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── Capabilities.tsx
│   ├── SelectedWork.tsx
│   ├── Process.tsx
│   ├── Engagement.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   └── Monogram.tsx
├── content/
│   └── data.ts          # copy & structured content
├── ui/
│   ├── Button.tsx
│   ├── FadeIn.tsx
│   └── Section.tsx
├── App.tsx
├── main.tsx
└── index.css            # tokens, utilities, base styles
```

All content lives in `src/content/data.ts` so the page can be edited without
touching component logic.