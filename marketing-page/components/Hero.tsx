import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-200 to-amber-200 opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
                <span className="inline-block bg-rose-100 text-rose-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                    For Health & Wellness Professionals
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight tracking-tight mb-6">
                    One Link. Your Entire Wellness Practice.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Vena gives you a single, beautiful hub to connect with clients, manage your schedule, and grow your boutique business—effortlessly.
                </p>
                <div className="flex justify-center items-center gap-4">
                     <a href="#cta" className="bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Get Early Access
                    </a>
                </div>
            </div>

            <div className="mt-16 md:mt-24 max-w-5xl mx-auto">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
                    <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                    <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&h=600&q=80" alt="Vena app on a phone" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Hero;