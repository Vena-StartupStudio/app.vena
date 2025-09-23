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
    <div className="bg-slate-200 dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden h-full flex">
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
        language={currentLanguage}
        onLanguageSwitch={handleLanguageSwitch}
      />
    </div>
  );
};

export default VenaProfileEditor;
