import { Plus, Send, X, Sparkles } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { AttachedFile } from '@/hooks/useFileUpload';
import { ToolsMenu } from './ToolsMenu';
import { useState } from 'react';
import { ITool } from '@/types';

interface InputBarProps {
  text: string;
  setText: (text: string) => void;
  onSend: (tool?: ITool | null) => void;
  isBusy: boolean;
  attachedFiles: AttachedFile[];
  isUploading: boolean;
  onRemoveFile: (index: number) => void;
  onClearAllFiles: () => void;
  selectedTool: ITool | null;
  onToolSelected?: (tool: ITool | null) => void;
}

export const InputBar = ({
  text,
  setText,
  onSend,
  isBusy,
  attachedFiles,
  isUploading,
  onRemoveFile,
  onClearAllFiles,
  selectedTool,
  onToolSelected,
}: InputBarProps) => {
  const [toolBarOpen, setToolBarOpen] = useState(false);

  const handleToolPick = (tool: ITool) => {
    setToolBarOpen(false);
    onToolSelected?.(tool);
  };

  const handleToolClear = () => {
    onToolSelected?.(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const hasText = Boolean(text.trim());
      if ((hasText || selectedTool) && !isBusy) {
        onSend(selectedTool);
      }
    }
  };

  const canSend = !isBusy && (Boolean(text.trim()) || Boolean(selectedTool));

  return (
    <div className="absolute bottom-0 left-0 right-0 pb-6 px-6 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div
          className={`flex flex-col bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-visible transition-all duration-300 shadow-2xl ${
            attachedFiles.length > 0 ? 'py-3' : text.split('\n').length > 1 ? 'h-auto min-h-[60px]' : 'h-14'
          }`}
        >
          {/* File Upload Section */}
          {attachedFiles.length > 0 && (
            <div className="px-3 pb-2 border-b border-white/10">
              <FileUpload
                attachedFiles={attachedFiles}
                isUploading={isUploading}
                onRemoveFile={onRemoveFile}
                onClearAllFiles={onClearAllFiles}
              />
            </div>
          )}

          <div className={`flex items-center gap-2 relative ${attachedFiles.length > 0 ? 'pt-2' : ''}`}>
            {/* Add/Tool Button */}
            <div className="relative ml-3">
              {!selectedTool ? (
                <button
                  onClick={() => setToolBarOpen(!toolBarOpen)}
                  className="p-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 flex-shrink-0 group border border-white/10 hover:scale-110 hover:shadow-lg"
                  aria-label="Add attachment or choose tool"
                >
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              ) : (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 backdrop-blur-xl group hover:shadow-lg transition-all duration-300">
                    <button 
                      onClick={handleToolClear} 
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                      aria-label="Clear selected tool"
                    >
                      <X size={16} className="text-gray-300 hover:text-white" />
                    </button>
                    <selectedTool.icon className="text-purple-400" size={18} />
                    <div className="text-sm font-semibold text-white flex items-center gap-1">
                      {selectedTool.label}
                      <Sparkles size={12} className="text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Tools Menu - Positioned above button */}
              {toolBarOpen && (
                <div className="absolute bottom-full left-0 mb-2 animate-slideUp z-50">
                  <ToolsMenu
                    onClose={() => setToolBarOpen(false)}
                    onPick={handleToolPick}
                  />
                </div>
              )}
            </div>

            {/* Textarea Input */}
            <div className="flex-1 relative px-2">
              <textarea
                value={text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="w-full bg-transparent text-white placeholder-gray-400 border-none outline-none py-3.5 text-sm resize-none overflow-hidden"
                style={{ height: 'auto', minHeight: '24px' }}
                rows={1}
              />
            </div>

            {/* Send Button */}
            <div className="pr-3 flex items-center">
              <button
                onClick={() => onSend(selectedTool)}
                disabled={!canSend}
                className={`p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  canSend
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-2xl hover:scale-110'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                {/* Shimmer Effect on Hover */}
                {canSend && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                )}
                
                {/* Send Icon with Animation */}
                <Send 
                  size={18} 
                  className={`relative z-10 transition-all duration-300 ${
                    canSend ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''
                  }`}
                />

                {/* Pulse Ring on Active */}
                {canSend && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 animate-ping opacity-20"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Character Count or Hint */}
        {text.length > 0 && (
          <div className="mt-2 text-center text-xs text-gray-500 animate-fadeIn">
            Press Enter to send, Shift+Enter for new line
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Custom Scrollbar for Textarea */
        textarea::-webkit-scrollbar {
          width: 4px;
        }

        textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};
