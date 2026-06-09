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
    icon: <BookOpen size={18} style={{ color: "#fbbf24" }} />,
    prompt: "Me dê um resumo sobre a Segunda Guerra Mundial e crie 3 exercícios para fixação.",
  },
  {
    title: "Assistente de Programação",
    desc: "Gere, explique ou corrija código TypeScript, React, Python.",
    icon: <Code size={18} style={{ color: "#34d399" }} />,
    prompt: "Como crio um Hook customizado em React para buscar dados de uma API com fetch, gerenciando loading e erro?",
  },
  {
    title: "Produção de Conteúdo",
    desc: "Posts, artigos, e-mails e textos otimizados para SEO.",
    icon: <PenTool size={18} style={{ color: "#f472b6" }} />,
    prompt: "Escreva um post curto para LinkedIn divulgando o lançamento do Orion AI com foco em produtividade.",
  },
  {
    title: "Planejamento e Tarefas",
    desc: "Cronogramas, listas de tarefas e gestão de projetos.",
    icon: <ClipboardList size={18} style={{ color: "#818cf8" }} />,
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
      {/* Ambient glows - decorative only */}
      <div className="ambient-glow" style={{ background: "var(--primary)", top: "-60px", right: "-60px" }} />
      <div className="ambient-glow" style={{ background: "var(--secondary)", bottom: "0px", left: "-60px" }} />

      {/* Header */}
      <header className="chat-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", minWidth: 0 }}>
          {/* Mobile menu toggle */}
          <button
            onClick={onOpenSidebar}
            style={{
              display: "none",
              padding: "0.375rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--foreground)",
              flexShrink: 0,
            }}
            className="mobile-menu-btn"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <div style={{
            width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
            background: "linear-gradient(135deg, var(--primary), #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={14} color="#fff" />
          </div>

          <div style={{ minWidth: 0 }}>
            <p style={{
              fontWeight: 600, fontSize: "0.875rem",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              color: "var(--foreground)",
            }}>
              {activeConversation ? activeConversation.title : "Nova Conversa"}
            </p>
          </div>

          {activeConversation?.category && activeConversation.category !== "all" && (
            <span style={{
              fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
              padding: "0.2rem 0.5rem", borderRadius: "9999px",
              background: "rgba(99,102,241,0.12)", color: "var(--primary)",
              border: "1px solid rgba(99,102,241,0.2)", flexShrink: 0,
            }}>
              {activeConversation.category}
            </span>
          )}
        </div>

        {/* Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
          <span style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: "#10b981", display: "inline-block",
            boxShadow: "0 0 6px #10b981",
          }} />
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap" }} className="status-text">
            Orion Online
          </span>
        </div>
      </header>

      {/* Messages area */}
      <div className="chat-messages">
        {!hasMessages ? (
          /* Onboarding state */
          <div className="onboarding-wrap">
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.875rem" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "20px",
                background: "linear-gradient(135deg, var(--primary), #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
              }}>
                <Sparkles size={28} color="#fff" />
              </div>
              <div>
                <h2 style={{
                  fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
                  fontWeight: 800,
                  background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  marginBottom: "0.5rem",
                }}>
                  Olá! Eu sou o Orion AI
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", maxWidth: "380px", lineHeight: 1.6 }}>
                  Seu assistente virtual avançado. Pronto para ajudar com programação, estudos, conteúdo e muito mais.
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
                    gap: "0.375rem", padding: "1rem",
                    background: "var(--card-bg)", border: "1px solid var(--card-border)",
                    borderRadius: "1rem", cursor: "pointer", textAlign: "left",
                    transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,102,241,0.15)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {card.icon}
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>
                      {card.title}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.775rem", color: "#94a3b8", lineHeight: 1.4 }}>
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
          <p style={{ fontSize: "0.7rem", textAlign: "center", color: "#94a3b8" }}>
            Orion AI pode cometer erros. Verifique informações importantes.
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
