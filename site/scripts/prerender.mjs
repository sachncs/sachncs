import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { render, routes, profile, articles, repositories } from '../.ssr/entry-server.js';
const template = await readFile('dist/index.html', 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const absolute = path => `${profile.url}${path}`;
const person = { '@type': 'Person', '@id': absolute('/#person'), name: profile.name, jobTitle: profile.title, url: absolute('/about-me'), email: `mailto:${profile.email}`, sameAs: [profile.github, profile.linkedin], homeLocation: { '@type': 'Place', name: profile.location } };
const site = { '@type': 'WebSite', '@id': absolute('/#website'), url: absolute('/'), name: `${profile.name} — ${profile.title}`, publisher: { '@id': person['@id'] } };
for (const path of [...routes, '/404']) {
 const { html, title, description, article, repository } = render(path);
 const canonical = absolute(path);
 const graph = [person, site];
 graph.push({ '@type': path === '/about-me' ? 'ProfilePage' : article ? 'Article' : 'WebPage', '@id': `${canonical}#page`, url: canonical, name: title, description, isPartOf: { '@id': site['@id'] }, ...(path === '/about-me' ? { mainEntity: { '@id': person['@id'] } } : {}), ...(article ? { headline: article.title, datePublished: article.date, dateModified: article.updated || article.date, author: { '@id': person['@id'] }, image: absolute(profile.socialImage), mainEntityOfPage: canonical, keywords: article.tags.join(', ') } : {}) });
 if (path !== '/') {
   const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: absolute('/') }];
   if (article || repository) crumbs.push({ '@type': 'ListItem', position: 2, name: article ? 'Writing' : 'Repositories', item: absolute(article ? '/writing' : '/repos') });
   crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: article?.title || repository?.name || title.split(' — ')[0], item: canonical });
   graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs });
 }
 const head = `<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:type" content="${article ? 'article' : 'website'}" />
<meta property="og:site_name" content="${escape(profile.name)}" />
<meta property="og:title" content="${escape(title)}" />
<meta property="og:description" content="${escape(description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:image" content="${absolute(profile.socialImage)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${escape(profile.name)} — ${escape(profile.title)}. Production AI, agents, retrieval, evaluation, architecture." />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="twitter:description" content="${escape(description)}" />
<meta name="twitter:image" content="${absolute(profile.socialImage)}" />
<meta name="twitter:image:alt" content="${escape(profile.name)} — ${escape(profile.title)}" />
${article ? `<meta property="article:published_time" content="${article.date}" /><meta property="article:author" content="${absolute('/about-me')}" />` : ''}
${path === '/404' ? '<meta name="robots" content="noindex, follow" />' : ''}
<link rel="alternate" type="application/rss+xml" title="${escape(profile.name)} — Writing" href="${absolute('/feed.xml')}" />
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`;
 const output = template.replace(/<title>.*?<\/title>/, '').replace(/(?:src|href)="\.\/assets\//g, 'src="/assets/').replace(/href="\.\/(favicon|apple-touch-icon)/g, 'href="/$1').replace('<!--page-head-->', head).replace('<!--page-html-->', html);
 const filename = path === '/404' ? 'dist/404.html' : path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
 await mkdir(dirname(filename), { recursive: true });
 await writeFile(filename, output);
}
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path => `<url><loc>${escape(absolute(path))}</loc></url>`).join('')}</urlset>\n`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`);
await writeFile('dist/feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(profile.name)} — Writing</title><link>${absolute('/writing')}</link><description>Technical writing on AI architecture and engineering.</description><language>en</language><atom:link href="${absolute('/feed.xml')}" rel="self" type="application/rss+xml"/>${articles.map(a => `<item><title>${escape(a.title)}</title><link>${a.canonical}</link><guid isPermaLink="true">${a.canonical}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${escape(a.description)}</description>${a.tags.map(tag => `<category>${escape(tag)}</category>`).join('')}</item>`).join('')}</channel></rss>\n`);
await writeFile('dist/.nojekyll', '');
console.log(`Prerendered ${routes.length} pages, 404, sitemap, robots, and RSS.`);
