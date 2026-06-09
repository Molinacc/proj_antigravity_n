"use client";

import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { User, LogOut, Settings as SettingsIcon, Check } from "lucide-react";

interface UserProfileProps {
  onOpenSettings: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onOpenSettings }) => {
  const { userProfile, updateUserProfile, clearAllConversations } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  const handleSave = () => {
    updateUserProfile({ name, email });
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleClear = () => {
    if (confirm("Deseja apagar todo o histórico de conversas?")) {
      clearAllConversations();
      setIsOpen(false);
    }
  };

  const menuItemStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "0.625rem",
    width: "100%", padding: "0.5rem 0.625rem",
    background: "none", border: "none", borderRadius: "0.5rem",
    cursor: "pointer", fontSize: "0.825rem", color: "var(--foreground)",
    textAlign: "left", transition: "background 0.15s",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          width: "100%", padding: "0.5rem 0.625rem",
          background: "none", border: "none", borderRadius: "0.75rem",
          cursor: "pointer", transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(148,163,184,0.08)"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: "0.875rem",
        }}>
          {userProfile.name.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
          <p style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {userProfile.name}
          </p>
          <p style={{ fontSize: "0.7rem", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {userProfile.email}
          </p>
        </div>
      </button>

      {/* Popup menu */}
      {isOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setIsOpen(false)} />
          <div style={{
            position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0,
            zIndex: 50,
            background: "var(--card-bg)", backdropFilter: "blur(16px)",
            border: "1px solid var(--card-border)",
            borderRadius: "1rem", padding: "0.625rem",
            boxShadow: "0 -4px 32px rgba(0,0,0,0.15)",
          }}>
            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <div>
                  <label style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: "100%", padding: "0.5rem 0.625rem",
                      background: "rgba(0,0,0,0.08)", border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem", fontSize: "0.825rem", color: "var(--foreground)",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "0.5rem 0.625rem",
                      background: "rgba(0,0,0,0.08)", border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem", fontSize: "0.825rem", color: "var(--foreground)",
                      outline: "none",
                    }}
                  />
                </div>
                <button
                  onClick={handleSave}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
                    padding: "0.5rem", background: "var(--primary)", color: "#fff",
                    border: "none", borderRadius: "0.5rem", cursor: "pointer",
                    fontSize: "0.825rem", fontWeight: 600,
                  }}
                >
                  <Check size={14} />
                  Salvar
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                <button
                  style={menuItemStyle}
                  onClick={() => setIsEditing(true)}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(148,163,184,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <User size={15} style={{ color: "#94a3b8" }} />
                  Editar Perfil
                </button>
                <button
                  style={menuItemStyle}
                  onClick={() => { onOpenSettings(); setIsOpen(false); }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(148,163,184,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <SettingsIcon size={15} style={{ color: "#94a3b8" }} />
                  Configurações
                </button>
                <div style={{ borderTop: "1px solid var(--card-border)", margin: "0.25rem 0" }} />
                <button
                  style={{ ...menuItemStyle, color: "#ef4444" }}
                  onClick={handleClear}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <LogOut size={15} style={{ color: "#ef4444" }} />
                  Limpar Conversas
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
