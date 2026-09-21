import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { routes, profile, articles } from '../.ssr/entry-server.js';
const files = new Set(routes.map(p => p === '/' ? '/' : p));
const titles = new Set();
for (const path of [...routes, '/404']) {
 const name = path === '/404' ? 'dist/404.html' : path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
 const html = await readFile(name, 'utf8');
 assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one h1`);
 const title = html.match(/<title>(.*?)<\/title>/)?.[1];
 assert(title && !titles.has(title), `${path}: unique title`); titles.add(title);
 assert(html.includes(`rel="canonical" href="${profile.url}${path}"`), `${path}: canonical`);
 assert(html.includes('application/ld+json'), `${path}: structured data`);
 assert(html.includes('property="og:image" content="https://sachncs.github.io/social-preview.png"'), `${path}: absolute social image`);
 assert(html.includes('id="main-content"'), `${path}: main content`);
 assert(!html.includes('href="#"'), `${path}: no dead links`);
 assert(!html.includes('/repo/') && !html.includes('/repos/'), `${path}: no nested repository routes`);
 assert(!/50k|800ms|70%|five internal teams|two enterprise rollouts|most popular|book a consultation/i.test(html), `${path}: unsupported old claims`);
 const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
 for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
   if (href.startsWith('#')) assert(ids.has(href.slice(1)), `${path}: missing anchor ${href}`);
   if (!href.startsWith('/') || href.startsWith('//')) continue;
   const [target, fragment] = href.split('#');
   if (/\.[a-z]+$/.test(target)) { await access(`dist${target}`); continue; }
   assert(files.has(target), `${path}: missing route ${target}`);
   if (fragment) {
     const targetHtml = await readFile(target === '/' ? 'dist/index.html' : `dist${target}/index.html`, 'utf8');
     assert(targetHtml.includes(`id="${fragment}"`), `${path}: missing cross-page anchor ${href}`);
   }
 }
 for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) await access(`dist${asset}`);
}
assert(articles.length >= 2, 'Substantial published writing');
assert(articles.every(a => a.html.split(/\s+/).length >= 800), 'No placeholder articles');
const about = JSON.parse(await readFile('src/generated/content.json', 'utf8')).about;
assert(about.readingTime >= 5 && about.readingTime <= 8, 'About reading time');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const route of routes) assert(sitemap.includes(`<loc>${profile.url}${route}</loc>`));
for (const forbidden of ['/resume', '/now', '/resources', '/search', '/notes', '/talks', '/architecture', '/ai-agents', '/rag', '/evaluation', '/platforms']) assert(!routes.includes(forbidden));
const feed = await readFile('dist/feed.xml', 'utf8');
for (const article of articles) assert(feed.includes(article.canonical));
console.log(`Verified ${routes.length} static routes: metadata, headings, assets, internal links, anchors, content, sitemap and RSS.`);
