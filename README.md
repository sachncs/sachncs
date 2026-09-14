# sachncs / site

This repository hosts my product page and open-source work.

The product page is a **standalone React site** that lives entirely under
[`site/`](./site). It is built with Vite + TypeScript + Tailwind, deployed
to GitHub Pages via the workflow in
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

> **Live site:** <https://sachncs.github.io/sachncs/>
>
> If you set up `sachncs.github.io` as the user-site repo and point it here,
> it serves at the root URL.

---

## Develop the site

```bash
cd site
npm install
npm run dev       # local dev server on http://localhost:5173
npm run build     # production build -> site/dist
npm run preview   # preview the production build
```

The site uses relative asset paths (`base: './'`) so the same build serves
cleanly at any subpath — project page, user page, or a custom domain.

---

## Deploy

GitHub Pages is configured to deploy from the `Deploy site to GitHub Pages`
workflow (`.github/workflows/deploy.yml`). On every push to `main` it:

1. Installs dependencies in `site/`
2. Runs `npm run build` → `site/dist`
3. Publishes the artifact to GitHub Pages

To activate: **Settings → Pages → Source → GitHub Actions**.

---

## Project structure

```text
.
├── site/                   # The product page (standalone React app)
│   ├── public/             # Static assets (favicon, OG image)
│   ├── src/
│   │   ├── components/     # Page sections
│   │   ├── content/        # Static content + copy
│   │   ├── ui/             # Reusable UI primitives
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.ts
└── .github/workflows/
    ├── ci.yml              # Markdown lint + link check
    └── deploy.yml          # Build & deploy site -> GitHub Pages
```

---

## Selected work

| Project | Demonstrates | Stack |
| --- | --- | --- |
| [promptsheon](https://github.com/sachncs/promptsheon) | Git-native, versioned infra for agent configs | TypeScript |
| [agent-passport](https://github.com/sachncs/agent-passport) | Identity and provenance for production AI agents | Python |
| [agent-guard](https://github.com/sachncs/agent-guard) | Reliability and safety controls for deployed agents | Rust |
| [delta-search](https://github.com/sachncs/delta-search) | Retrieval over changing corpora — 50k QPS, p99 < 800ms | Go |
| [underwrite](https://github.com/sachncs/underwrite) | Decision systems on production data pipelines | Python |
| [fleetpilot](https://github.com/sachncs/fleetpilot) | Distributed event-driven backends | Go |

Browse the [full public repositories list](https://github.com/sachncs?tab=repositories).

---

## Contact

- ✉️ **Email** — [sachncs@gmail.com](mailto:sachncs@gmail.com)
- 💼 **LinkedIn** — [linkedin.com/in/sachncs](https://www.linkedin.com/in/sachncs)
- 🐙 **GitHub** — [@sachncs](https://github.com/sachncs)

If what you've read resonates, [start one](https://sachncs.github.io/sachncs/#engage).
