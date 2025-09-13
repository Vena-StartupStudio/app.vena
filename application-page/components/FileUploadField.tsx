import React from 'react';
import UploadIcon from './icons/UploadIcon';

interface FileUploadFieldProps {
  label: string;
  id: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
  required?: boolean;
  error?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  id,
  name,
  onChange,
  fileName,
  required = false,
  error,
}) => {
  const errorClasses = "border-red-500 text-red-900";
  const normalClasses = "border-zinc-300 text-gray-600";
  
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${error ? errorClasses : normalClasses} border-dashed rounded-lg`}>
        <div className="space-y-1 text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-zinc-400" />
          <div className="flex text-sm text-zinc-600">
            <label
              htmlFor={id}
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-dark hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-light"
            >
              <span>Upload a file</span>
              <input id={id} name={name} type="file" className="sr-only" onChange={onChange} accept="image/png, image/jpeg, image/gif"/>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
          {fileName && (
              <p className="text-sm font-medium text-primary-dark pt-2 truncate">{fileName}</p>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploadField;