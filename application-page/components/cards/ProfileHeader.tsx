import React, { useRef } from 'react';
import BaseCard from './BaseCard';
import type { ProfileConfig } from '../../index';

interface ProfileHeaderProps {
  config: ProfileConfig;
  onValueChange: <K extends keyof ProfileConfig>(key: K, value: ProfileConfig[K]) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRtl: boolean;
  initialPlaceholderImage: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  config,
  onValueChange,
  onImageUpload,
  isRtl,
  initialPlaceholderImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inlineInputStyles = "bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-md px-3 py-2 w-full text-center transition-all duration-200 hover:bg-white/10 dark:hover:bg-slate-700/30";

  return (
    <div className="relative">
      {/* Sophisticated Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/80 to-gray-100/60 dark:from-slate-900 dark:via-slate-800/90 dark:to-gray-900/80 rounded-3xl"></div>
      
      {/* Premium Glass Card */}
      <BaseCard 
        variant="glass" 
        padding="sm"
        className="relative overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/50"
      >
        {/* Ultra-Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Elegant Geometric Pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.02] dark:opacity-[0.05]">
            <div className="absolute inset-0 bg-gradient-to-bl from-slate-900 via-transparent to-transparent transform rotate-12"></div>
          </div>
          
          {/* Subtle Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Premium Content Container */}
        <div className="relative z-10 p-12 lg:p-16">
          <div className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-16">
            
            {/* Elite Profile Image Section */}
            <div className="flex-shrink-0">
              <div className="relative group">
                {/* Premium Image Container */}
                <div className="relative">
                  {/* Premium Profile Image Container */}
                  <div className="relative">
                    {/* Enhanced Profile Image with Better Placeholder */}
                    <div className="relative w-48 h-48 lg:w-60 lg:h-60 mx-auto">
                      {config.profileImage ? (
                        <img
                          src={config.profileImage}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover 
                            border-4 border-white/90 dark:border-slate-700/90
                            shadow-2xl shadow-slate-900/15 dark:shadow-slate-900/40
                            transition-all duration-500 ease-out
                            group-hover:scale-[1.01] group-hover:shadow-3xl 
                            group-hover:border-white dark:group-hover:border-slate-600/90"
                        />
                      ) : (
                        /* Clean Profile Image Placeholder */
                        <div className="w-full h-full rounded-full 
                          bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800
                          border-4 border-white/90 dark:border-slate-700/90
                          shadow-2xl shadow-slate-900/15 dark:shadow-slate-900/40
                          transition-all duration-500 ease-out
                          group-hover:scale-[1.01] group-hover:shadow-3xl 
                          group-hover:border-white dark:group-hover:border-slate-600/90
                          flex items-center justify-center">
                          <svg className="w-20 h-20 lg:w-24 lg:h-24 text-slate-400 dark:text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      )}
                      
                      {/* Refined Upload Overlay */}
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70 
                          rounded-full flex flex-col items-center justify-center text-white 
                          opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out
                          hover:from-slate-800/80 hover:via-slate-700/70 hover:to-slate-800/80
                          backdrop-blur-sm"
                        title="Click to change profile photo"
                      >
                        <div className="text-center">
                          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-lg font-medium tracking-wide">
                            {config.profileImage ? 'Change Photo' : 'Upload Photo'}
                          </span>
                        </div>
                      </button>
                      
                    </div>
                  </div>


                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onImageUpload} 
                accept="image/*" 
                className="hidden" 
              />


            </div>

            {/* Elite Profile Content */}
            <div className={`flex-1 text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'} space-y-8`}>
              
              {/* Premium Name Section */}
              <div className="space-y-4">
                <div className="relative">
                  <h1 className={`text-5xl md:text-6xl lg:text-7xl font-light ${config.styles.fontHeading} tracking-tight leading-none`}>
                    <input 
                      type="text" 
                      value={config.name} 
                      onChange={e => onValueChange('name', e.target.value)} 
                      className={`bg-transparent focus:outline-none w-full text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}
                        text-slate-900 dark:text-slate-100
                        hover:bg-slate-50/20 dark:hover:bg-slate-800/20
                        focus:bg-slate-50/30 dark:focus:bg-slate-800/30
                        rounded-2xl px-4 py-3 transition-all duration-300
                        placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                      placeholder="Your Name"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </h1>
                  
                  {/* Elegant Underline */}
                  <div className={`flex justify-center ${isRtl ? 'lg:justify-end' : 'lg:justify-start'} mt-4`}>
                    <div className="h-0.5 w-20 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 
                      rounded-full transition-all duration-500 hover:w-32 hover:via-slate-500 dark:hover:via-slate-400"></div>
                  </div>
                </div>

                {/* Refined Title */}
                <div className="relative">
                  <p className={`text-2xl md:text-3xl lg:text-4xl font-light ${config.styles.fontBody} 
                    text-slate-600 dark:text-slate-400 leading-relaxed tracking-wide`}>
                    <input 
                      type="text" 
                      value={config.title} 
                      onChange={e => onValueChange('title', e.target.value)} 
                      className={`bg-transparent focus:outline-none w-full text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}
                        hover:bg-slate-50/20 dark:hover:bg-slate-800/20
                        focus:bg-slate-50/30 dark:focus:bg-slate-800/30
                        rounded-2xl px-4 py-3 transition-all duration-300
                        placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                      placeholder="Your Professional Title"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </p>
                </div>
              </div>

              {/* Contact Information Fields */}
              <div className="space-y-6">
                {/* Email Field */}
                <div className="relative group">
                  <div className="flex items-center gap-4 
                    bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl 
                    border border-slate-200/50 dark:border-slate-700/50
                    rounded-2xl px-6 py-4 
                    hover:bg-white/60 dark:hover:bg-slate-800/60
                    hover:border-slate-300/60 dark:hover:border-slate-600/60
                    focus-within:bg-white/70 dark:focus-within:bg-slate-800/70
                    focus-within:border-blue-300/60 dark:focus-within:border-blue-600/60
                    hover:shadow-lg hover:shadow-slate-200/20 dark:hover:shadow-slate-900/30
                    transition-all duration-300">
                    
                    <div className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-900/40 
                      flex items-center justify-center group-focus-within:bg-blue-200 dark:group-focus-within:bg-blue-800/60 transition-colors duration-200">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    <input
                      type="email"
                      value={config.email || ''}
                      onChange={e => onValueChange('email', e.target.value)}
                      className="flex-1 bg-transparent focus:outline-none 
                        text-slate-700 dark:text-slate-300 
                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                        text-sm font-medium tracking-wide"
                      placeholder="Enter your email address"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="relative group">
                  <div className="flex items-center gap-4 
                    bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl 
                    border border-slate-200/50 dark:border-slate-700/50
                    rounded-2xl px-6 py-4 
                    hover:bg-white/60 dark:hover:bg-slate-800/60
                    hover:border-slate-300/60 dark:hover:border-slate-600/60
                    focus-within:bg-white/70 dark:focus-within:bg-slate-800/70
                    focus-within:border-emerald-300/60 dark:focus-within:border-emerald-600/60
                    hover:shadow-lg hover:shadow-slate-200/20 dark:hover:shadow-slate-900/30
                    transition-all duration-300">
                    
                    <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 
                      flex items-center justify-center group-focus-within:bg-emerald-200 dark:group-focus-within:bg-emerald-800/60 transition-colors duration-200">
                      <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    
                    <input
                      type="tel"
                      value={config.phone || ''}
                      onChange={e => onValueChange('phone', e.target.value)}
                      className="flex-1 bg-transparent focus:outline-none 
                        text-slate-700 dark:text-slate-300 
                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                        text-sm font-medium tracking-wide"
                      placeholder="Enter your phone number"
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Refined Decorative Elements */}
          <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600"></div>
              <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse delay-100"></div>
              <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </BaseCard>

      {/* Custom CSS Classes - using Tailwind's built-in animations instead */}
    </div>
  );
};

export default ProfileHeader;