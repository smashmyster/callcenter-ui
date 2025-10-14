import { API_BASE_URL } from '@/types/contstants';
import { useSocket } from '@/context/SocketContext';
import { useCallback, useEffect, useState } from 'react';

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
  const [calls, setCalls] = useState<any[]>([]);
  const { socket, lastDataEvent } = useSocket();

  const fetchCalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/speech/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }
      const data = await response.json();
      setCalls(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertCall = useCallback((incoming: any) => {
    if (!incoming) {
      return;
    }
    setCalls((prev) => {
      const filtered = prev.filter((call) => call.id !== incoming.id);
      return [incoming, ...filtered];
    });
  }, []);

  const handleRealtimeCall = useCallback(
    (payload: any) => {
      if (!payload) {
        return;
      }
      if (Array.isArray(payload.calls)) {
        setCalls(payload.calls);
        return;
      }
      if (payload.call) {
        upsertCall(payload.call);
        return;
      }
      if (payload.type === 'calls.updated' && payload.data) {
        upsertCall(payload.data.call ?? payload.data);
        return;
      }
      fetchCalls();
    },
    [fetchCalls, upsertCall],
  );

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('calls.updated', handleRealtimeCall);

    return () => {
      socket.off('calls.updated', handleRealtimeCall);
    };
  }, [socket, handleRealtimeCall]);

  useEffect(() => {
    if (lastDataEvent?.type === 'calls.updated') {
      handleRealtimeCall(lastDataEvent);
    }
  }, [lastDataEvent, handleRealtimeCall]);

  return {
    loading,
    error,
    fetchCalls,
    calls,
  };
};
