"use client";

import React, { useRef, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { 
  Sparkles, BookOpen, Code, PenTool, ClipboardList, 
  HelpCircle, MessageSquare
} from "lucide-react";

export const ChatContainer: React.FC = () => {
  const { activeConversation, sendMessage, isResponding } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list changes or isResponding status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, isResponding]);

  const cards = [
    {
      title: "Explicação de Estudos",
      desc: "Resumos, exercícios de matemática, história, etc.",
      icon: <BookOpen size={18} className="text-amber-500" />,
      prompt: "Me dê um resumo sobre a Segunda Guerra Mundial e crie 3 exercícios para fixação.",
    },
    {
      title: "Assistente de Programação",
      desc: "Gere códigos, corrija bugs, refatore TypeScript/Next.js.",
      icon: <Code size={18} className="text-emerald-500" />,
      prompt: "Como crio um Hook customizado em React para buscar dados da API usando fetch e gerenciar estados de erro?",
    },
    {
      title: "Produção de Conteúdo",
      desc: "Artigos, posts para redes, textos de SEO, e-mails.",
      icon: <PenTool size={18} className="text-pink-500" />,
      prompt: "Escreva um post curto para LinkedIn divulgando o lançamento do Orion AI, com foco em produtividade.",
    },
    {
      title: "Planejamento e Tarefas",
      desc: "Organização de cronogramas, listas, gestão de projetos.",
      icon: <ClipboardList size={18} className="text-indigo-500" />,
      prompt: "Crie uma lista de tarefas semanais para o desenvolvimento de um aplicativo mobile com React Native.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Background Ambients */}
      <div className="ambient-glow bg-primary top-10 right-10" />
      <div className="ambient-glow bg-secondary bottom-10 left-10" />

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0 z-10 bg-background/50 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <MessageSquare size={18} className="text-primary" />
          <h1 className="font-semibold text-sm text-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {activeConversation ? activeConversation.title : "Nova Conversa"}
          </h1>
          {activeConversation && activeConversation.category !== "all" && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {activeConversation.category}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Orion Online</span>
        </div>
      </header>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 z-10">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          /* Empty onboarding state */
          <div className="max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center text-center space-y-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-xl shadow-primary/20 animate-bounce">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                Olá! Eu sou o <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Orion AI</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Sou seu assistente virtual avançado de IA. Estou pronto para te ajudar a programar, criar conteúdos, estudar ou organizar seu dia.
              </p>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
              {cards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(card.prompt)}
                  className="p-4 rounded-2xl glass-panel text-left hover:border-primary/50 dark:hover:bg-slate-800/40 hover:-translate-y-0.5 transition-all group duration-200"
                >
                  <div className="flex items-center space-x-2.5 mb-1">
                    {card.icon}
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {card.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 dark:text-slate-500">
              <HelpCircle size={14} />
              <span>Clique em qualquer cartão acima para enviar uma pergunta rápida ou digite abaixo.</span>
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="max-w-3xl mx-auto space-y-2">
            {activeConversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isResponding && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Footer Chat Input Area */}
      <footer className="p-4 border-t border-slate-200 dark:border-slate-800 bg-background/40 backdrop-blur-md z-10 shrink-0">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSendMessage={sendMessage} disabled={isResponding} />
          <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2">
            Orion AI pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </footer>
    </div>
  );
};
