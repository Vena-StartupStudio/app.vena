
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ValueProposition from './components/ValueProposition';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <ValueProposition />
        <CTA />

        {/* Sentry test button */}
        <button
          onClick={() => {
            throw new Error("This is my first Sentry error!");
          }}
          className="mt-8 p-2 bg-red-500 text-white rounded"
        >
          Break the world
        </button>

      </main>
      <Footer />
    </div>
  );
};

export default App;
