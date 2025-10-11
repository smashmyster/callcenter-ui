import { API_BASE_URL } from '@/types/contstants';
import { useState, useEffect } from 'react';



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


export const useCalls = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calls, setCalls] = useState<any>([])
  // Fetch all documents
  const fetchCalls = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/speech/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      console.log(response);
      const data = await response.json();
      console.log(data);
      
      setCalls(data)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCalls()
  }, [])
  // Fetch documents by type


  return {
    loading,
    error,
    fetchCalls,
    calls
  };
};
