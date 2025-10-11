"use client";

import { useState } from "react";
import { PhoneCall, Search, FileText, Settings, LayoutDashboard } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const tabs = [
  { id: "dashboard", label: "Dashbord", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { id: "chat", label: "Chat", icon: <PhoneCall size={18} />, href: "/chat" },
  { id: "settings", label: "Settings", icon: <Settings size={18} />, href: "/settings" },

];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen flex bg-[#181818]">
      <Sidebar tabs={tabs} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
