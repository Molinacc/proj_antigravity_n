"use client";

import React, { useState } from "react";
import { SidebarHistory } from "@/components/SidebarHistory";
import { ChatContainer } from "@/components/ChatContainer";
import { SettingsPanel } from "@/components/SettingsPanel";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground relative">
      {/* Sidebar history drawer */}
      <SidebarHistory 
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main chat window area */}
      <ChatContainer />

      {/* Settings popup panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}
