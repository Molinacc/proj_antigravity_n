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
    if (confirm("Deseja apagar todo o histórico de conversas? Esta ação não pode ser desfeita.")) {
      clearAllConversations();
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all text-left group"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-md shrink-0">
          {userProfile.avatar ? (
            <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            userProfile.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
            {userProfile.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {userProfile.email}
          </p>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Overlay to close */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute bottom-14 left-0 w-72 glass-panel rounded-2xl p-4 shadow-xl z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white rounded-lg p-2 text-sm font-medium shadow-sm transition-all"
                >
                  <Check size={16} />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <User size={16} className="text-slate-400" />
                  <span>Editar Perfil</span>
                </button>
                <button
                  onClick={() => {
                    onOpenSettings();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <SettingsIcon size={16} className="text-slate-400" />
                  <span>Configurações do Orion</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
                <button
                  onClick={handleClear}
                  className="w-full flex items-center space-x-3 p-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut size={16} className="text-red-400" />
                  <span>Limpar Conversas</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
