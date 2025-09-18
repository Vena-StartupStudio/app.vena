import React, { useState } from 'react';
import { useProfileConfig } from '../hooks/useProfileConfig';
import EditorPanel from './EditorPanel';
import PreviewCanvas from './PreviewCanvas';

const VenaProfileEditor: React.FC<{ language: 'en' | 'he' }> = ({ language }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const isRtl = language === 'he';

  const {
    config,
    status,
    setStatus,
    saveProfile,
    handleTemplateChange,
    handleStyleChange,
    handleFontThemeChange,
    handleValueChange,
    handleSectionVisibilityChange,
    handleSectionsOrderChange,
  } = useProfileConfig(language);

  return (
    <div className="bg-slate-200 dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden h-full flex">
      <EditorPanel
        isPreviewMode={isPreviewMode}
        config={config}
        language={language}
        status={status}
        saveProfile={saveProfile} // Pass it directly - no arrow function needed
        onTemplateChange={handleTemplateChange}
        onStyleChange={handleStyleChange}
        onFontThemeChange={handleFontThemeChange}
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
        setStatus={setStatus}
      />
    </div>
  );
};

export default VenaProfileEditor;