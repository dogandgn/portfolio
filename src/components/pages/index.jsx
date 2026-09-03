import React from 'react';
import Navbar from '../layout/Navbar';
import Hero from '../section/Hero';
import About from '../section/About';
import WorkAreas from '../section/WorkAreas';
import TechStack from '../section/TechStack';
import Experience from '../section/Experience';
import Projects from '../section/Projects';
import Footer from '../layout/Footer';
import InteractiveBackground from '../ui/InteractiveBackground';

export default function Index() {
  return (
    <div className="min-h-screen bg-void relative text-fog">
      <InteractiveBackground />
      <div className="relative z-10 w-full h-full">
        <Navbar />
        <Hero />
        <About />
        <WorkAreas />
        <TechStack />
        <Experience />
        <Projects />
        <Footer />
      </div>
    </div>
  );
}
