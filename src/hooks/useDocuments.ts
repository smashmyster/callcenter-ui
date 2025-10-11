import { API_BASE_URL } from '@/types/contstants';
import { useState, useEffect } from 'react';

export interface PolicyDocument {
  id: string;
  title: string;
  description?: string;
  type: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: string;
  headers?: any;
  isProcessed: boolean;
  version?: string;
  effectiveDate?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadData {
  title: string;
  description?: string;
  type: string;
  uploadedBy?: string;
  headers?: any;
  version?: string;
  effectiveDate?: string;
  parentId?: string; // Added parent ID field
}


export const useDocuments = () => {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all documents
  const fetchDocuments = async () => { 
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents by type
  const fetchDocumentsByType = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/type/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents by type');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents by section
  const fetchDocumentsBySection = async (section: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/section/${section}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents by section');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Search documents
  const searchDocuments = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Upload document
  const uploadDocument = async (file: File, uploadData: DocumentUploadData): Promise<PolicyDocument> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description || '');
      formData.append('type', uploadData.type);
      formData.append('uploadedBy', uploadData.uploadedBy || 'user-123');
      formData.append('version', uploadData.version || '1.0');
      formData.append('effectiveDate', uploadData.effectiveDate || new Date().toISOString());
      formData.append('parentId', uploadData.parentId || 'POLICY');
      
      if (uploadData.headers) {
        formData.append('headers', JSON.stringify(uploadData.headers));
      }

      const response = await fetch(`${API_BASE_URL}/policy-documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Add the new document to the local state
      if (result.document) {
        setDocuments(prev => [result.document, ...prev]);
      }
      
      // Also fetch all documents to ensure consistency
      await fetchDocuments();
      
      return result.document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get document by ID
  const getDocumentById = async (id: string): Promise<PolicyDocument | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
      return null;
    }
  };

  // Update document headers
  const updateDocumentHeaders = async (id: string, headers: any): Promise<PolicyDocument | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/${id}/headers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headers }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document headers');
      }

      const updatedDocument = await response.json();
      
      // Update the document in local state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDocument : doc)
      );
      
      return updatedDocument;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update document');
      return null;
    }
  };

  // Mark document as processed
  const markDocumentAsProcessed = async (id: string): Promise<PolicyDocument | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/${id}/processed`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to mark document as processed');
      }

      const updatedDocument = await response.json();
      
      // Update the document in local state
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? updatedDocument : doc)
      );
      
      return updatedDocument;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark document as processed');
      return null;
    }
  };

  // Delete document
  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      // Remove the document from local state
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      return false;
    }
  };

  // Get available document types
  const getDocumentTypes = async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/policy-documents/types`);
      if (!response.ok) {
        throw new Error('Failed to fetch document types');
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document types');
      return [];
    }
  };

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    fetchDocumentsByType,
    fetchDocumentsBySection,
    searchDocuments,
    uploadDocument,
    getDocumentById,
    updateDocumentHeaders,
    markDocumentAsProcessed,
    deleteDocument,
    getDocumentTypes,
  };
};
