import React, { useState } from 'react';
import { useProfileConfig } from '../hooks/useProfileConfig';
import EditorPanel from './EditorPanel';
import PreviewCanvas from './PreviewCanvas';

const VenaProfileEditor: React.FC<{ language: 'en' | 'he' }> = ({ language }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const isRtl = language === 'he';

  const {
    config,
    setConfig,
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
        setConfig={setConfig}
        isRtl={isRtl}
        onValueChange={handleValueChange}
      />
    </div>
  );
};

export default VenaProfileEditor;