import { FileText, BarChart3, Image, Plus, Download, Upload, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface DocumentCardProps {
  title: string;
  description: string;
  lastModified: string;
  icon?: 'document' | 'chart' | 'image' | 'plus';
  isAddCard?: boolean;
  fileUrl?: string;
  isLoading?: boolean;
  onClick?: () => void;
  onDownload?: () => void;
  onFileSelect?: () => void;
  onFileReplace?: (file: File) => void;
}

export function DocumentCard({ 
  title, 
  description, 
  lastModified, 
  icon = 'document',
  isAddCard = false,
  fileUrl,
  isLoading = false,
  onClick,
  onDownload,
  onFileSelect,
  onFileReplace
}: DocumentCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getIcon = () => {
    if (isAddCard) return <Plus size={24} className="text-gray-400" />;
    
    switch (icon) {
      case 'chart':
        return <BarChart3 size={20} className="text-gray-400" />;
      case 'image':
        return <Image size={20} className="text-gray-400" />;
      default:
        return <FileText size={20} className="text-gray-400" />;
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        setIsUploading(true);
        try {
          if (onFileReplace) {
            await onFileReplace(file);
          }
        } finally {
          setIsUploading(false);
        }
      } else {
        alert('Please select a PDF or DOCX file.');
      }
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUploading || isLoading) return; // Prevent clicks during upload
    
    if (isAddCard && onFileSelect) {
      onFileSelect();
    } else if (!fileUrl && onFileReplace) {
      // If no file URL, open file picker for upload
      fileInputRef.current?.click();
    } else if (onClick) {
      onClick();
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <div 
      className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors ${
        isAddCard ? 'border-dashed border-gray-600 hover:border-gray-500 cursor-pointer' : 'cursor-pointer'
      } ${(isUploading || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium text-sm mb-1 truncate">{title}</h3>
              {!isAddCard && (
                <>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{description}</p>
                  <p className="text-gray-500 text-xs">Edited {lastModified}</p>
                </>
              )}
              {isAddCard && (
                <p className="text-gray-400 text-sm">Add to Favorites</p>
              )}
            </div>
            {!isAddCard && fileUrl && !isUploading && !isLoading && (
              <button
                onClick={handleDownloadClick}
                className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                title="Download file"
              >
                <Download size={14} />
              </button>
            )}
            {!isAddCard && !fileUrl && !isUploading && !isLoading && (
              <div className="ml-2 p-1 text-gray-400" title="Click to upload file">
                <Upload size={14} />
              </div>
            )}
            {(isUploading || isLoading) && (
              <div className="ml-2 p-1 text-gray-400" title="Uploading...">
                <Loader2 size={14} className="animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
