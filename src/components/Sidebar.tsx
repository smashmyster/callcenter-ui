"use client";

import { clsx } from "clsx";

type Tab = { id: string; label: string; icon?: React.ReactNode };

export function Sidebar({ tabs, active, onSelect }:{
  tabs: Tab[];
  active: string;
  onSelect: (id: string)=>void;
}) {
  return (
    <aside className="h-full border-r">
      <div className="h-14 flex items-center px-4 border-b">
        <div className="font-semibold">Copilot</div>
      </div>
      <nav className="p-2 space-y-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm",
              active === t.id
                ? "bg-indigo-50 text-indigo-700"
                : "hover:bg-gray-50 text-gray-700"
            )}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
        
    </aside>
  );
}
