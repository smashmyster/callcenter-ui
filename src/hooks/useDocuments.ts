import { useSocket } from '@/context/SocketContext';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/utils/apiClient';

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

const normalizeDocument = (doc: any): PolicyDocument => {
  const createdAt =
    typeof doc?.createdAt === 'string'
      ? doc.createdAt
      : new Date(doc?.createdAt ?? Date.now()).toISOString();
  const updatedAt =
    typeof doc?.updatedAt === 'string'
      ? doc.updatedAt
      : new Date(doc?.updatedAt ?? Date.now()).toISOString();

  return {
    ...doc,
    createdAt,
    updatedAt,
  } as PolicyDocument;
};

const sortDocumentsDescending = (docs: PolicyDocument[]) =>
  [...docs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

export const useDocuments = () => {
  const [documents, setDocuments] = useState<PolicyDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket, lastDataEvent } = useSocket();

  const upsertDocument = useCallback((incoming: PolicyDocument) => {
    setDocuments((prev) => {
      const filtered = prev.filter((doc) => doc.id !== incoming.id);
      return sortDocumentsDescending([normalizeDocument(incoming), ...filtered]);
    });
  }, []);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<PolicyDocument[]>('/policy-documents/documents');
      const normalized = data.map(normalizeDocument);
      setDocuments(sortDocumentsDescending(normalized));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentsByType = useCallback(async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<PolicyDocument[]>(`/policy-documents/documents/type/${type}`);
      setDocuments(sortDocumentsDescending(data.map(normalizeDocument)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDocumentsBySection = useCallback(async (section: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<PolicyDocument[]>(`/policy-documents/documents/section/${section}`);
      setDocuments(sortDocumentsDescending(data.map(normalizeDocument)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchDocuments = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<PolicyDocument[]>(`/policy-documents/documents/search?q=${encodeURIComponent(query)}`);
      setDocuments(sortDocumentsDescending(data.map(normalizeDocument)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(
    async (file: File, uploadData: DocumentUploadData): Promise<PolicyDocument> => {
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
        formData.append(
          'effectiveDate',
          uploadData.effectiveDate || new Date().toISOString(),
        );
        formData.append('parentId', uploadData.parentId || 'POLICY');

        if (uploadData.headers) {
          formData.append('headers', JSON.stringify(uploadData.headers));
        }

        const result = await apiClient.uploadFile<{document: PolicyDocument}>('/policy-documents/upload', formData);

        if (result.document) {
          upsertDocument(result.document);
        }

        await fetchDocuments();
        return normalizeDocument(result.document);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchDocuments, upsertDocument],
  );

  const getDocumentById = useCallback(async (id: string): Promise<PolicyDocument | null> => {
    try {
      const data = await apiClient.get(`/policy-documents/documents/${id}`);
      return normalizeDocument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document');
      return null;
    }
  }, []);

  const updateDocumentHeaders = useCallback(
    async (id: string, headers: any): Promise<PolicyDocument | null> => {
      try {
        const data = await apiClient.put(`/policy-documents/documents/${id}/headers`, { headers });
        const updatedDocument = normalizeDocument(data);
        upsertDocument(updatedDocument);
        return updatedDocument;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update document');
        return null;
      }
    },
    [upsertDocument],
  );

  const markDocumentAsProcessed = useCallback(
    async (id: string): Promise<PolicyDocument | null> => {
      try {
        const data = await apiClient.put(`/policy-documents/documents/${id}/processed`);
        const updatedDocument = normalizeDocument(data);
        upsertDocument(updatedDocument);
        return updatedDocument;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark document as processed');
        return null;
      }
    },
    [upsertDocument],
  );

  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/policy-documents/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      return false;
    }
  }, []);

  const getDocumentTypes = useCallback(async (): Promise<string[]> => {
    try {
      return await apiClient.get('/policy-documents/types');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch document types');
      return [];
    }
  }, []);

  const handleRealtimeDocuments = useCallback(
    (payload: any) => {
      if (!payload) {
        return;
      }
      if (Array.isArray(payload.documents)) {
        setDocuments(sortDocumentsDescending(payload.documents.map(normalizeDocument)));
        return;
      }
      if (payload.document) {
        upsertDocument(normalizeDocument(payload.document));
        return;
      }
      fetchDocuments();
    },
    [fetchDocuments, upsertDocument],
  );

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('documents.updated', handleRealtimeDocuments);
    return () => {
      socket.off('documents.updated', handleRealtimeDocuments);
    };
  }, [socket, handleRealtimeDocuments]);

  useEffect(() => {
    if (lastDataEvent?.type === 'documents.updated') {
      handleRealtimeDocuments(lastDataEvent);
    }
  }, [lastDataEvent, handleRealtimeDocuments]);

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
