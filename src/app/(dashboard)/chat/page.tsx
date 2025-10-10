"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResults } from '@/components/SearchResults';
import { InputBar } from '@/components/InputBar';
import { DragDropWrapper } from '@/components/DragDropWrapper';
import { ToolsMenu } from '@/components/ToolsMenu';
import { TopBar } from '@/components/TopBar';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSearch } from '@/hooks/useSearch';

export default function ChatPage() {
  const router = useRouter();
  const { searchResults, isSearching, thinkingProcess, searchDocs } = useSearch();
  const {
    attachedFiles,
    isUploading,
    removeFile,
    clearAllFiles,
    addFiles,
  } = useFileUpload();

  const [text, setText] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle search with text input
  const handleSearch = async () => {
    if (text.trim() && !isSearching) {
      try {
        const response = await searchDocs(text);
        // Navigate to the conversation page with the conversation ID
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

  // Handle click to open tools menu
  const handleClick = (e: React.MouseEvent) => {
    // Capture click position
    const clickPosition = { x: e.clientX, y: e.clientY };
    setClickPosition(clickPosition);
    setToolsOpen(true);
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
          searchResults={searchResults}
          thinkingProcess={thinkingProcess}
        />

        <InputBar
          text={text}
          setText={setText}
          onSend={handleSearch}
          isSearching={isSearching}
          attachedFiles={attachedFiles}
          isUploading={isUploading}
          onRemoveFile={removeFile}
          onClearAllFiles={clearAllFiles}
          openTools={handleClick}
        />
      </div>

      {/* Tools palette */}
      {toolsOpen && (
        <ToolsMenu
          onClose={() => setToolsOpen(false)}
          onPick={(toolId: string) => {
            setToolsOpen(false);
          }}
          clickPosition={clickPosition}
        />
      )}
    </DragDropWrapper>
  );
}
