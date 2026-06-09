import React from "react";

export const TypingIndicator: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      padding: "0.625rem 0.875rem",
      background: "var(--chat-bubble-ai)",
      border: "1px solid var(--card-border)",
      borderRadius: "1.125rem 1.125rem 1.125rem 0.25rem",
      width: "fit-content",
      marginTop: "0.25rem",
    }}>
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
};
