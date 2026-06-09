"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, FileText } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
}

interface AttachedFile {
  name: string;
  size: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [content]);

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    let finalContent = trimmed;
    if (attachedFiles.length > 0) {
      const filesDesc = attachedFiles.map(f => `📄 [Arquivo: ${f.name} (${f.size})]`).join("\n");
      finalContent = `${filesDesc}\n\n${trimmed}`;
    }
    onSendMessage(finalContent);
    setContent("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: AttachedFile[] = Array.from(files).map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSend = (content.trim().length > 0 || attachedFiles.length > 0) && !disabled;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      {/* Attached files */}
      {attachedFiles.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {attachedFiles.map((file, idx) => (
            <div key={idx} style={{
              display: "flex", alignItems: "center", gap: "0.375rem",
              padding: "0.25rem 0.625rem",
              background: "var(--card-bg)", border: "1px solid var(--card-border)",
              borderRadius: "0.625rem", fontSize: "0.75rem", color: "var(--foreground)",
            }}>
              <FileText size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </span>
              <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>({file.size})</span>
              <button
                onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "0", lineHeight: 1 }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="input-box">
        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Anexar arquivo"
          style={{
            background: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer",
            color: "#94a3b8", padding: "0.25rem", borderRadius: "0.5rem",
            transition: "color 0.15s", flexShrink: 0, alignSelf: "flex-end",
            marginBottom: "0.1rem",
          }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = "var(--primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; }}
        >
          <Paperclip size={18} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileAttach}
          multiple
          accept=".pdf,.docx,.txt"
          style={{ display: "none" }}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="input-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Orion AI está respondendo..." : "Pergunte algo... (Shift+Enter para nova linha)"}
          rows={1}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Enviar"
          style={{
            background: canSend ? "var(--primary)" : "rgba(148,163,184,0.15)",
            border: "none",
            borderRadius: "0.625rem",
            padding: "0.5rem",
            cursor: canSend ? "pointer" : "not-allowed",
            color: canSend ? "#fff" : "#94a3b8",
            transition: "background 0.2s, transform 0.15s",
            flexShrink: 0, alignSelf: "flex-end",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => { if (canSend) { e.currentTarget.style.background = "var(--primary-hover)"; e.currentTarget.style.transform = "scale(1.05)"; }}}
          onMouseLeave={e => { if (canSend) { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.transform = "scale(1)"; }}}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
