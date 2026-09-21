import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { marked } from 'marked';

const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function compile(source) {
  const headings = [];
  const used = new Set();
  const renderer = new marked.Renderer();
  renderer.html = () => { throw new Error('Raw HTML is not supported in editorial Markdown.'); };
  renderer.heading = function ({ tokens, depth, text }) {
    if (depth === 1) throw new Error('Use the page title as h1; Markdown starts at h2.');
    const base = slugify(text);
    let id = base, i = 2;
    while (used.has(id)) id = `${base}-${i++}`;
    used.add(id);
    if (depth === 2) headings.push({ id, title: text });
    return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
  };
  renderer.link = function ({ href, tokens }) {
    if (!/^(https?:\/\/|mailto:|\/|#)/.test(href) || href.startsWith('//')) throw new Error(`Invalid editorial link ${href}`);
    return `<a href="${href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">${this.parser.parseInline(tokens)}</a>`;
  };
  return { html: marked.parse(source, { renderer }), headings, readingTime: Math.max(1, Math.ceil(source.split(/\s+/).length / 220)) };
}
const articles = [];
for (const name of (await readdir('content/writing')).filter(n => n.endsWith('.md'))) {
  const { data, content } = matter(await readFile(`content/writing/${name}`, 'utf8'));
  const slug = name.slice(0, -3);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug ${slug}`);
  for (const key of ['title', 'description', 'date', 'tags', 'featured', 'draft', 'canonical']) {
    if (!(key in data)) throw new Error(`${name}: missing ${key}`);
  }
  if (typeof data.draft !== 'boolean' || typeof data.featured !== 'boolean') throw new Error(`${name}: invalid flags`);
  if (!Array.isArray(data.tags) || !data.tags.length || !data.tags.every(t => typeof t === 'string')) throw new Error(`${name}: invalid tags`);
  const date = new Date(data.date);
  if (Number.isNaN(date.valueOf())) throw new Error(`${name}: invalid date`);
  if (data.canonical !== `https://sachncs.github.io/writing/${slug}`) throw new Error(`${name}: invalid canonical`);
  if (data.draft || date > new Date()) continue;
  articles.push({ ...data, date: date.toISOString().slice(0, 10), updated: data.updated ? new Date(data.updated).toISOString().slice(0, 10) : null, slug, ...compile(content) });
}
articles.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
await mkdir('src/generated', { recursive: true });
await writeFile('src/generated/content.json', JSON.stringify({ about: compile(await readFile('content/about.md', 'utf8')), articles }, null, 2) + '\n');
console.log(`Compiled About and ${articles.length} published articles.`);
