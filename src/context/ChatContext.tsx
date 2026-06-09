"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  category: "all" | "atendimento" | "estudos" | "programacao" | "conteudo" | "produtividade";
  messages: Message[];
  updatedAt: string;
}

export type Theme = "light" | "dark" | "system";

export interface UserProfileData {
  name: string;
  email: string;
  avatar: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  systemPrompt: string;
  maxTokens: number;
}

interface ChatContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  setActiveConversationId: (id: string | null) => void;
  createConversation: (category?: Conversation["category"]) => string;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  sendMessage: (content: string) => Promise<void>;
  isResponding: boolean;
  userProfile: UserProfileData;
  updateUserProfile: (profile: Partial<UserProfileData>) => void;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfileData = {
  name: "Clayton Molina",
  email: "molinacc@hotmail.com",
  avatar: "",
};

const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  model: "mock-orion",
  systemPrompt: "Você é o Orion AI, um assistente virtual conversacional altamente avançado. Você deve ser amigável, profissional, claro e objetivo. Adapte o tom conforme necessário, explique conceitos complexos com simplicidade, demonstre raciocínio estruturado e peça esclarecimentos em perguntas ambíguas.",
  maxTokens: 2048,
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<Theme>("dark");

  // Chat states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState<boolean>(false);

  // Settings & User state
  const [userProfile, setUserProfileState] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);

  // Load state from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("orion-theme") as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        setThemeState(systemTheme);
      }

      const savedConversations = localStorage.getItem("orion-conversations");
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          setConversations(parsed);
          if (parsed.length > 0) {
            setActiveConversationId(parsed[0].id);
          }
        } catch (e) {
          console.error("Error parsing saved conversations", e);
        }
      }

      const savedProfile = localStorage.getItem("orion-profile");
      if (savedProfile) {
        try {
          setUserProfileState(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Error parsing profile", e);
        }
      }

      const savedSettings = localStorage.getItem("orion-settings");
      if (savedSettings) {
        try {
          setSettingsState(JSON.parse(savedSettings));
        } catch (e) {
          console.error("Error parsing settings", e);
        }
      }
    }
  }, []);

  // Save changes to localStorage and apply theme classes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem("orion-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    localStorage.setItem("orion-conversations", JSON.stringify(updated));
  };

  const updateUserProfile = (updated: Partial<UserProfileData>) => {
    setUserProfileState((prev) => {
      const val = { ...prev, ...updated };
      localStorage.setItem("orion-profile", JSON.stringify(val));
      return val;
    });
  };

  const updateSettings = (updated: Partial<Settings>) => {
    setSettingsState((prev) => {
      const val = { ...prev, ...updated };
      localStorage.setItem("orion-settings", JSON.stringify(val));
      return val;
    });
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const createConversation = (category: Conversation["category"] = "all"): string => {
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "Nova conversa",
      category,
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    const updated = [newConv, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newId);
    return newId;
  };

  const deleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);
    if (activeConversationId === id) {
      setActiveConversationId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const clearAllConversations = () => {
    saveConversations([]);
    setActiveConversationId(null);
  };

  // Triggering Response simulation
  const sendMessage = async (content: string) => {
    if (!content.trim() || isResponding) return;

    let currentConvId = activeConversationId;
    let currentConversations = [...conversations];

    // Auto-create conversation if none is active
    if (!currentConvId) {
      currentConvId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: currentConvId,
        title: content.substring(0, 30) + (content.length > 30 ? "..." : ""),
        category: "all",
        messages: [],
        updatedAt: new Date().toISOString(),
      };
      currentConversations = [newConv, ...currentConversations];
      setConversations(currentConversations);
      setActiveConversationId(currentConvId);
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update conversation state with user message
    let activeConvIndex = currentConversations.findIndex((c) => c.id === currentConvId);
    if (activeConvIndex !== -1) {
      const activeConv = currentConversations[activeConvIndex];
      const updatedMessages = [...activeConv.messages, userMessage];
      
      // Auto rename conversation title if it was just created
      const title = activeConv.title === "Nova conversa" 
        ? content.substring(0, 30) + (content.length > 30 ? "..." : "")
        : activeConv.title;

      // Classify category based on message content automatically
      let category = activeConv.category;
      if (category === "all") {
        const text = content.toLowerCase();
        if (text.includes("código") || text.includes("bug") || text.includes("react") || text.includes("css") || text.includes("typescript") || text.includes("python") || text.includes("html") || text.includes("função")) {
          category = "programacao";
        } else if (text.includes("estudo") || text.includes("resumo") || text.includes("explica") || text.includes("matemática") || text.includes("história") || text.includes("exercício")) {
          category = "estudos";
        } else if (text.includes("artigo") || text.includes("redação") || text.includes("post") || text.includes("seo") || text.includes("redes sociais") || text.includes("email")) {
          category = "conteudo";
        } else if (text.includes("tarefa") || text.includes("cronograma") || text.includes("planejamento") || text.includes("projeto") || text.includes("todo")) {
          category = "produtividade";
        }
      }

      currentConversations[activeConvIndex] = {
        ...activeConv,
        title,
        category,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };
      saveConversations(currentConversations);
    }

    setIsResponding(true);

    try {
      // API call to the Next.js routes
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: currentConversations[activeConvIndex]?.messages || [userMessage],
          settings,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na comunicação com a API.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiMessageContent = "";

      const aiMessageId = `msg_ai_${Date.now()}`;
      
      // Temporarily add empty AI message shell
      const initialAiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Add shell message
      const withShellConversations = [...currentConversations];
      const shellIndex = withShellConversations.findIndex((c) => c.id === currentConvId);
      if (shellIndex !== -1) {
        withShellConversations[shellIndex] = {
          ...withShellConversations[shellIndex],
          messages: [...withShellConversations[shellIndex].messages, initialAiMessage],
        };
        setConversations(withShellConversations);
      }

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          // Simple SSE or stream parsing
          const lines = chunk.split("\n").filter(line => line.trim() !== "");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              if (dataStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(dataStr);

                // Support Azure OpenAI SSE format: choices[0].delta.content
                // AND legacy mock format: { text: "..." }
                const azureText = parsed.choices?.[0]?.delta?.content ?? "";
                const mockText = parsed.text ?? "";
                const text = azureText || mockText;

                if (!text) continue; // skip empty/filter chunks

                aiMessageContent += text;

                // Stream updates to state
                setConversations((prev) => {
                  const updated = [...prev];
                  const idx = updated.findIndex((c) => c.id === currentConvId);
                  if (idx !== -1) {
                    const messages = [...updated[idx].messages];
                    const aiMsgIdx = messages.findIndex((m) => m.id === aiMessageId);
                    if (aiMsgIdx !== -1) {
                      messages[aiMsgIdx] = {
                        ...messages[aiMsgIdx],
                        content: aiMessageContent,
                      };
                    }
                    updated[idx] = {
                      ...updated[idx],
                      messages,
                    };
                  }
                  return updated;
                });
              } catch (e) {
                // Not JSON — skip silently
              }
            }
          }
        }
      }

      // Persist final version
      setConversations((prev) => {
        localStorage.setItem("orion-conversations", JSON.stringify(prev));
        return prev;
      });

    } catch (error) {
      console.error("Chat API error:", error);
      // Fallback message error
      const errorMessage: Message = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content: "Desculpe, ocorreu um erro de conexão. Por favor, verifique se a chave de API é válida e tente novamente mais tarde.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((c) => c.id === currentConvId);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            messages: [...updated[idx].messages.filter(m => m.content !== ""), errorMessage],
          };
        }
        localStorage.setItem("orion-conversations", JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        theme,
        setTheme,
        conversations,
        activeConversationId,
        activeConversation,
        setActiveConversationId,
        createConversation,
        deleteConversation,
        clearAllConversations,
        sendMessage,
        isResponding,
        userProfile,
        updateUserProfile,
        settings,
        updateSettings,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
