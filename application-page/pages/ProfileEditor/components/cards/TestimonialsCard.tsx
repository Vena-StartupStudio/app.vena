import React from 'react';
import BaseCard from './BaseCard';
import type { ProfileConfig, Testimonial } from '../../types';

interface TestimonialsCardProps {
  config: ProfileConfig;
  testimonials: Testimonial[];
  onTestimonialChange: (testimonials: Testimonial[]) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const TestimonialsCard: React.FC<TestimonialsCardProps> = ({
  config,
  testimonials,
  onTestimonialChange,
  isRtl,
  t
}) => {
  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    const updatedTestimonials = testimonials.map((testimonial, i) => 
      i === index ? { ...testimonial, [field]: value } : testimonial
    );
    onTestimonialChange(updatedTestimonials);
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      quote: 'Your testimonial quote here...',
      author: 'Client Name'
    };
    onTestimonialChange([...testimonials, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    onTestimonialChange(testimonials.filter((_, i) => i !== index));
  };

  const inlineInputStyles = "bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-md px-2 py-1 w-full";

  return (
    <BaseCard variant="glass" className="overflow-hidden">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${config.styles.colorPrimary} flex items-center justify-center shadow-lg`}>
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${config.styles.fontHeading} ${config.styles.colorSecondary} relative`}>
            {t('whatPeopleAreSaying')}
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 ${config.styles.colorPrimary} rounded-full`}></div>
          </h2>
        </div>

        {/* Testimonials List */}
        <div className="space-y-6">
          {testimonials.map((testimonial, index) => (
            <BaseCard
              key={testimonial.id}
              variant="elevated"
              padding="lg"
              className="relative group max-w-4xl mx-auto"
              hoverable={true}
            >
              {/* Remove Testimonial Button */}
              <button
                onClick={() => removeTestimonial(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center hover:bg-red-600 z-10"
                title="Remove testimonial"
              >
                ×
              </button>

              <div className="text-center space-y-6">
                {/* Quote Icon */}
                <div className="flex justify-center">
                  <div className={`w-8 h-8 ${config.styles.colorPrimary} rounded-full flex items-center justify-center opacity-60`}>
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                </div>

                {/* Quote Text */}
                <blockquote className="relative">
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                    className={`${inlineInputStyles} ${config.styles.fontBody} text-xl italic text-slate-700 dark:text-slate-300 text-center min-h-[100px] resize-none leading-relaxed`}
                    placeholder="Enter testimonial quote..."
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <input
                      type="text"
                      value={testimonial.author}
                      onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                      className={`${inlineInputStyles} ${config.styles.fontBody} font-semibold text-slate-800 dark:text-slate-200 text-lg`}
                      placeholder="Author Name"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400">Client</p>
                  </div>
                </div>

                {/* Decorative Stars */}
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <svg 
                      key={starIndex}
                      className={`w-5 h-5 ${config.styles.colorPrimary.replace('bg-', 'text-')} opacity-80`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </BaseCard>
          ))}

          {/* Add New Testimonial Card */}
          <BaseCard 
            variant="minimal" 
            padding="lg"
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer max-w-2xl mx-auto"
            onClick={addTestimonial}
          >
            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors py-8">
              <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium">Add Testimonial</span>
            </div>
          </BaseCard>
        </div>
      </div>
    </BaseCard>
  );
};

export default TestimonialsCard;