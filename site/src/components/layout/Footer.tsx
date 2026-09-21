import { navigation, profile } from '../../data/profile';
export function SocialLinks() {
  return <div className="social-links"><a href={`mailto:${profile.email}`}>Email <span aria-hidden="true">↗</span></a><a href={profile.linkedin}>LinkedIn <span aria-hidden="true">↗</span></a><a href={profile.github}>GitHub <span aria-hidden="true">↗</span></a></div>;
}
export function Footer() {
  return <footer className="site-footer shell"><div className="footer-top"><div><a className="footer-name" href="/">{profile.name}<span className="accent">.</span></a><p>{profile.title}<br />{profile.location}</p></div><nav aria-label="Footer">{navigation.map(([href, name]) => <a key={href} href={href}>{name}</a>)}</nav><SocialLinks /></div><div className="footer-bottom"><span>Architecture. Engineering. In practice.</span><a href="/feed.xml">RSS feed ↗</a><span>© {new Date().getUTCFullYear()} {profile.name}</span></div></footer>;
}
