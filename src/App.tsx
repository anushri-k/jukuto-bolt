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

function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <WhyJukuto />
        <Industries />
        <Modules />
        <Platform />
        <Process />
        <Testimonials />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
