import React from 'react';
import { ConversationStatus } from '../types';
import { MicIcon, MicOffIcon, LoadingSpinnerIcon } from './icons';

interface ControlButtonProps {
  status: ConversationStatus;
  onStart: () => void;
  onStop: () => void;
}

export const ControlButton: React.FC<ControlButtonProps> = ({ status, onStart, onStop }) => {
  const isConnected = status === ConversationStatus.CONNECTED;
  const isConnecting = status === ConversationStatus.CONNECTING;

  const handleClick = () => {
    if (isConnected || isConnecting) {
      onStop();
    } else {
      onStart();
    }
  };

  const getIcon = () => {
    if (isConnecting) {
      return <LoadingSpinnerIcon className="h-5 w-5"/>;
    }
    if (isConnected) {
      return <MicOffIcon className="h-5 w-5" />;
    }
    return <MicIcon className="h-5 w-5" />;
  };

  const baseClasses = "p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
  
  const colorClass = {
      [ConversationStatus.DISCONNECTED]: 'focus:ring-blue-500',
      [ConversationStatus.CONNECTING]: 'focus:ring-yellow-500',
      [ConversationStatus.CONNECTED]: 'focus:ring-red-500 text-red-400 hover:text-red-300',
      [ConversationStatus.ERROR]: 'focus:ring-yellow-500',
  }[status];

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`${baseClasses} ${colorClass}`}
      aria-label={isConnected ? 'Stop audio session' : 'Start audio session'}
    >
      {getIcon()}
    </button>
  );
};