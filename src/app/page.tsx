"use client";

import React, { useState } from "react";
import { SidebarHistory } from "@/components/SidebarHistory";
import { ChatContainer } from "@/components/ChatContainer";
import { SettingsPanel } from "@/components/SettingsPanel";

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <SidebarHistory
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <ChatContainer onOpenSidebar={() => setIsSidebarOpen(true)} />
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
