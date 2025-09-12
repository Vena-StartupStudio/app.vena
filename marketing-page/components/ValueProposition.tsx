import React from 'react';

const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
);


const ValueProposition: React.FC = () => {
  const benefits = [
    'Elevate your professional image online.',
    'Simplify client bookings and payments.',
    'Save valuable administrative hours.',
    'Share personalized content effortlessly.',
    'Grow your practice with powerful tools.',
  ];

  return (
    <section id="value" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=600&h=500&q=80" 
              alt="Wellness professional using a tablet" 
              className="rounded-2xl shadow-2xl object-cover w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2">
            <span className="font-semibold text-emerald-600 uppercase tracking-wider">Why Vena?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-3 mb-6 tracking-tight">
              Designed for the Modern Wellness Professional
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Stop juggling multiple apps and complex websites. Vena brings everything together in one elegant, easy-to-use platform, so you can focus on what you do best—helping your clients thrive.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex-shrink-0 bg-rose-100 rounded-full p-2 mr-4">
                    <CheckIcon />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;