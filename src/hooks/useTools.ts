import { useState } from 'react';
import { API_BASE_URL } from '@/types/contstants';
import { ETools, ITool } from '@/types';

export interface ExecuteToolOptions {
  input?: string;
  conversationId?: string;
  fileIds?: string[];
}

const TOOL_TYPE_MAP: Record<ETools, string> = {
  [ETools.TRANSCRIBE]: 'TRANSCRIBE_AUDIO',
  [ETools.SUMMARIZE_CHAT]: 'SUMMARIZE_CONVERSATION',
  [ETools.SOCIAL_POSTING]: 'POLICY_AUDIT',
  [ETools.JIRA_TICKETS]: 'CREATE_JIRA',
  [ETools.POLICYCHECK]: 'BROWSE_POLICIES',
};

export interface ToolExecutionResponse {
  tool: string;
  message: string;
  data?: any;
  sources?: any[];
}

export const useTools = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTool = async (tool: ITool, options: ExecuteToolOptions = {}): Promise<ToolExecutionResponse> => {
    const toolType = TOOL_TYPE_MAP[tool.type];
    if (!toolType) {
      throw new Error('Unsupported tool selection');
    }

    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/tools/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: toolType,
          input: options.input,
          conversationId: options.conversationId,
          fileIds: options.fileIds,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Tool execution failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Tool execution failed';
      setError(message);
      throw err;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    executeTool,
    isRunning,
    error,
  };
};
