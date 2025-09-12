import React from 'react';
import { FeatureIcons } from '../constants';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-stone-100 transform hover:-translate-y-2">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-rose-100 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);


const Features: React.FC = () => {
  const features = [
    {
      icon: <FeatureIcons.Hub />,
      title: 'Your Personal Wellness Hub',
      description: 'Build your brand and deepen client relationships with a personalized landing page for your services, content, and contact info.',
    },
    {
      icon: <FeatureIcons.Connector />,
      title: 'Seamless Practice Connector',
      description: 'Streamline your admin with integrated scheduling, payments, and automated reminders. More time for clients, less time on paperwork.',
    },
    {
      icon: <FeatureIcons.Builder />,
      title: 'Boutique Business Builder',
      description: 'Share your expertise through exclusive content and scale your practice with a premium, professional online presence and a quick-connect QR code.',
    },
  ];

  return (
    <section id="features" className="bg-[#fcfaf7] py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Everything You Need, All in One Place
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Vena is designed from the ground up to empower independent wellness professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;