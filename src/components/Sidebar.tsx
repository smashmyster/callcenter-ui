"use client";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Conversation } from "@/types";
import { API_BASE_URL } from "@/types/contstants";

type Tab = { id: string; label: string; icon?: React.ReactNode; href: string };

export function Sidebar({ tabs }: { tabs: Tab[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/chat/get-all-conversations`).then(res => res.json()).then(data => setConversations(data));
  }, []);
  return (
    <aside className={`h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} max-h-screen overflow-y-auto`}>
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
          <Link
            key={t.id}
            href={t.href}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
              pathname === t.href
                ? "bg-[#303030] text-white"
                : "hover:bg-[#303030] text-gray-300",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? t.label : undefined}
          >
            {t.icon}
            {!isCollapsed && <span>{t.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-2 space-y-1">
        {conversations.map((t) => (
          <Link
            key={t.id}
            href={`/chat/${t.id}`}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200",
              pathname === `/chat/${t.id}`
                ? "bg-[#303030] text-white"
                : "hover:bg-[#303030] text-gray-300",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? t.title : undefined}
          >
            {!isCollapsed && <span>{t.title}</span>}
          </Link>
        ))}
      </div>

    </aside >
  );
}
