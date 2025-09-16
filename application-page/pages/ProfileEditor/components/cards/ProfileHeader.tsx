import React, { useRef } from 'react';
import BaseCard from './BaseCard';
import type { ProfileConfig } from '../../types';

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
    <BaseCard 
      variant="glass" 
      padding="xl" 
      className="relative overflow-hidden"
      hoverable={true}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-gradient-to-br"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, ${config.styles.colorPrimary.replace('bg-', 'rgb(59 130 246)')} 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${config.styles.colorSecondary.replace('text-', 'rgb(168 85 247)')} 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, ${config.styles.colorPrimary.replace('bg-', 'rgb(34 197 94)')} 0%, transparent 50%)
            `
          }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Profile Image Section */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="relative">
                {/* Main Profile Image */}
                <div className="relative">
                  <img
                    src={config.profileImage || initialPlaceholderImage}
                    alt="Profile"
                    className="w-40 h-40 lg:w-48 lg:h-48 rounded-full object-cover border-8 border-white/80 dark:border-slate-700/80 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
                  />
                  
                  {/* Upload Overlay */}
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                  >
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium">Change Photo</span>
                  </button>
                  
                  {/* Status Indicator */}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full ${config.styles.colorPrimary} border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center`}>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Decorative Ring */}
                <div 
                  className="absolute -inset-3 border-2 opacity-20 rounded-full"
                  style={{
                    borderImage: `linear-gradient(45deg, ${config.styles.colorPrimary.replace('bg-', 'rgb(59 130 246)')}, ${config.styles.colorSecondary.replace('text-', 'rgb(168 85 247)')}, ${config.styles.colorPrimary.replace('bg-', 'rgb(59 130 246)')}) 1`,
                    animation: 'spin 20s linear infinite'
                  }}
                ></div>
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

          {/* Profile Info Section */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold ${config.styles.fontHeading} ${config.styles.colorPrimary} leading-tight`}>
                <input 
                  type="text" 
                  value={config.name} 
                  onChange={e => onValueChange('name', e.target.value)} 
                  className={inlineInputStyles}
                  placeholder="Your Name"
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </h1>
              
              {/* Animated Underline */}
              <div className={`h-1 w-24 ${config.styles.colorPrimary} rounded-full mx-auto lg:mx-0 transition-all duration-300 hover:w-32`}></div>
            </div>

            {/* Title/Role */}
            <p className={`text-xl md:text-2xl lg:text-3xl ${config.styles.fontBody} ${config.styles.colorSecondary} opacity-90 leading-relaxed`}>
              <input 
                type="text" 
                value={config.title} 
                onChange={e => onValueChange('title', e.target.value)} 
                className={inlineInputStyles}
                placeholder="Your Professional Title"
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </p>

            {/* Contact Info Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4">
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group">
                <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group">
                <svg className="w-4 h-4 text-slate-500 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Phone</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer group">
                <svg className="w-4 h-4 text-slate-500 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Location</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start space-x-4 pt-2">
              {[
                { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", label: "Twitter", color: "hover:text-blue-400" },
                { icon: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z", label: "LinkedIn", color: "hover:text-blue-600" },
                { icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.342-.091.36-.293 1.146-.334 1.309-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.741-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z", label: "GitHub", color: "hover:text-gray-600" }
              ].map((social, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm flex items-center justify-center text-slate-500 ${social.color} hover:scale-110 transition-all duration-200 hover:shadow-lg group`}
                  title={social.label}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="flex justify-center lg:justify-start mt-8">
          <div className="flex items-center space-x-3 bg-green-100/80 dark:bg-green-900/30 backdrop-blur-sm rounded-full px-6 py-3 border border-green-200/50 dark:border-green-800/50">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Available for new projects</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <div className="flex space-x-2">
            <div className={`w-2 h-2 rounded-full ${config.styles.colorPrimary} animate-bounce`}></div>
            <div className={`w-2 h-2 rounded-full ${config.styles.colorPrimary} animate-bounce delay-75`}></div>
            <div className={`w-2 h-2 rounded-full ${config.styles.colorPrimary} animate-bounce delay-150`}></div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ProfileHeader;