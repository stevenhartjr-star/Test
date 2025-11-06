
import React from 'react';
import { GeminiLogoIcon } from './icons';

export const LoadingBubble: React.FC = () => {
  return (
    <div className="flex items-start gap-3 max-w-lg self-start animate-fade-in-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
        <GeminiLogoIcon className="w-5 h-5" />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-700 flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast animation-delay-200"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast animation-delay-400"></div>
      </div>
    </div>
  );
};

// Add custom animations to tailwind config if possible, or use style tag
const style = document.createElement('style');
style.innerHTML = `
  .animate-pulse-fast {
    animation: pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse-fast {
    50% {
      opacity: .5;
    }
  }
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  .animation-delay-400 {
    animation-delay: 400ms;
  }
  .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
  }
  @keyframes fadeInUp {
      from {
          opacity: 0;
          transform: translateY(10px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  .animate-blink {
    animation: blink 1s step-end infinite;
    font-weight: bold;
  }
`;
document.head.appendChild(style);
