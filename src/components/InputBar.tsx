import { Plus, Send, X } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { AttachedFile } from '@/hooks/useFileUpload';
import { ToolsMenu } from './ToolsMenu';
import { useState } from 'react';
import { ETools, ITool } from '@/types';

interface InputBarProps {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
  isSearching: boolean;
  attachedFiles: AttachedFile[];
  isUploading: boolean;
  onRemoveFile: (index: number) => void;
  onClearAllFiles: () => void;
  openTools: (open: React.MouseEvent) => void;
}

export const InputBar = ({
  text,
  setText,
  onSend,
  isSearching,
  attachedFiles,
  isUploading,
  onRemoveFile,
  onClearAllFiles,
}: InputBarProps) => {
  const [toolBarOpen, setToolBarOpen] = useState(false)
  const [toolInUse, setToolInUse] = useState<ITool | null>(null)
  console.log(toolInUse);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize the textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !isSearching) {
        onSend();
      }
    }
  };

  return (
    <div className="max-w-[60vw] mx-auto absolute bottom-6 left-0 right-0 px-6">
      <div className={`flex flex-col bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-200 ${attachedFiles.length > 0 ? 'py-3' : (text.split('\n').length > 1 ? 'h-auto min-h-[60px]' : 'h-12')
        }`}>
        {/* File attachments display */}
        <FileUpload
          attachedFiles={attachedFiles}
          isUploading={isUploading}
          onRemoveFile={onRemoveFile}
          onClearAllFiles={onClearAllFiles}
        />

        <div className={`flex items-center ${attachedFiles.length > 0 ? 'mt-2' : ''}`}>
          {/* Left button - Plus */}
          {toolBarOpen && <ToolsMenu onClose={() => { setToolBarOpen(false) }} onPick={(tool: ITool) => { setToolInUse(tool); setToolBarOpen(false) }} />
          }
         {!toolInUse? <button
            onClick={() => { setToolBarOpen(!toolBarOpen) }}

            className="p-3 text-white hover:bg-gray-700 transition-colors flex-shrink-0"
            aria-label="Add attachment"
          >
            <Plus size={16} />
          </button>:  
          <div>
            <div
              className="flex items-start gap-1 text-left p-3  rounded-lg bg-[#303030] "
            >
              <button onClick={()=>{setToolInUse(null)}} className="pt-1 rounded hover:bg-[#303030]"><X size={16} /></button>

              <toolInUse.icon className="mt-0.5 text-white" size={18} />
              <div>
                <div className="text-sm font-medium text-white  ">{toolInUse.label}</div>
              </div>

            </div>
          </div>}
          {/* Textarea in the middle */}
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

          {/* Right side buttons - changes layout based on content */}
          <div className={`flex pr-3 ${text.split('\n').length > 1 ? 'flex-col gap-1' : 'flex-row items-center gap-1'}`}>
            <button
              onClick={onSend}
              disabled={!text.trim() || isSearching}
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
