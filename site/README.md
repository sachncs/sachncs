# Personal website

The canonical site is **<https://sachncs.github.io/>**. It publishes from
`sachncs/sachncs.github.io`, not the profile repository’s `/sachncs/` Pages URL.
The root README remains the GitHub profile. The `site/` directory contains the
React, TypeScript, Vite, and Tailwind application.

## Develop and verify

Use Node.js 22.12 or newer.

```sh
cd site
npm ci
npm run dev
npm run check
npm run preview
```

`check` compiles Markdown, type-checks the application, builds browser and server
bundles, renders every route to HTML, and verifies headings, metadata, internal
links, anchors, assets, content gates, sitemap, and RSS. A normal build requires no
GitHub API access. The browser hydrates the rendered HTML for the mobile menu and
repository filters. Navigation uses native links; no client-side router is needed.

Every supported URL has its own `index.html`, including article and repository
routes. GitHub Pages can serve direct requests and refreshes without a hash router
or a 404-to-SPA redirect. Unknown paths receive an actual 404 page. Assets use
absolute root paths. Existing independently deployed project sites retain their
`/<repo_name>` URLs and remain owned by their respective repositories.

## Content

- `src/data/profile.ts`: identity, location, contact links, and social settings.
- `content/about.md`: the detailed professional profile.
- `content/writing/*.md`: articles with YAML frontmatter.
- `src/data/projects.ts`: source-backed case studies and technical analysis.
- `src/data/repositories.json`: committed public GitHub metadata snapshot.
- `src/generated/content.json`: generated editorial content; do not edit manually.

Articles require `title`, `description`, `date`, `tags`, `featured`, `draft`, and
`canonical`. Optional fields include `updated` and `repositories`. The filename is
the slug. Use `/writing/<slug>` for its canonical URL. Dates should be ISO dates
quoted in YAML. Drafts and future-dated posts are excluded from pages, indexes,
sitemap, and RSS. Begin article content with prose or an h2; the layout supplies h1.
Raw HTML is intentionally disallowed. Restart `npm run dev` after editing Markdown,
or run the build, to regenerate editorial content.

```yaml
---
title: A concrete technical argument
description: The engineering question this article examines.
date: '2026-09-21'
tags: [Architecture]
featured: false
draft: true
canonical: https://sachncs.github.io/writing/a-concrete-technical-argument
repositories: [agent-guard]
---
```

Refresh repository metadata explicitly, review its diff, and commit the result:

```sh
npm run refresh:repos
```

If GitHub is unavailable, this command fails without replacing the cache. Normal
rendering does not call the GitHub API. Descriptions and language come from the
public API; categories are discovery aids inferred from descriptions and topics.
No stars or last-updated statistics are presented as live data. The retrieval date
is displayed. Do not equate repository claims with independently measured impact.

## Publishing

`.github/workflows/deploy.yml` builds and verifies on `main`. Its deployment jobs
run **only** in `sachncs/sachncs.github.io`. Pages must use GitHub Actions as its
source. The guard prevents this site from being deployed under `/sachncs/`.

The profile and publication repositories contain the same site source at the
initial release. Future website changes should be committed to the canonical
publication repository. When editing this profile checkout, push the reviewed
commit to its `pages` remote as well as `origin` to update both copies. Never
force-push either repository to synchronize them.

Generated files include `sitemap.xml`, `robots.txt`, `feed.xml`, per-page canonical,
Open Graph, Twitter, and JSON-LD metadata. There are no analytics, forms, or runtime
external API dependencies. The only runtime JavaScript dependency is React.

The social preview and Apple icon are typography-based assets. To regenerate them
after changing profile information, build first, then run:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/social-preview.mjs
npm run build
```

Playwright is a verification/rendering tool, not a production dependency. The
canonical domain must remain root-based in configuration, metadata, and assets.
