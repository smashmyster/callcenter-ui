"use client";

import { useState } from "react";
import { PhoneCall, Search, FileText, Settings } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ToolsMenu } from "@/components/ToolsMenu";
import { SearchResults } from "@/components/SearchResults";
import { InputBar } from "@/components/InputBar";
import { DragDropWrapper } from "@/components/DragDropWrapper";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useSearch } from "@/hooks/useSearch";

const tabs = [
  { id: "chat", label: "Chat", icon: <PhoneCall size={18} /> },
  { id: "history", label: "History", icon: <Search size={18} /> },
  { id: "policies", label: "Policies", icon: <FileText size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function HomePage() {
  const [active, setActive] = useState("chat");
  const [text, setText] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Custom hooks
  const { searchResults, isSearching, thinkingProcess, searchDocs } = useSearch();
  const {
    attachedFiles,
    isUploading,
    uploadFiles,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFilesWithRemotePaths
  } = useFileUpload();

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
    setClickPosition({ x: e.clientX, y: e.clientY });
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log('Dropped files:', files.map(f => f.name));
      
      // Add all files to the attached files list
      addFiles(files);
      
      // Upload all files to backend in one request
      try {
        const result = await uploadFiles(files);
        console.log('Uploaded files:', result);
        
        // Update all files with their remote paths
        updateFilesWithRemotePaths(files, result.results);
        
        console.log('Files uploaded and stored successfully');
      } catch (error) {
        console.error('Failed to upload files:', error);
        // Optionally show user feedback here
      }
    }
  };

  return (
    <div className="h-screen grid grid-cols-[280px_1fr] bg-black">
      <Sidebar tabs={tabs} active={active} onSelect={setActive} />

      <DragDropWrapper
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Top bar */}
        <div className="h-14 border-b flex items-center px-4 justify-between">
          <div className="font-semibold">{tabs.find(t => t.id === active)?.label}</div>
          <div className="text-xs text-gray-500">NEXT_PUBLIC_API_BASE</div>
        </div>

        {/* Main content */}
        <div 
          className="flex-1 overflow-auto p-6 relative" 
          style={{ backgroundColor: '#212121' }}
          onClick={handleClick}
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
            openTools={(open:boolean) => setToolsOpen(open)}
          />
        </div>

        {/* Tools palette */}
        {toolsOpen && (
          <ToolsMenu 
            onClose={() => setToolsOpen(false)} 
            onPick={(tool) => {
              setToolsOpen(false);
              // do something with selected tool
              console.log("Picked tool:", tool);
            }}
            clickPosition={clickPosition}
          />
        )}
      </DragDropWrapper>
    </div>
  );
}
