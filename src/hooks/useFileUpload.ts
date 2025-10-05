import { useState } from 'react';

export interface AttachedFile {
  file: File;
  path: string;
  remotePath?: string;
}

export const useFileUpload = () => {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Upload single file
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`https://api-pilot.balanceapp.co.za/speech/uploadFile`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      console.log('File uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Upload multiple files
  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch(`https://api-pilot.balanceapp.co.za/speech/uploadFiles`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      console.log('Files uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Add files to the list
  const addFiles = (files: File[]) => {
    const newFiles = files.map(file => ({ file, path: file.name }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    return newFiles;
  };

  // Remove a specific file
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearAllFiles = () => {
    setAttachedFiles([]);
  };

  // Update file with remote path
  const updateFileWithRemotePath = (file: File, remotePath: string) => {
    setAttachedFiles(prev => 
      prev.map(f => 
        f.file === file 
          ? { ...f, remotePath }
          : f
      )
    );
  };

  // @typescript-eslint/no-explicit-any
  const updateFilesWithRemotePaths = (files: File[], results: any[]) => {
    setAttachedFiles(prev => 
      prev.map((f) => {
        const fileIndex = files.findIndex(file => file === f.file);
        if (fileIndex !== -1 && results && results[fileIndex]) {
          return { ...f, remotePath: results[fileIndex].filePath };
        }
        return f;
      })
    );
  };

  return {
    attachedFiles,
    isUploading,
    uploadFile,
    uploadFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFileWithRemotePath,
    updateFilesWithRemotePaths
  };
};
