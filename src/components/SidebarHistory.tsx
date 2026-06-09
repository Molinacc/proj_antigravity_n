"use client";

import React, { useState } from "react";
import { useChat, Conversation } from "@/context/ChatContext";
import { UserProfile } from "./UserProfile";
import { 
  Plus, MessageSquare, Trash2, Library, BookOpen, 
  Code, PenTool, ClipboardList, PanelLeftClose, PanelLeft
} from "lucide-react";

interface SidebarHistoryProps {
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const CATEGORY_MAP = {
  all: { label: "Todos", icon: <MessageSquare size={16} />, color: "text-slate-400" },
  atendimento: { label: "Atendimento", icon: <Library size={16} />, color: "text-blue-400" },
  estudos: { label: "Estudos", icon: <BookOpen size={16} />, color: "text-amber-400" },
  programacao: { label: "Programação", icon: <Code size={16} />, color: "text-emerald-400" },
  conteudo: { label: "Conteúdo", icon: <PenTool size={16} />, color: "text-pink-400" },
  produtividade: { label: "Produtividade", icon: <ClipboardList size={16} />, color: "text-indigo-400" },
};

export const SidebarHistory: React.FC<SidebarHistoryProps> = ({ 
  onOpenSettings, 
  isSidebarOpen, 
  setIsSidebarOpen 
}) => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    createConversation, 
    deleteConversation 
  } = useChat();
  
  const [selectedFilter, setSelectedFilter] = useState<Conversation["category"]>("all");

  const filteredConversations = conversations.filter(
    (c) => selectedFilter === "all" || c.category === selectedFilter
  );

  return (
    <>
      {/* Mobile Toggle Button (when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2.5 rounded-xl glass-panel shadow-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground md:hidden transition-all duration-200"
          aria-label="Abrir Menu"
        >
          <PanelLeft size={20} />
        </button>
      )}

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar history drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 glass-sidebar flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse" />
            <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Orion AI Hub
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-foreground md:hidden transition-colors"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              createConversation(selectedFilter);
              // close on mobile
              if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all font-semibold text-sm group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Nova Conversa</span>
          </button>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Categorias de Foco
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedFilter(key as Conversation["category"])}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                  selectedFilter === key
                    ? "bg-slate-200/60 dark:bg-slate-800 border-primary/50 text-foreground"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-slate-800/30"
                }`}
                title={cat.label}
              >
                <span className={`${cat.color} mb-1`}>{cat.icon}</span>
                <span className="text-[10px] truncate max-w-full font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Histórico Recente
          </p>
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
              Nenhuma conversa nesta categoria.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const catInfo = CATEGORY_MAP[conv.category] || CATEGORY_MAP.all;
              return (
                <div
                  key={conv.id}
                  className={`group relative flex items-center rounded-xl p-3 cursor-pointer text-sm font-medium transition-all ${
                    isActive
                      ? "bg-slate-200/50 dark:bg-slate-800/80 text-foreground"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/20 dark:hover:bg-slate-800/20"
                  }`}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <span className={`${catInfo.color} mr-2.5 shrink-0`}>
                    {catInfo.icon}
                  </span>
                  <span className="truncate flex-1 pr-6">{conv.title}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="absolute right-2.5 opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-300/30 dark:hover:bg-slate-900/40 transition-all"
                    title="Excluir Conversa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile / Settings Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-950/20">
          <UserProfile onOpenSettings={onOpenSettings} />
        </div>
      </aside>
    </>
  );
};
