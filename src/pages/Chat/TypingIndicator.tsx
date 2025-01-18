import React from "react";

interface TypingIndicatorProps {
  className?: string; // Optional custom class for additional styling
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className = "" }) => {
  return (
    <div className={`typing-indicator ${className}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default TypingIndicator;
