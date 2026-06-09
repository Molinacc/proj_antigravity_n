import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 py-3 px-4 glass-panel rounded-2xl max-w-[100px] justify-center mt-2 select-none animate-pulse">
      <div className="typing-dot"></div>
      <div className="typing-dot" style={{ animationDelay: "0.2s" }}></div>
      <div className="typing-dot" style={{ animationDelay: "0.4s" }}></div>
    </div>
  );
};
