import React from 'react';
import BaseCard from './BaseCard';
import type { ProfileConfig, Service } from '../../index';

interface ServicesCardProps {
  config: ProfileConfig;
  services: Service[];
  onServiceChange: (services: Service[]) => void;
  isRtl: boolean;
  t: (key: string) => string;
  mode?: 'edit' | 'view';
}

const ServicesCard: React.FC<ServicesCardProps> = ({
  config,
  services,
  onServiceChange,
  isRtl,
  t,
  mode = 'edit',
}) => {
  const isView = mode === 'view';
  const dirAttr = isRtl ? 'rtl' : 'ltr';

  const updateService = (index: number, field: keyof Service, value: string) => {
    if (isView) return;
    const updated = services.map((service, idx) => (idx === index ? { ...service, [field]: value } : service));
    onServiceChange(updated);
  };

  const addService = () => {
    if (isView) return;
    const newService: Service = {
      id: Date.now(),
      title: 'New Service',
      description: 'Describe your service here...'
    };
    onServiceChange([...services, newService]);
  };

  const removeService = (index: number) => {
    if (isView) return;
    onServiceChange(services.filter((_, idx) => idx !== index));
  };

  const inputBase = 'bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-md px-2 py-1 w-full';
  const readOnlyExtras = 'pointer-events-none focus:ring-0 focus:outline-none hover:bg-transparent';
  const inputClass = `${inputBase}${isView ? ` ${readOnlyExtras}` : ''}`;

  return (
    <BaseCard variant="default" className="overflow-hidden">
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${config.styles.colorPrimary} flex items-center justify-center shadow-lg`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${config.styles.fontHeading} ${config.styles.colorSecondary} relative`}>
            {t('myServices')}
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 ${config.styles.colorPrimary} rounded-full`} />
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <BaseCard
              key={service.id}
              variant="glass"
              padding="md"
              className="relative group"
              hoverable={!isView}
            >
              {!isView && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center hover:bg-red-600"
                  title="Remove service"
                >
                  ª
                </button>
              )}

              <div className="space-y-4">
                {isView ? (
                  <h3 className={`${config.styles.fontHeading} text-xl font-semibold text-center text-slate-800 dark:text-slate-200`}>
                    {service.title}
                  </h3>
                ) : (
                  <input
                    type="text"
                    value={service.title}
                    onChange={(event) => updateService(index, 'title', event.target.value)}
                    className={`${inputClass} ${config.styles.fontHeading} text-xl font-semibold text-center text-slate-800 dark:text-slate-200`}
                    placeholder="Service Title"
                    dir={dirAttr}
                  />
                )}

                {isView ? (
                  <p className={`${config.styles.fontBody} text-slate-600 dark:text-slate-400 text-center whitespace-pre-line`}>
                    {service.description}
                  </p>
                ) : (
                  <textarea
                    value={service.description}
                    onChange={(event) => updateService(index, 'description', event.target.value)}
                    className={`${inputClass} ${config.styles.fontBody} text-slate-600 dark:text-slate-400 text-center min-h-[80px] resize-none`}
                    placeholder="Describe this service..."
                    dir={dirAttr}
                  />
                )}
              </div>
            </BaseCard>
          ))}

          {!isView && (
            <BaseCard
              variant="minimal"
              padding="md"
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
              onClick={addService}
            >
              <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Add Service</span>
              </div>
            </BaseCard>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default ServicesCard;
