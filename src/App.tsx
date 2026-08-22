import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { WhyJukuto } from './components/WhyJukuto';
import { Industries } from './components/Industries';
import { Modules } from './components/Modules';
import { Platform } from './components/Platform';
import { Process } from './components/Process';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/CTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import DashboardApp from './dashboard/DashboardApp';

function App() {
  if (window.location.pathname.startsWith('/dashboard')) {
    return <DashboardApp />;
  }
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <WhyJukuto />
        <Industries />
        <Modules />
        <Process />
        <Platform />
        <Testimonials />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
