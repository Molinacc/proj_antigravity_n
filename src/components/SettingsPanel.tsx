"use client";

import React, { useState } from "react";
import { useChat, Theme } from "@/context/ChatContext";
import { X, Sun, Moon, Monitor, Key, Sliders, Settings } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme, settings, updateSettings } = useChat();
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ apiKey, model, systemPrompt });
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
  };

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light",  label: "Claro",   icon: <Sun size={14} /> },
    { value: "dark",   label: "Escuro",  icon: <Moon size={14} /> },
    { value: "system", label: "Sistema", icon: <Monitor size={14} /> },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.625rem 0.75rem",
    background: "rgba(0,0,0,0.06)", border: "1px solid var(--card-border)",
    borderRadius: "0.625rem", fontSize: "0.85rem", color: "var(--foreground)",
    outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.06em",
    display: "flex", alignItems: "center", gap: "0.375rem",
    marginBottom: "0.5rem",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: "480px",
        background: "var(--card-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--card-border)",
        borderRadius: "1.25rem",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        maxHeight: "90vh",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.25rem",
          borderBottom: "1px solid var(--card-border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, var(--primary), #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Settings size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.975rem", color: "var(--foreground)" }}>
              Configurações do Orion AI
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#94a3b8", padding: "0.375rem", borderRadius: "0.5rem",
              transition: "color 0.15s, background 0.15s",
              display: "flex", alignItems: "center",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--foreground)"; e.currentTarget.style.background = "rgba(148,163,184,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "none"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSave} style={{ overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Theme */}
          <div>
            <label style={labelStyle}>Aparência</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {themeOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem",
                    padding: "0.625rem 0.5rem", borderRadius: "0.625rem",
                    border: theme === opt.value ? "2px solid var(--primary)" : "1px solid var(--card-border)",
                    background: theme === opt.value ? "rgba(99,102,241,0.12)" : "transparent",
                    color: theme === opt.value ? "var(--primary)" : "var(--foreground)",
                    cursor: "pointer", fontWeight: 600, fontSize: "0.8rem",
                    transition: "all 0.15s",
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <label style={labelStyle}>
              <Sliders size={13} />
              Modelo de IA
            </label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--card-border)"}
            >
              <option value="mock-orion">Orion Simulation Mode (Gratuito)</option>
              <option value="gpt-4o">OpenAI GPT-4o (Requer Chave)</option>
              <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo (Requer Chave)</option>
            </select>
          </div>

          {/* API Key */}
          <div>
            <label style={labelStyle}>
              <Key size={13} />
              Chave API OpenAI
              {model === "mock-orion" && (
                <span style={{
                  marginLeft: "auto", fontSize: "0.65rem", fontWeight: 400,
                  padding: "0.15rem 0.5rem", borderRadius: "9999px",
                  background: "rgba(148,163,184,0.15)", color: "#94a3b8",
                  textTransform: "none", letterSpacing: 0,
                }}>
                  Não necessária no modo simulação
                </span>
              )}
            </label>
            <input
              type="password"
              placeholder={model === "mock-orion" ? "Opcional" : "sk-..."}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--card-border)"}
            />
          </div>

          {/* System Prompt */}
          <div>
            <label style={labelStyle}>Instruções de Personalidade</label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--primary)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--card-border)"}
            />
          </div>

          {/* Footer buttons */}
          <div style={{
            display: "flex", gap: "0.625rem", justifyContent: "flex-end",
            paddingTop: "0.625rem", borderTop: "1px solid var(--card-border)",
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem", borderRadius: "0.625rem",
                border: "1px solid var(--card-border)", background: "transparent",
                color: "var(--foreground)", cursor: "pointer", fontSize: "0.85rem",
                fontWeight: 500, transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(148,163,184,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1.25rem", borderRadius: "0.625rem",
                border: "none", background: "var(--primary)",
                color: "#fff", cursor: "pointer", fontSize: "0.85rem",
                fontWeight: 600, transition: "background 0.15s",
                boxShadow: "0 2px 12px rgba(99,102,241,0.25)",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
            >
              {isSaved ? "✓ Salvo!" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
