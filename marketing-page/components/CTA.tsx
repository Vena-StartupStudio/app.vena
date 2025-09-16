import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Practice?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Join thousands of wellness professionals who are already growing their business with Vena.
        </p>
        <a
          href="https://app.vena.software/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
        >
          Sign Up Now
        </a>
      </div>
    </section>
  );
};

export default CTA;