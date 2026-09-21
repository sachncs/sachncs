import content from '../generated/content.json';
import { PageIntro, TableOfContents, ConnectPreview } from '../components/Shared';
import { ArchitectureDiagram } from '../components/work/ArchitectureDiagram';
import { profile } from '../data/profile';
export function AboutMe() {
 return <><PageIntro eyebrow={`${profile.title} / ${profile.secondaryTitle}`} title="About Me"><p className="large-lead">Strategy in one conversation.<br />Implementation in the next.</p><p>I design AI systems around the constraints that matter in production: reliability, latency, security, data quality, cost, and operational ownership.</p><span className="mono muted">{content.about.readingTime} min read · {profile.location}</span></PageIntro><ArchitectureDiagram steps={['Problem', 'Architecture', 'Prototype', 'Engineering', 'Evaluation', 'Deployment', 'Operation', 'Improvement']} caption="The full lifecycle. Production evidence feeds back into the next architectural decision." /><div className="editorial-layout"><TableOfContents headings={content.about.headings} /><div className="prose" dangerouslySetInnerHTML={{ __html: content.about.html }} /></div><ConnectPreview /></>;
}
