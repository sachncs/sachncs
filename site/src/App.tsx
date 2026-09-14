import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Capabilities } from './components/Capabilities';
import { SelectedWork } from './components/SelectedWork';
import { Process } from './components/Process';
import { Engagement } from './components/Engagement';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-ink-50">
      <Nav />
      <main className="relative">
        <Hero />
        <Capabilities />
        <Stats />
        <SelectedWork />
        <Process />
        <Engagement />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}