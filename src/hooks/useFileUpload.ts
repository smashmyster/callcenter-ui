import { API_BASE_URL } from '@/types/contstants';
import { useState } from 'react';

export interface AttachedFile {
  file: File;
  path: string;
  remotePath?: string;
  id?: string; // File upload ID from server
}

export const useFileUpload = () => {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Upload single file
  const uploadFile = async (file: File, conversationId?: string, messageId?: string) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }
      if (messageId) {
        formData.append('messageId', messageId);
      }
      
      const response = await fetch(`${API_BASE_URL}/speech/uploadFile`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
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
      
      const response = await fetch(`${API_BASE_URL}/speech/uploadFiles`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Add files to the list
  const addFiles = async (files: File[], conversationId?: string, messageId?: string) => {
    const newFiles = files.map(file => ({ file, path: file.name }));
    const result = await uploadFile(files[0], conversationId, messageId);
    console.log("files", files);
    console.log("result", result);
    
    // Update the first file with the ID from the server response
    if (result && result.id) {
      newFiles[0].id = result.id;
      newFiles[0].remotePath = result.externalPath;
    }
    
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

  // Get file IDs for sending in chat requests
  const getFileIds = () => {
    return attachedFiles
      .filter(file => file.id) // Only include files that have been uploaded and have IDs
      .map(file => file.id!);
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
    getFileIds,
    updateFileWithRemotePath,
    updateFilesWithRemotePaths
  };
};
