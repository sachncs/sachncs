# Sachin

I am a senior machine learning engineer and applied AI architect. I design,
architect, and implement frontier AI systems end to end; the code is at
[github.com/sachncs](https://github.com/sachncs). I take research-stage ideas
from use-case discovery through prototyping, evaluation, and sustained production
adoption, delivering safe, reliable systems with measurable business outcomes
for enterprises.

I work equally well as a senior technical advisor to CTO, CIO, and CISO
stakeholders and as a hands-on engineer writing code, building evaluation
harnesses, and resolving complex integrations. My work spans models, agents,
retrieval, data pipelines, and scalable ML infrastructure, with architecture
decisions grounded in reliability, latency, cost, security, privacy, and governance.
I collaborate with research and product teams to turn emerging capabilities into
production features, build reusable tools and deployment patterns, and help
engineering teams adopt and operate the systems they ship.

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
