"use client";

import React, { useState } from "react";
import { useChat, Theme } from "@/context/ChatContext";
import { X, Sun, Moon, Monitor, ShieldAlert, Key, Sliders, Settings } from "lucide-react";

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
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Claro", icon: <Sun size={16} /> },
    { value: "dark", label: "Escuro", icon: <Moon size={16} /> },
    { value: "system", label: "Sistema", icon: <Monitor size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Panel container */}
      <div className="relative w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Settings size={20} className="text-primary animate-spin-slow" />
            <h2 className="text-lg font-bold text-foreground">Configurações do Orion AI</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Theme selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              Aparência do Tema
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={`flex items-center justify-center space-x-2 p-2.5 rounded-xl text-sm border font-medium transition-all ${
                    theme === opt.value
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Sliders size={16} className="text-primary" />
              Modelo de Inteligência
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="mock-orion">Orion Simulation Mode (Recomendado - Gratuito)</option>
              <option value="gpt-4o">OpenAI GPT-4o (Requer Chave)</option>
              <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo (Requer Chave)</option>
            </select>
          </div>

          {/* API key configuration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key size={16} className="text-primary" />
                Chave API OpenAI
              </span>
              {model === "mock-orion" && (
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full font-normal">
                  Não requerida no Modo Simulação
                </span>
              )}
            </label>
            <input
              type="password"
              placeholder={model === "mock-orion" ? "Opcional no modo simulação" : "Insira sua chave sk-..."}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {model !== "mock-orion" && !apiKey && (
              <p className="text-xs text-amber-500 flex items-center gap-1">
                <ShieldAlert size={12} />
                A chave de API é necessária para utilizar os modelos reais da OpenAI.
              </p>
            )}
          </div>

          {/* System Instructions / System Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              Instruções de Personalidade (System Prompt)
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Footer Save */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-white rounded-xl shadow-md shadow-primary/20 transition-all"
            >
              {isSaved ? "Salvo com sucesso!" : "Salvar Configurações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
