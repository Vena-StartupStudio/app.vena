import React from 'react';

const CheckIcon: React.FC = () => (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
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
    <section id="value" className="bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-20 md:py-32 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-purple-100/40 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-indigo-100/50 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-60"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Image Section with Enhanced Styling */}
          <div className="lg:w-1/2 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-200/50 to-indigo-200/50 rounded-3xl blur-lg opacity-60"></div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1458501534264-7d326fa0ca04?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Modern Wellness Professional" 
                className="rounded-3xl shadow-xl object-cover w-full h-auto border border-white/50"
              />
              {/* Decorative frame elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-l-3 border-t-3 border-purple-300 rounded-tl-lg"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-3 border-b-3 border-indigo-300 rounded-br-lg"></div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="lg:w-1/2 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center">
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 mr-4"></div>
              <span className="font-medium text-purple-700 tracking-wider text-sm uppercase bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
                Why Vena?
              </span>
            </div>
            
            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-light text-slate-800 leading-tight tracking-wide">
                Designed for the
                <span className="block font-extralight text-slate-600 relative">
                  Modern Wellness Professional
                  <div className="absolute -bottom-2 left-0 w-24 h-0.5 bg-gradient-to-r from-purple-400 to-transparent opacity-60"></div>
                </span>
              </h2>
              
              <p className="text-xl text-slate-600 font-light leading-relaxed max-w-lg">
                Stop juggling multiple apps and complex websites. Vena brings everything together in one elegant, easy-to-use platform, so you can focus on what you do best.
              </p>
            </div>
            
            {/* Benefits List with Enhanced Design */}
            <div className="space-y-5 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center group">
                  <div className="flex-shrink-0 relative mr-5">
                    {/* Subtle background ring */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-10 scale-110"></div>
                    <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-2.5 shadow-sm">
                      <CheckIcon />
                    </div>
                  </div>
                  <span className="text-slate-700 font-light text-lg leading-relaxed">
                    {benefit}
                  </span>
                  {/* Subtle connecting line */}
                  {index < benefits.length - 1 && (
                    <div className="absolute left-6 mt-8 w-0.5 h-5 bg-gradient-to-b from-purple-200 to-transparent opacity-30"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;