import React from 'react';
import { MagicWandIcon } from './icons';

interface VoiceCommandToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const VoiceCommandToggle: React.FC<VoiceCommandToggleProps> = ({ isEnabled, onToggle }) => {
  const title = isEnabled ? 'Disable Voice Commands' : 'Enable Voice Commands';
  const colorClass = isEnabled ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 hover:text-gray-300';
  const ringClass = isEnabled ? 'focus:ring-blue-400' : 'focus:ring-gray-400';

  return (
    <button
      onClick={onToggle}
      title={title}
      aria-label={title}
      className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 ${ringClass} focus:ring-offset-2 focus:ring-offset-gray-800`}
    >
      <MagicWandIcon className={`w-6 h-6 ${colorClass}`} />
    </button>
  );
};
