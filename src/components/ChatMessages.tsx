import { Message } from '@/types';
import { useState } from 'react';
import Markdown from './Markdown';
import { FileText, Volume2, Download, ExternalLink } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  thinkingProcess: string[];
  onShowSources: (messageId: string, sources: any[]) => void;
}

export const ChatMessages = ({ messages, thinkingProcess, onShowSources }: ChatMessagesProps) => {
  return (
    <div className="w-full max-h-[70vh] overflow-y-auto">
      {messages.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-12">
          {messages.map((message, messageIndex) => (
            <div key={messageIndex} className="space-y-8">
              {/* Query on the right */}
              {message.role === "user" ? (
                <div className="text-white text-md text-right">
                  <span className="bg-[#2E2E2E] rounded-xl p-4 inline-block">
                    <span className=" text-sm">{message.content}</span>
                  </span>
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
          ))}
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
