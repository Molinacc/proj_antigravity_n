"use client";

import React, { useState } from "react";
import { useChat, Conversation } from "@/context/ChatContext";
import { UserProfile } from "./UserProfile";
import {
  Plus, MessageSquare, Trash2, Library, BookOpen,
  Code, PenTool, ClipboardList, X, Menu
} from "lucide-react";

interface SidebarHistoryProps {
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

type Category = Conversation["category"];

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "all",          label: "Todos",        icon: <MessageSquare size={14} />, color: "#94a3b8" },
  { key: "atendimento",  label: "Atendimento",  icon: <Library size={14} />,       color: "#60a5fa" },
  { key: "estudos",      label: "Estudos",      icon: <BookOpen size={14} />,      color: "#fbbf24" },
  { key: "programacao",  label: "Programação",  icon: <Code size={14} />,          color: "#34d399" },
  { key: "conteudo",     label: "Conteúdo",     icon: <PenTool size={14} />,       color: "#f472b6" },
  { key: "produtividade",label: "Produtividade",icon: <ClipboardList size={14} />, color: "#818cf8" },
];

export const SidebarHistory: React.FC<SidebarHistoryProps> = ({
  onOpenSettings,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
  } = useChat();

  const [selectedFilter, setSelectedFilter] = useState<Category>("all");

  const filtered = selectedFilter === "all"
    ? conversations
    : conversations.filter(c => c.category === selectedFilter);

  const handleSelect = (id: string) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  };

  const handleNew = () => {
    createConversation(selectedFilter);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          style={{ display: "block" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${isSidebarOpen ? " open" : ""}`}>
        {/* Top header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
          height: "56px",
          minHeight: "56px",
          borderBottom: "1px solid var(--sidebar-border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              display: "inline-block",
            }} />
            <span style={{
              fontWeight: 700, fontSize: "1rem",
              background: "linear-gradient(90deg, var(--primary), var(--secondary))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Orion AI
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              display: "none",
              padding: "0.375rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--foreground)",
            }}
            className="sidebar-close-btn"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* New chat button */}
        <div style={{ padding: "0.875rem 1rem 0.5rem", flexShrink: 0 }}>
          <button
            onClick={handleNew}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.5rem", width: "100%", padding: "0.625rem 1rem",
              background: "var(--primary)", color: "#fff",
              border: "none", borderRadius: "0.75rem",
              fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
              transition: "background 0.2s, transform 0.15s",
              boxShadow: "0 2px 12px rgba(99,102,241,0.25)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--primary-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--primary)")}
          >
            <Plus size={16} />
            Nova Conversa
          </button>
        </div>

        {/* Category filters */}
        <div style={{ padding: "0 1rem 0.625rem", flexShrink: 0 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            Categorias
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.375rem" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedFilter(cat.key)}
                title={cat.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "0.5rem 0.25rem", borderRadius: "0.625rem",
                  border: selectedFilter === cat.key ? "1px solid var(--primary)" : "1px solid transparent",
                  background: selectedFilter === cat.key ? "rgba(99,102,241,0.1)" : "transparent",
                  cursor: "pointer", transition: "all 0.15s",
                  color: selectedFilter === cat.key ? "var(--primary)" : "#94a3b8",
                  gap: "0.25rem",
                }}
              >
                <span style={{ color: cat.color }}>{cat.icon}</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 0.75rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem", paddingLeft: "0.25rem" }}>
            Histórico
          </p>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 0", fontSize: "0.75rem", color: "#94a3b8" }}>
              Nenhuma conversa ainda.
            </div>
          ) : (
            filtered.map(conv => {
              const cat = CATEGORIES.find(c => c.key === conv.category) || CATEGORIES[0];
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.5rem 0.625rem", borderRadius: "0.625rem",
                    cursor: "pointer", marginBottom: "0.25rem",
                    background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                    transition: "background 0.15s",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(148,163,184,0.08)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  className="conv-item"
                >
                  <span style={{ color: cat.color, flexShrink: 0 }}>{cat.icon}</span>
                  <span style={{
                    flex: 1, fontSize: "0.8rem", fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--primary)" : "var(--foreground)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {conv.title}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteConversation(conv.id); }}
                    title="Excluir"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", padding: "0.2rem", borderRadius: "0.375rem",
                      flexShrink: 0, opacity: 0, transition: "opacity 0.15s, color 0.15s",
                    }}
                    className="delete-btn"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User profile footer */}
        <div style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid var(--sidebar-border)",
          flexShrink: 0,
        }}>
          <UserProfile onOpenSettings={onOpenSettings} />
        </div>
      </aside>

      <style>{`
        .sidebar-close-btn { display: none !important; }
        @media (max-width: 767px) {
          .sidebar-close-btn { display: flex !important; }
        }
        .conv-item:hover .delete-btn { opacity: 1 !important; }
        .delete-btn:hover { color: #ef4444 !important; }
      `}</style>
    </>
  );
};
