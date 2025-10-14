"use client";

import { useState } from "react";
import { PhoneCall, Search, FileText, Settings, LayoutDashboard, LogOut, User } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { id: "dashboard", label: "Dashbord", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { id: "chat", label: "Chat", icon: <PhoneCall size={18} />, href: "/chat" },
  { id: "settings", label: "Settings", icon: <Settings size={18} />, href: "/settings" },

];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen flex bg-[#181818]">
      <Sidebar tabs={tabs} />
      <div className="flex-1 flex flex-col">
        {/* Top Bar with User Info */}
        <div className="bg-[#212121] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-400 text-sm">
                {user?.organization?.name} • {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
