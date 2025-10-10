import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FilePickerProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function FilePicker({ onFileSelect, onClose, isOpen }: FilePickerProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Check if file is PDF or DOCX
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isAllowedType = allowedTypes.includes(file.type) || 
                         ['pdf', 'docx', 'doc'].includes(fileExtension || '');

    if (isAllowedType) {
      onFileSelect(file);
      onClose();
    } else {
      alert('Please select a PDF or DOCX file.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Select Document</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragOver 
              ? 'border-blue-400 bg-blue-900/20' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-white text-lg mb-2">Drop your file here</p>
          <p className="text-gray-400 text-sm mb-4">or click to browse</p>
          <p className="text-gray-500 text-xs">Supports PDF, DOCX, DOC files</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
