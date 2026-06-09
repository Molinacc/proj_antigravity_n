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
  type: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto resize textarea as text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() && attachedFiles.length === 0) return;
    
    // Prepare attachments indicator message if any file exists
    let finalContent = content;
    if (attachedFiles.length > 0) {
      const filesDesc = attachedFiles.map(f => `📄 [Arquivo Anexado: ${f.name} (${f.size})]`).join("\n");
      finalContent = `${filesDesc}\n\n${content}`;
    }

    onSendMessage(finalContent);
    setContent("");
    setAttachedFiles([]);
    
    // Reset heights
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Simulate attachment (PDF, DOCX, TXT)
    const newAttachments: AttachedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      newAttachments.push({
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.type || "text/plain",
      });
    }

    setAttachedFiles([...attachedFiles, ...newAttachments]);
    // Clear value to allow same file uploading
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (idx: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      {/* File Upload Previews */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2">
          {attachedFiles.map((file, idx) => (
            <div 
              key={idx} 
              className="flex items-center space-x-2 py-1 px-2.5 bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/60 rounded-xl text-xs text-foreground animate-in slide-in-from-bottom-2 duration-150"
            >
              <FileText size={14} className="text-primary" />
              <span className="truncate max-w-[150px] font-medium">{file.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">({file.size})</span>
              <button 
                onClick={() => removeAttachment(idx)}
                className="p-0.5 rounded hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                title="Remover anexo"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className="relative flex items-end p-2 border border-input-border bg-input-bg dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all duration-200">
        {/* File attachment button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all shrink-0 self-center"
          title="Anexar arquivo (PDF, DOCX, TXT)"
        >
          <Paperclip size={18} />
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileAttach}
          multiple
          accept=".pdf,.docx,.txt,text/plain,application/pdf"
          className="hidden" 
        />

        {/* Input Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Orion AI está digitando..." : "Pergunte algo para Orion AI... (Shift+Enter para nova linha)"}
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent border-0 outline-none resize-none px-3 py-2 text-sm max-h-40 min-h-[38px] text-foreground focus:ring-0 focus:outline-none"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!content.trim() && attachedFiles.length === 0)}
          className={`p-2.5 rounded-xl transition-all shadow-md shrink-0 self-center ${
            content.trim() || attachedFiles.length > 0
              ? "bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:scale-105"
              : "bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
          }`}
          title="Enviar mensagem"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
