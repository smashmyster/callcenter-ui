"use client";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Tab = { id: string; label: string; icon?: React.ReactNode };

export function Sidebar({ tabs, active, onSelect }: {
  tabs: Tab[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="h-14 flex items-center px-4 justify-between">
        {!isCollapsed && <div className="font-semibold">Copilot</div>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[#303030] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="p-2 space-y-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
              active === t.id
                ? "bg-[#303030] text-white"
                : "hover:bg-[#303030] text-gray-300",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? t.label : undefined}
          >
            {t.icon}
            {!isCollapsed && <span>{t.label}</span>}
          </button>
        ))}
      </nav>

    </aside >
  );
}
