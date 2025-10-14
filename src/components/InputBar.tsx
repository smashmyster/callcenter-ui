import { Plus, Send, X } from 'lucide-react';
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
    <div className="max-w-[60vw] mx-auto absolute bottom-6 left-0 right-0 px-6">
      <div
        className={`flex flex-col bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-200 ${
          attachedFiles.length > 0 ? 'py-3' : text.split('\n').length > 1 ? 'h-auto min-h-[60px]' : 'h-12'
        }`}
      >
        <FileUpload
          attachedFiles={attachedFiles}
          isUploading={isUploading}
          onRemoveFile={onRemoveFile}
          onClearAllFiles={onClearAllFiles}
        />

        <div className={`flex items-center ${attachedFiles.length > 0 ? 'mt-2' : ''}`}>
          {toolBarOpen && (
            <ToolsMenu
              onClose={() => setToolBarOpen(false)}
              onPick={handleToolPick}
            />
          )}

          {!selectedTool ? (
            <button
              onClick={() => setToolBarOpen(!toolBarOpen)}
              className="p-3 text-white hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label="Add attachment or choose tool"
            >
              <Plus size={16} />
            </button>
          ) : (
            <div>
              <div className="flex items-start gap-1 text-left p-3 rounded-lg bg-[#303030]">
                <button onClick={handleToolClear} className="pt-1 rounded hover:bg-[#3A3A3A]">
                  <X size={16} />
                </button>
                <selectedTool.icon className="mt-0.5 text-white" size={18} />
                <div>
                  <div className="text-sm font-medium text-white">{selectedTool.label}</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything."
              className="w-full min-h-[30vh] bg-transparent text-white placeholder-gray-400 border-none outline-none px-2 py-3 text-sm resize-none overflow-hidden"
              style={{ height: 'auto', minHeight: '24px' }}
              rows={1}
            />
          </div>

          <div className={`flex pr-3 ${text.split('\n').length > 1 ? 'flex-col gap-1' : 'flex-row items-center gap-1'}`}>
            <button
              onClick={() => onSend(selectedTool)}
              disabled={!canSend}
              className="p-2 text-white hover:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors rounded-full bg-white"
              aria-label="Send message"
            >
              <Send size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
