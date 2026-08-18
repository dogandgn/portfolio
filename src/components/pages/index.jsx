import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from '../layout/Navbar';
import Hero from '../section/Hero';
import About from '../section/About';
import TechStack from '../section/TechStack';
import Experience from '../section/Experience';
import Projects from '../section/Projects';
import Footer from '../layout/Footer';
import InteractiveBackground from '../ui/InteractiveBackground';

export default function Index() {
  return (
    <div className="min-h-screen bg-[#070a13] relative text-slate-200">
      <InteractiveBackground />
      <div className="relative z-10 w-full h-full">
        <Navbar />
        <div className="bg-transparent">
          <Hero />
        </div>
        <div className="bg-gradient-to-b from-[#070a13] to-[#090d16] backdrop-blur-sm border-t border-slate-800/30 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] relative z-10 transition-colors duration-500">
          <About />
        </div>
        <div className="bg-[#0b0f19]/95 backdrop-blur-md border-t border-sky-900/20 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] relative z-10 transition-colors duration-500">
          <TechStack />
        </div>
        <div className="bg-gradient-to-b from-[#0b0f19] to-[#070a13] backdrop-blur-md border-t border-indigo-900/20 shadow-[0_-10px_30px_rgba(0,0,0,0.4)] relative z-10 transition-colors duration-500">
          <Experience />
        </div>
        <div className="bg-[#020617] backdrop-blur-md border-t border-sky-900/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-10 transition-colors duration-500">
          <Projects />
        </div>
        <Footer />
      </div>
      <Analytics />
    </div>
  );
}