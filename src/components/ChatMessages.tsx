import { Message, FileAttachment } from '@/types';
import { useState } from 'react';
import Markdown from './Markdown';
import { FileText, Volume2, Download, ExternalLink, Paperclip } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  thinkingProcess: string[];
  onShowSources: (messageId: string, sources: any[]) => void;
}

export const ChatMessages = ({ messages, thinkingProcess, onShowSources }: ChatMessagesProps) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('audio/')) return Volume2;
    if (mimeType.startsWith('image/')) return FileText;
    if (mimeType.includes('pdf')) return FileText;
    if (mimeType.includes('word') || mimeType.includes('document')) return FileText;
    return FileText;
  };
  console.log("messages", messages);
  return (
    <div className="w-full max-h-[70vh] overflow-y-auto">
      {messages.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          {messages.map((message, messageIndex) => {
            if(message.role === "user") {
              console.log("message", message);
            }
            return (
            <div key={messageIndex} className="space-y-8">
              {/* Query on the right */}
              {message.role === "user" ? (
                <div className="text-white text-md text-right">
                   {message.messageAttachments && message.messageAttachments.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2 justify-end ">
                        {message.messageAttachments.map((attachment, index) => {
                          const FileIcon = getFileIcon(attachment.mimeType);
                          return (
                            <div key={index} className="flex items-center gap-2 bg-[#111112]rounded-lg px-3 py-2 text-sm hover:bg-gray-600 transition-colors bg-[#2E2E2E] rounded-xl p-4 min-w-[20vh] justify-between">
                              <FileIcon size={16} className="text-blue-400" />
                              <div className="flex flex-col">
                                <span className="text-white font-medium truncate max-w-[200px]">
                                  {attachment.name}
                                </span>
                              
                              </div>
                              <button
                                onClick={() => window.open(attachment.path, '_blank')}
                                className="ml-2 p-1 rounded hover:bg-gray-600 transition-colors"
                                title="Download file"
                              >
                                <Download size={14} className="text-gray-400" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  <div className="bg-[#2E2E2E] rounded-xl p-4 inline-block max-w-full">
                    <span className="text-sm">{message.content}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="max-w-[80vw]">
                    <Markdown content={message.content} />
                  </div>
                  
                  {/* Sources button and sources display */}
                  {message.source && message.source.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => onShowSources(message.id, message.source||[])}
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        <FileText size={16} />
                        <span>Sources ({message.source.length})</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          )}
        </div>
      )}

      {/* Thinking process - below messages */}
      {thinkingProcess.length > 0 && (
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-gray-300 text-sm">
                {thinkingProcess[thinkingProcess.length - 1]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

