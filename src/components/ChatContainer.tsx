"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { Sparkles, BookOpen, Code, PenTool, ClipboardList, Menu } from "lucide-react";

interface ChatContainerProps {
  onOpenSidebar: () => void;
}

const QUICK_CARDS = [
  {
    title: "Assistente de Estudos",
    desc: "Resumos, exercícios e planos de estudo.",
    icon: <BookOpen size={16} style={{ color: "#d97706" }} />,
    prompt: "Me dê um resumo sobre a Segunda Guerra Mundial e crie 3 exercícios para fixação.",
  },
  {
    title: "Assistente de Programação",
    desc: "Gere, explique ou corrija código.",
    icon: <Code size={16} style={{ color: "#059669" }} />,
    prompt: "Como crio um Hook customizado em React para buscar dados de uma API com fetch, gerenciando loading e erro?",
  },
  {
    title: "Produção de Conteúdo",
    desc: "Posts, artigos, e-mails e textos.",
    icon: <PenTool size={16} style={{ color: "#db2777" }} />,
    prompt: "Escreva um post curto para LinkedIn divulgando o lançamento do Orion AI com foco em produtividade.",
  },
  {
    title: "Planejamento e Tarefas",
    desc: "Cronogramas, listas e projetos.",
    icon: <ClipboardList size={16} style={{ color: "#4f46e5" }} />,
    prompt: "Crie uma lista de tarefas semanais para o desenvolvimento de um aplicativo mobile com React Native.",
  },
];

export const ChatContainer: React.FC<ChatContainerProps> = ({ onOpenSidebar }) => {
  const { activeConversation, sendMessage, isResponding } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isResponding]);

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <main className="chat-main">
      {/* Header */}
      <header className="chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
          {/* Mobile menu toggle */}
          <button
            onClick={onOpenSidebar}
            style={{
              display: "none",
              padding: "0.375rem",
              borderRadius: "0.375rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--text)",
              flexShrink: 0,
            }}
            className="mobile-menu-btn"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <div style={{
            width: "24px", height: "24px", borderRadius: "4px", flexShrink: 0,
            background: "var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={12} color="#fff" />
          </div>

          <div style={{ minWidth: 0 }}>
            <p style={{
              fontWeight: 600, fontSize: "0.875rem",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              color: "var(--text)",
            }}>
              {activeConversation ? activeConversation.title : "Orion AI"}
            </p>
          </div>

          {activeConversation?.category && activeConversation.category !== "all" && (
            <span style={{
              fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase",
              padding: "0.15rem 0.4rem", borderRadius: "4px",
              background: "var(--bg-subtle)", color: "var(--text-muted)",
              border: "1px solid var(--border)", flexShrink: 0,
            }}>
              {activeConversation.category}
            </span>
          )}
        </div>

        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#10b981", display: "inline-block",
          }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }} className="status-text">
            Online
          </span>
        </div>
      </header>

      {/* Messages area */}
      <div className="chat-messages">
        {!hasMessages ? (
          /* Onboarding state */
          <div className="onboarding-wrap">
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "8px",
                background: "var(--primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "0.5rem",
              }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <h2 style={{
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "0.375rem",
                }}>
                  Orion AI
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: "340px", lineHeight: 1.5 }}>
                  Assistente virtual para estudos, programação, conteúdo e tarefas.
                </p>
              </div>
            </div>

            {/* Quick cards */}
            <div className="quick-cards-grid">
              {QUICK_CARDS.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(card.prompt)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "flex-start",
                    gap: "0.25rem", padding: "0.875rem",
                    background: "var(--bg-subtle)", border: "1px solid var(--border)",
                    borderRadius: "6px", cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--text-muted)";
                    e.currentTarget.style.background = "var(--bg)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "var(--bg-subtle)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.15rem" }}>
                    {card.icon}
                    <span style={{ fontWeight: 600, fontSize: "0.825rem", color: "var(--text)" }}>
                      {card.title}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {card.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message list */
          <div className="messages-inner">
            {activeConversation.messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isResponding && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer input */}
      <footer className="chat-footer">
        <div className="chat-footer-inner">
          <ChatInput onSendMessage={sendMessage} disabled={isResponding} />
          <p style={{ fontSize: "0.6875rem", textAlign: "center", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Orion AI pode apresentar imprecisões.
          </p>
        </div>
      </footer>

      <style>{`
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
          .status-text { display: none; }
        }
      `}</style>
    </main>
  );
};
