import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Work from './components/Work.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <div className="mx-auto max-w-[1180px] px-5">
      <Header />
      <Hero />
      <About />
      <Skills />
      <Work />
      <Contact />
    </div>
  );
}
