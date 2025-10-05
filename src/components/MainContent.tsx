import { useState } from 'react';
import { SearchResults } from './SearchResults';
import { InputBar } from './InputBar';
import { DragDropWrapper } from './DragDropWrapper';
import { ToolsMenu } from './ToolsMenu';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSearch } from '@/hooks/useSearch';
import DocumentsPage from '@/app/documents/page';

interface MainContentProps {
  active: string;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  clickPosition: { x: number; y: number };
  toolsOpen: boolean;
  setToolsOpen: (open: boolean) => void;
  onPickTool: (clickPosition?: { x: number; y: number }) => void;
}

export const MainContent = ({
  active,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  clickPosition,
  toolsOpen,
  setToolsOpen,
  onPickTool
}: MainContentProps) => {
  const { searchResults, isSearching, thinkingProcess, searchDocs } = useSearch();
  const {
    attachedFiles,
    isUploading,
    removeFile,
    clearAllFiles
  } = useFileUpload();

  const [text, setText] = useState("");

  // Handle search with text input
  const handleSearch = () => {
    if (text.trim() && !isSearching) {
      searchDocs(text);
      setText('');
      clearAllFiles();
    }
  };

  // Handle click to open tools menu
  const handleClick = (e: React.MouseEvent) => {
    // Only handle clicks for chat tab
    if (active === 'chat') {
      // Capture click position
      const clickPosition = { x: e.clientX, y: e.clientY };
      setToolsOpen(true);
      // Pass the click position to parent component
      if (onPickTool) {
        onPickTool(clickPosition);
      }
    }
  };

  const renderContent = () => {
    switch (active) {
      case 'chat':
        return (
          <div
            className="flex-1 overflow-auto p-6 relative"
            style={{ backgroundColor: '#212121' }}
          >
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
              openTools={(open: React.MouseEvent) => handleClick(open)}
            />
          </div>
        );

      case 'history':
        return (
          <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-white text-2xl font-bold mb-6">Chat History</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-300">Your conversation history will appear here.</p>
              </div>
            </div>
          </div>
        );

      case 'policies':
        return (
          <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-300">Company policies and compliance documents will appear here.</p>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
         <DocumentsPage />
        );

      case 'settings':
        return (
          <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      defaultValue="http://localhost:8787"
                      className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium">Theme</label>
                    <select className="w-full mt-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                      <option>Dark</option>
                      <option>Light</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#212121' }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-white text-2xl font-bold mb-6">Welcome</h2>
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-300">Select a tab from the sidebar to get started.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DragDropWrapper
      isDragOver={isDragOver}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Top bar */}
      <div className="h-14 bg-[#212121] flex items-center px-4 justify-between border-b border-b-[#303030]">
        <div className="font-semibold">
          {active === 'chat' && 'Chat'}
          {active === 'history' && 'History'}
          {active === 'policies' && 'Policies'}
          {active === 'documents' && 'Documents'}
          {active === 'settings' && 'Settings'}
        </div>
        <div className="text-xs text-gray-500"></div>
      </div>

      {/* Main content */}
      {renderContent()}

      {/* Tools palette - only show for chat */}
      {toolsOpen && active === 'chat' && (
        <ToolsMenu
          onClose={() => setToolsOpen(false)}
          onPick={(toolId: string) => {
            console.log("Picked tool:", toolId);
            setToolsOpen(false);
          }}
          clickPosition={clickPosition}
        />
      )}
    </DragDropWrapper>
  );
};
