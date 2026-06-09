"use client";

import React, { useState } from "react";
import { useChat, Conversation } from "@/context/ChatContext";
import { UserProfile } from "./UserProfile";
import {
  Plus, MessageSquare, Trash2, Library, BookOpen,
  Code, PenTool, ClipboardList, X
} from "lucide-react";

interface SidebarHistoryProps {
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

type Category = Conversation["category"];

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "all",          label: "Todos",        icon: <MessageSquare size={14} /> },
  { key: "atendimento",  label: "Atendimento",  icon: <Library size={14} /> },
  { key: "estudos",      label: "Estudos",      icon: <BookOpen size={14} /> },
  { key: "programacao",  label: "Programação",  icon: <Code size={14} /> },
  { key: "conteudo",     label: "Conteúdo",     icon: <PenTool size={14} /> },
  { key: "produtividade",label: "Produtividade",icon: <ClipboardList size={14} /> },
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
          height: "54px",
          minHeight: "54px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "var(--primary)",
              display: "inline-block",
            }} />
            <span style={{
              fontWeight: 700, fontSize: "0.95rem",
              color: "var(--text)",
            }}>
              Orion AI
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              display: "none",
              padding: "0.35rem",
              borderRadius: "4px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
            className="sidebar-close-btn"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* New chat button */}
        <div style={{ padding: "0.75rem 0.875rem 0.5rem", flexShrink: 0 }}>
          <button
            onClick={handleNew}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.5rem", width: "100%", padding: "0.5rem 1rem",
              background: "var(--primary)", color: "#fff",
              border: "none", borderRadius: "6px",
              fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--primary-hover)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--primary)")}
          >
            <Plus size={15} />
            Nova Conversa
          </button>
        </div>

        {/* Category filters */}
        <div style={{ padding: "0.25rem 0.875rem 0.5rem", flexShrink: 0 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem" }}>
            Filtros
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.25rem" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedFilter(cat.key)}
                title={cat.label}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "0.4rem 0.2rem", borderRadius: "4px",
                  border: "1px solid " + (selectedFilter === cat.key ? "var(--primary)" : "var(--border)"),
                  background: selectedFilter === cat.key ? "var(--primary)" : "var(--bg)",
                  cursor: "pointer", transition: "all 0.1s",
                  color: selectedFilter === cat.key ? "#ffffff" : "var(--text-muted)",
                  gap: "0.15rem",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>{cat.icon}</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0.25rem 0.625rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.375rem", paddingLeft: "0.25rem" }}>
            Conversas
          </p>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Sem histórico
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
                    padding: "0.45rem 0.5rem", borderRadius: "4px",
                    cursor: "pointer", marginBottom: "0.15rem",
                    background: isActive ? "var(--bg)" : "transparent",
                    border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                    transition: "background 0.1s",
                    position: "relative",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-subtle)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  className="conv-item"
                >
                  <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{cat.icon}</span>
                  <span style={{
                    flex: 1, fontSize: "0.8rem", fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--primary)" : "var(--text)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {conv.title}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteConversation(conv.id); }}
                    title="Excluir"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", padding: "0.15rem", borderRadius: "3px",
                      flexShrink: 0, opacity: 0, transition: "opacity 0.1s, color 0.1s",
                    }}
                    className="delete-btn"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User profile footer */}
        <div style={{
          padding: "0.625rem 0.875rem",
          borderTop: "1px solid var(--border)",
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
