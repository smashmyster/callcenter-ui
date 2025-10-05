"use client";

import { useState } from "react";
import { PhoneCall, Search, FileText, Settings } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";

const tabs = [
  { id: "chat", label: "Chat", icon: <PhoneCall size={18} /> },
  { id: "history", label: "History", icon: <Search size={18} /> },
  { id: "policies", label: "Policies", icon: <FileText size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  { id: "documents", label: "Documents", icon: <FileText size={18} /> },
];

export default function HomePage() {
  const [active, setActive] = useState("chat");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [clickPosition] = useState({ x: 0, y: 0 });

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
    // Drop handling is now managed by MainContent component
  };

  const handlePickTool = () => {
    setToolsOpen(false);
  };

  return (
    <div className="h-screen flex bg-[#181818]">
      <Sidebar tabs={tabs} active={active} onSelect={setActive} />

      <div className="flex-1">
        <MainContent
          active={active}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          clickPosition={clickPosition}
          toolsOpen={toolsOpen}
          setToolsOpen={setToolsOpen}
          onPickTool={handlePickTool}
        />
      </div>
    </div>
  );
}
