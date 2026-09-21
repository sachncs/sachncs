import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { AboutMe } from './pages/AboutMe';
import { Work } from './pages/Work';
import { Repositories, repositories, Project } from './pages/Repositories';
import { Writing, ArticlePage } from './pages/Writing';
import { Connect } from './pages/Connect';
import { articles, PageIntro } from './components/Shared';
export default function App({ path = '/' }: { path?: string }) {
 const article = articles.find(a => path === `/writing/${a.slug}`);
 const repository = repositories.find(r => path === `/${r.name}`);
 const pages: Record<string, React.ReactNode> = { '/': <Home />, '/about-me': <AboutMe />, '/work': <Work />, '/repos': <Repositories />, '/writing': <Writing />, '/connect': <Connect /> };
 const page = pages[path] || (article ? <ArticlePage article={article} /> : repository ? <Project repository={repository} /> : <PageIntro eyebrow="404 / PAGE NOT FOUND" title="A missing connection."><p>This page is not available. Explore the <a href="/repos">repository index</a> or <a href="/">return home</a>.</p></PageIntro>);
 return <><a className="skip-link" href="#main-content">Skip to content</a><Navigation path={path} /><main className="shell" id="main-content" tabIndex={-1}>{page}</main><Footer /></>;
}
