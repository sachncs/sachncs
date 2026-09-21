// Explicit refresh; normal builds use the committed snapshot and need no network.
import { writeFile } from 'node:fs/promises';
const repositories = [];
for (let page = 1; ; page++) {
 const response = await fetch(`https://api.github.com/users/sachncs/repos?per_page=100&page=${page}`, { headers: { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) } });
 if (!response.ok) throw new Error(`GitHub returned ${response.status}; existing cache retained.`);
 const entries = await response.json();
 for (const r of entries) repositories.push(Object.fromEntries(['name', 'description', 'language', 'html_url', 'homepage', 'updated_at', 'topics', 'fork', 'archived', 'default_branch', 'has_pages'].map(k => [k, r[k]])));
 if (entries.length < 100) break;
}
if (!repositories.length) throw new Error('Empty repository response; existing cache retained.');
repositories.sort((a, b) => a.name.localeCompare(b.name));
await writeFile('src/data/repositories.json', JSON.stringify({ retrievedAt: new Date().toISOString().slice(0, 10), repositories }, null, 2) + '\n');
console.log(`Cached ${repositories.length} public repositories.`);
