import { useEffect, useRef, useState } from 'react';
import Home from './Home';
import Projects from './Projects';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';

const sections = ['home', 'projects', 'experience', 'education', 'contact'];

export default function MobileScroll() {
  const refs = useRef({});
  const containerRef = useRef(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const scrollTo = (id) => {
    refs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const scrollTop = containerRef.current?.scrollTop || 0;
    setShowTopBtn(scrollTop > 300);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth bg-white dark:bg-gray-900 text-black dark:text-white"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 px-4 flex justify-between items-center shadow-sm">
        <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">MyPortfolio</h1>
      </header>

      {/* Sections */}
      {sections.map((key) => (
        <section
          key={key}
          ref={(el) => (refs.current[key] = el)}
          className="snap-start h-screen overflow-y-auto"
        >
          {key === 'home' && <Home />}
          {key === 'projects' && <Projects />}
          {key === 'experience' && <Experience />}
          {key === 'education' && <Education />}
          {key === 'contact' && <Contact />}
        </section>
      ))}

      {/* Scroll Dots */}
      <div className="fixed top-1/2 right-3 -translate-y-1/2 flex flex-col space-y-3 z-50 md:hidden">
        {sections.map((key) => (
          <button
            key={key}
            onClick={() => scrollTo(key)}
            className="w-3 h-3 rounded-full bg-gray-400 hover:bg-blue-500 focus:outline-none"
            aria-label={`Go to ${key}`}
          ></button>
        ))}
      </div>

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={() => scrollTo('home')}
          className="fixed bottom-6 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
