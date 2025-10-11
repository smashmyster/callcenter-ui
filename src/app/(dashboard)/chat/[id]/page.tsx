"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChatMessages } from '@/components/ChatMessages';
import { InputBar } from '@/components/InputBar';
import { DragDropWrapper } from '@/components/DragDropWrapper';
import { ToolsMenu } from '@/components/ToolsMenu';
import { TopBar } from '@/components/TopBar';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSearch } from '@/hooks/useSearch';
import { Message } from '@/types';
import { X, ExternalLink, Download, FileText, Volume2 } from 'lucide-react';
import { API_BASE_URL } from '@/types/contstants';

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
  const [sourcesPanelOpen, setSourcesPanelOpen] = useState(false);
  const [currentSources, setCurrentSources] = useState<any[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/chat/get-conversation-messages?conversationId=${conversationId}`).then(res => res.json()).then(data => setChatMessages(data));
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
        const response = await searchDocs(userMessage, conversationId, fileIds);
        // Add the response directly to the chat messages
        if (response) {
          setChatMessages(prev => [...prev, response]);
          // Set sources for the sources panel
          if (response.source && response.source.length > 0) {
            setCurrentSources(response.source);
          }
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

  const handleShowSources = (messageId: string, sources: any[]) => {
    setCurrentSources(sources);
    setSelectedMessageId(messageId);
    setSourcesPanelOpen(true);
  };

  return (
    <DragDropWrapper
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 " style={{ backgroundColor: '#212121' }}>
        <h1 className="text-white text-xl font-semibold">Chat - {conversationId}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSourcesPanelOpen(!sourcesPanelOpen)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
          </button>
        </div>
      </div>

      {/* Main content with sources panel */}
      <div className="flex-1 flex overflow-hidden" style={{ backgroundColor: '#212121' }}>
        {/* Main chat area */}
        <div className="flex-1 overflow-auto p-6 relative" style={{ backgroundColor: '#212121' }}>
          <ChatMessages
            messages={chatMessages}
            thinkingProcess={thinkingProcess}
            onShowSources={handleShowSources}
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

        {/* Sources Panel */}
        {sourcesPanelOpen && (
          <div className="w-80 border-l border-gray-700 flex flex-col">
            {/* Sources Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-t border-gray-700">
              <div>
                <h3 className="text-white font-semibold text-lg">Sources</h3>
              </div>
              <button
                onClick={() => setSourcesPanelOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sources List */}
            <div className="flex-1 overflow-y-auto p-4">
              {currentSources.length > 0 ? (
                <div className="space-y-4">
                  {currentSources.map((source, index) => (
                    <div key={index} className="rounded-lg p-4  border-gray-600">
                      {/* Source Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {source.type === "file.audio" ? (
                            <Volume2 size={16} className="text-blue-400" />
                          ) : (
                            <FileText size={16} className="text-green-400" />
                          )}
                          <span className="text-white text-sm font-medium">
                            {source.type === "file.audio" ? "Audio" : "Document"}
                          </span>
                        </div>

                        {/* Download button for documents */}
                        {source.key && source.type !== "file.audio" && (
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = source.key;
                              link.download = source.title;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            title="Download document"
                          >
                            <Download size={14} />
                          </button>
                        )}
                      </div>

                      {/* Source Title */}
                      <h4 className="text-white font-medium text-sm mb-2 leading-tight">
                        {source.title}
                      </h4>

                      {/* Source Content */}
                      {source.type === "file.audio" && source.key ? (
                        <div className="mb-3">
                          <audio controls className="w-full h-8">
                            <source src={source.key} type="audio/mpeg" />
                            <source src={source.key} type="audio/wav" />
                            <source src={source.key} type="audio/ogg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ) : (
                        <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                          {source.snippet}
                        </p>
                      )}

                      {/* Source Footer */}
                      <div className="mt-3 pt-2  border-gray-600">
                        <div className="flex items-center justify-between">
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-xs flex items-center space-x-1"
                            >
                              <span>View</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No sources available</p>
                  <p className="text-sm">Sources will appear here when you ask questions</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tools palette */}
     
    </DragDropWrapper>
  );
}
