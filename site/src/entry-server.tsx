import { renderToString } from 'react-dom/server';
import App from './App';
import { profile, navigation } from './data/profile';
import { articles } from './components/Shared';
import { repositories } from './pages/Repositories';
export { profile, navigation, articles, repositories };
export const routes = [...navigation.map(([path]) => path), ...articles.map(a => `/writing/${a.slug}`), ...repositories.map(r => `/${r.name}`)];
const metadata: Record<string, [string, string]> = {
 '/': [`${profile.name} — ${profile.title}`, profile.bio],
 '/about-me': ['About Sachin — AI/ML Architect & Engineer', 'Learn about Sachin’s approach to AI architecture, production engineering, agents, retrieval, evaluation, enterprise AI systems, and technical leadership.'],
 '/work': ['AI Architecture & Engineering Work — Sachin', 'Selected AI architecture, production engineering, retrieval, evaluation, agent, and platform case studies by Sachin.'],
 '/repos': ['Open Source & Repositories — Sachin', 'Open-source AI, agent, retrieval, evaluation, and production engineering projects by Sachin.'],
 '/writing': ['Writing on AI Architecture & Engineering — Sachin', 'Technical writing on production AI, agents, retrieval, evaluation, distributed systems, architecture, reliability, and engineering.'],
 '/connect': ['Connect with Sachin — AI/ML Architect', 'Connect with Sachin for conversations around AI architecture, production AI, agents, retrieval, evaluation, engineering, and technical leadership.'],
};
export function render(path: string) {
 const article = articles.find(a => `/writing/${a.slug}` === path);
 const repository = repositories.find(r => `/${r.name}` === path);
 const [title, description] = metadata[path] || (article ? [`${article.title} — ${profile.name}`, article.description] : repository ? [`${repository.name} — Project by ${profile.name}`, repository.description || `Public source and project information for ${repository.name}, by ${profile.name}.`] : [`Page not found — ${profile.name}`, 'Find public engineering work, technical writing, and ways to connect.']);
 return { html: renderToString(<App path={path} />), title, description, article, repository };
}
