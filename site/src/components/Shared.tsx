import { profile } from '../data/profile';
import { SocialLinks } from './layout/Footer';
import content from '../generated/content.json';
export const articles = content.articles;
export type Article = typeof articles[number];
export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div className="intro-copy">{children}</div></div>;
}
export function SectionHead({ number, label, title, href, link }: { number: string; label: string; title: string; href?: string; link?: string }) {
  return <div className="section-head"><div><p className="eyebrow"><span>{number} /</span> {label}</p><h2>{title}</h2></div>{href && <a className="text-link" href={href}>{link} <span aria-hidden="true">↗</span></a>}</div>;
}
export function ArticleList({ limit }: { limit?: number }) {
  return <div className="article-list">{articles.slice(0, limit).map(article => <article className="article-row" key={article.slug}><div className="article-meta"><span>{article.tags[0]}</span><time dateTime={article.date}>{formatDate(article.date)}</time><span>{article.readingTime} min read</span></div><div><h2><a href={`/writing/${article.slug}`}>{article.title}<span aria-hidden="true"> ↗</span></a></h2><p>{article.description}</p></div></article>)}</div>;
}
export function formatDate(date: string) { return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date)); }
export function ConnectPreview() {
  return <section className="connect-preview"><div><p className="eyebrow">A GOOD CONVERSATION STARTS SOMEWHERE</p><h2>Let’s connect<span className="accent">.</span></h2><p>Working on a difficult AI or engineering problem? Hiring for a senior architecture role? Or simply interested in exchanging ideas?</p><a className="text-link" href="/connect">I’d like to hear from you <span aria-hidden="true">↗</span></a></div><div className="connect-side"><span className="mono">{profile.location}</span><SocialLinks /></div></section>;
}
export function TableOfContents({ headings }: { headings: { id: string; title: string }[] }) {
  return <aside className="contents"><nav aria-label="On this page"><p className="eyebrow">ON THIS PAGE</p>{headings.map(h => <a href={`#${h.id}`} key={h.id}>{h.title}</a>)}</nav></aside>;
}
