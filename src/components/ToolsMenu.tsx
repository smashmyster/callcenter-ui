"use client";

import { X, Mic, FileUp, Sparkles, ShieldCheck, Ticket, Search, BookOpen } from "lucide-react";

const tools = [
  { id: "stt", label: "Transcribe Audio", icon: Mic, desc: "Upload and transcribe a call" },
  { id: "upload", label: "Upload Document", icon: FileUp, desc: "Add policy or call artifacts" },
  { id: "summarize", label: "Summarize", icon: Sparkles, desc: "Summarize text for analytics" },
  { id: "audit", label: "Policy Audit", icon: ShieldCheck, desc: "Check against policies" },
  { id: "jira", label: "Create Jira", icon: Ticket, desc: "Open a ticket for follow-up" },
  { id: "search", label: "Semantic Search", icon: Search, desc: "Find similar calls" },
  { id: "policies", label: "Browse Policies", icon: BookOpen, desc: "Search policy sections" },
];

export function ToolsMenu({ onClose, onPick, clickPosition }:{
  onClose: ()=>void;
  onPick: (toolId: string)=>void;
  clickPosition: { x: number; y: number };
}) {
  // Calculate position to keep menu within viewport
  const menuWidth = 420;
  const menuHeight = 300; // Approximate height
  const padding = 20;
  
  const left = Math.min(
    Math.max(clickPosition.x - menuWidth / 2, padding),
    window.innerWidth - menuWidth - padding
  );
  
  const top = Math.min(
    Math.max(clickPosition.y - menuHeight - 10, padding),
    window.innerHeight - menuHeight - padding
  );

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] bg-black" onClick={onClose}>
      <div
        className="absolute w-[420px] bg-white rounded-2xl shadow-xl border p-3"
        style={{
          left: `${left}px`,
          top: `${top}px`,
        }}
        onClick={(e)=>e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm font-medium">Tools</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X size={16}/></button>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          {tools.map(T => (
            <button
              key={T.id}
              onClick={() => onPick(T.id)}
              className="flex items-start gap-3 text-left p-3 rounded-xl hover:bg-gray-50 border"
            >
              <T.icon className="mt-0.5" size={18} />
              <div>
                <div className="text-sm font-medium">{T.label}</div>
                <div className="text-xs text-gray-500">{T.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
