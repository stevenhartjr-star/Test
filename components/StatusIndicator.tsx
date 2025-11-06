
import React from 'react';
import { ConversationStatus } from '../types';

interface StatusIndicatorProps {
  status: ConversationStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case ConversationStatus.CONNECTED:
        return { text: 'Connected', color: 'bg-green-500' };
      case ConversationStatus.CONNECTING:
        return { text: 'Connecting', color: 'bg-yellow-500' };
      case ConversationStatus.DISCONNECTED:
        return { text: 'Offline', color: 'bg-gray-500' };
      case ConversationStatus.ERROR:
        return { text: 'Error', color: 'bg-red-500' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500' };
    }
  };

  const { text, color } = getStatusInfo();

  return (
    <div className="flex items-center space-x-2">
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-sm font-medium text-gray-300">{text}</span>
    </div>
  );
};
