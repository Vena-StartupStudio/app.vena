import React, { useState } from 'react';
import { useProfileConfig } from '../hooks/useProfileConfig';
import EditorPanel from './EditorPanel';
import PreviewCanvas from './PreviewCanvas';

const VenaProfileEditor: React.FC = () => {
  const {
    config,
    setConfig,
    status,
    publishStatus,
    publishError,
    saveProfile,
    publishProfile,
    handleTemplateChange,
    handleStyleChange,
    handleFontThemeChange,
    handleValueChange,
    handleSectionVisibilityChange,
    handleSectionsOrderChange,
  } = useProfileConfig();

  const currentLanguage = config.meta?.lang || 'en';
  const isRtl = currentLanguage === 'he';

  const handleLanguageSwitch = () => {
    const newLang = currentLanguage === 'en' ? 'he' : 'en';
    setConfig(prevConfig => ({
      ...prevConfig,
      meta: {
        ...prevConfig.meta,
        lang: newLang,
      },
    }));
  };

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div className="bg-slate-200 dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden h-full flex relative">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 p-1 rounded-lg shadow-md border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
        <button
          onClick={handleLanguageSwitch}
          className="px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200"
          title={currentLanguage === 'en' ? "Switch to Hebrew" : "Switch to English"}
        >
          {currentLanguage === 'en' ? 'עברית' : 'English'}
        </button>
      </div>

      <EditorPanel
        isPreviewMode={isPreviewMode}
        config={config}
        language={currentLanguage}
        onTemplateChange={handleTemplateChange}
        onStyleChange={handleStyleChange}
        onFontThemeChange={handleFontThemeChange}
        onValueChange={handleValueChange}
        onSectionVisibilityChange={handleSectionVisibilityChange}
        onSectionsOrderChange={handleSectionsOrderChange}
      />
      <PreviewCanvas
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        config={config}
        isRtl={isRtl}
        onValueChange={handleValueChange}
        status={status}
        publishStatus={publishStatus}
        publishError={publishError}
        onSave={saveProfile}
        onPublish={publishProfile}
      />
    </div>
  );
};

export default VenaProfileEditor;
