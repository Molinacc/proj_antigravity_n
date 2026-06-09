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
    <div
      className={`flex w-full space-x-3 md:space-x-4 py-4 ${
        isAi ? "justify-start" : "justify-end flex-row-reverse space-x-reverse"
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md ${
          isAi
            ? "bg-gradient-to-br from-primary to-purple-600 animate-pulse"
            : "bg-gradient-to-tr from-slate-600 to-slate-800"
        }`}
      >
        {isAi ? <Sparkles size={16} /> : <User size={16} />}
      </div>

      {/* Bubble Wrapper */}
      <div className="flex flex-col max-w-[85%] md:max-w-[75%] space-y-1">
        {/* Header (Role + Timestamp) */}
        <div
          className={`flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 px-1 ${
            isAi ? "justify-start" : "justify-end"
          }`}
        >
          <span className="font-semibold uppercase tracking-wide">
            {isAi ? "Orion AI" : "Você"}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Bubble */}
        <div
          className={`glass-panel rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed relative group transition-all duration-200 border ${
            isAi
              ? "bg-chat-bubble-ai text-chat-bubble-ai-text border-slate-200/50 dark:border-slate-800/40 rounded-tl-sm"
              : "bg-chat-bubble-user text-white border-primary/20 rounded-tr-sm"
          }`}
        >
          {/* Markdown Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                h1: ({ children }) => <h1 className="text-base font-bold my-2 text-primary">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold my-1.5 text-secondary">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-bold my-1">{children}</h3>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline underline-offset-2 break-all font-medium"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded text-xs text-rose-500 dark:text-rose-400 font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="overflow-x-auto my-3 p-4 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 relative font-mono text-xs max-w-full">
                    {children}
                  </pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Copy message button */}
          <button
            onClick={handleCopy}
            className={`absolute -bottom-7 p-1 rounded-md opacity-0 group-hover:opacity-100 text-slate-400 hover:text-foreground dark:hover:text-white transition-opacity ${
              isAi ? "left-1" : "right-1"
            }`}
            title="Copiar mensagem"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};
