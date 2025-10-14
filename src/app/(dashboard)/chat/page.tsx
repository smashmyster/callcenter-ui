"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResults } from '@/components/SearchResults';
import { InputBar } from '@/components/InputBar';
import { DragDropWrapper } from '@/components/DragDropWrapper';
import { TopBar } from '@/components/TopBar';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSearch } from '@/hooks/useSearch';
import { useTools } from '@/hooks/useTools';
import { ITool, Message, ETools } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const { searchResults, isSearching, thinkingProcess, searchDocs } = useSearch();
  const { executeTool, isRunning: isToolRunning } = useTools();
  const {
    attachedFiles,
    isUploading,
    removeFile,
    clearAllFiles,
    addFiles,
    getFileIds,
  } = useFileUpload();

  const [text, setText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ITool | null>(null);
  const [toolMessages, setToolMessages] = useState<Message[]>([]);

  // Handle search with text input
  const handleSend = async (tool?: ITool | null) => {
    const trimmed = text.trim();

    if (tool) {
      const fileIds = getFileIds();
      if (!trimmed && (!fileIds.length || tool.type !== ETools.TRANSCRIBE)) {
        return;
      }

      try {
        const response = await executeTool(tool, {
          input: trimmed || undefined,
          fileIds,
        });

        setToolMessages((prev) => [
          ...prev,
          {
            id: `tool-${Date.now()}`,
            conversationId: '',
            content: response.message || 'Tool executed.',
            role: 'assistant',
            createdAt: new Date(),
            source: response.sources ?? [],
          },
        ]);
      } catch (error) {
        setToolMessages((prev) => [
          ...prev,
          {
            id: `tool-error-${Date.now()}`,
            conversationId: '',
            content: `Tool failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            role: 'assistant',
            createdAt: new Date(),
            source: [],
          },
        ]);
      }

      setSelectedTool(null);
      setText('');
      clearAllFiles();
      return;
    }

    if (trimmed && !isSearching) {
      try {
        const response: any = await searchDocs(trimmed);
        if (response && response.conversationId) {
          router.push(`/chat/${response.conversationId}`);
        }
      } catch (error) {
        console.error('Error starting conversation:', error);
      }
      setText('');
      clearAllFiles();
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addFiles(files);
    }
  };

  return (
    <DragDropWrapper
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top bar */}
      <TopBar title="Chat" />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 relative" style={{ backgroundColor: '#212121' }}>
        <SearchResults
          searchResults={[
            ...searchResults.map((result, index) => ({
              id: `search-${index}`,
              conversationId: '',
              content: result.answer,
              role: 'assistant' as const,
              createdAt: new Date(),
              source: result.sources || [],
            })),
            ...toolMessages,
          ]}
          thinkingProcess={thinkingProcess}
        />

        <InputBar
          text={text}
          setText={setText}
          onSend={handleSend}
          isBusy={isSearching || isToolRunning}
          attachedFiles={attachedFiles}
          isUploading={isUploading}
          onRemoveFile={removeFile}
          onClearAllFiles={clearAllFiles}
          selectedTool={selectedTool}
          onToolSelected={setSelectedTool}
        />
      </div>

      {/* Tools palette */}
     
    </DragDropWrapper>
  );
}
