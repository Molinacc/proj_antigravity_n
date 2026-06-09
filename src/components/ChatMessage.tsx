"use client";

import React, { useState } from "react";
import { Message } from "@/context/ChatContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.role === "assistant";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isAi ? "row" : "row-reverse",
      gap: "0.625rem",
      width: "100%",
      padding: "0.25rem 0",
      alignItems: "flex-start",
    }}>
      {/* Avatar */}
      <div style={{
        width: "28px", height: "28px", borderRadius: "4px", flexShrink: 0,
        background: isAi ? "var(--primary)" : "var(--text-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: "0.25rem",
      }}>
        {isAi ? <Sparkles size={12} color="#fff" /> : <User size={12} color="#fff" />}
      </div>

      {/* Bubble column */}
      <div style={{
        display: "flex", flexDirection: "column",
        maxWidth: "min(85%, 580px)",
        gap: "0.25rem",
        alignItems: isAi ? "flex-start" : "flex-end",
      }}>
        {/* Meta */}
        <div style={{
          display: "flex", gap: "0.375rem", alignItems: "center",
          fontSize: "0.7rem", color: "var(--text-muted)",
          flexDirection: isAi ? "row" : "row-reverse",
        }}>
          <span style={{ fontWeight: 600 }}>{isAi ? "Orion AI" : "Você"}</span>
          <span>·</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div
          className={isAi ? "bubble-ai" : "bubble-user"}
          style={{
            position: "relative",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          <div style={{ maxWidth: "100%" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p style={{ marginBottom: "0.4rem" }}>{children}</p>,
                ul: ({ children }) => <ul style={{ paddingLeft: "1.25rem", marginBottom: "0.4rem" }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ paddingLeft: "1.25rem", marginBottom: "0.4rem" }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: "0.15rem" }}>{children}</li>,
                h1: ({ children }) => <h1 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--primary)" }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.3rem" }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.2rem" }}>{children}</h3>,
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--primary)", textDecoration: "underline", wordBreak: "break-all" }}>
                    {children}
                  </a>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  if (isBlock) return <code>{children}</code>;
                  return (
                    <code style={{
                      background: "var(--bg-subtle)", padding: "0.1rem 0.3rem",
                      borderRadius: "4px", fontSize: "0.85em",
                      fontFamily: "ui-monospace, monospace",
                      border: "1px solid var(--border)",
                      color: isAi ? "#e11d48" : "#fef08a",
                    }}>
                      {children}
                    </code>
                  );
                },
                strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          title="Copiar mensagem"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", fontSize: "0.7rem",
            display: "flex", alignItems: "center", gap: "0.25rem",
            padding: "0.15rem 0.35rem", borderRadius: "4px",
            transition: "color 0.1s",
            alignSelf: isAi ? "flex-start" : "flex-end",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          {copied
            ? <><Check size={11} style={{ color: "#10b981" }} /><span style={{ color: "#10b981" }}>Copiado!</span></>
            : <><Copy size={11} /><span>Copiar</span></>
          }
        </button>
      </div>
    </div>
  );
};
