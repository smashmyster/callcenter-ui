"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SearchResults } from '@/components/SearchResults';
import { InputBar } from '@/components/InputBar';
import { DragDropWrapper } from '@/components/DragDropWrapper';
import { ToolsMenu } from '@/components/ToolsMenu';
import { TopBar } from '@/components/TopBar';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSearch } from '@/hooks/useSearch';
import { Message } from '@/types';

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id as string;
  
  const { searchResults, isSearching, thinkingProcess, searchDocs } = useSearch();
  const {
    attachedFiles,
    isUploading,
    removeFile,
    clearAllFiles,
    addFiles,
    getFileIds,
  } = useFileUpload();

  const [text, setText] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    fetch(`http://localhost:8787/chat/get-conversation-messages?conversationId=${conversationId}`).then(res => res.json()).then(data => setChatMessages(data));
  }, [conversationId]);
  // Handle search with text input
  const handleSearch = async () => {
    if (text.trim() && !isSearching) {
      const userMessage = text.trim();
      
      // Add user message immediately to the chat
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: conversationId,
        content: userMessage,
        role: 'user',
        createdAt: new Date(),
        source: []
      };
      setChatMessages(prev => [...prev, tempUserMessage]);
      
      // Get file IDs before clearing
      const fileIds = getFileIds();
      
      // Clear input and files
      setText('');
      clearAllFiles();
      
      // Send the message and add response to chat
      try {
        console.log("userMessage", userMessage, conversationId, "fileIds", fileIds);
        const response = await searchDocs(userMessage, conversationId, fileIds);
        // Add the response directly to the chat messages
        if (response) {
          setChatMessages(prev => [...prev, response]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove the temp message if there was an error
        setChatMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
      }
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
      addFiles(files, conversationId);
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
      <TopBar title={`Chat - ${conversationId}`} />

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 relative" style={{ backgroundColor: '#212121' }}>
        <SearchResults
          searchResults={chatMessages}
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
