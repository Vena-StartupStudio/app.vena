import React from 'react';

const CTA: React.FC = () => {
  return (
    <section id="cta" className="bg-[#fcfaf7]">
        <div className="container mx-auto px-6 py-20 md:py-28">
            <div className="bg-emerald-800 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Ready to Transform Your Practice?
                    </h2>
                    <p className="mt-4 text-lg text-emerald-100 mb-8">
                        Join our waitlist to be the first to know when Vena launches. Get exclusive early access and special offers.
                    </p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            className="w-full px-5 py-3 rounded-xl border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-white text-gray-800 placeholder-gray-500"
                        />
                        <button 
                            type="submit"
                            className="bg-white text-emerald-800 font-semibold px-8 py-3 rounded-xl hover:bg-rose-50 transition-colors duration-300 shadow-md flex-shrink-0"
                        >
                            Join Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CTA;