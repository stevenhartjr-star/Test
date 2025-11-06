
import React from 'react';
import { UserIcon, GeminiLogoIcon } from './icons';

interface LiveTranscriptionBubbleProps {
  userText: string;
  assistantText: string;
}

const BlinkingCursor = () => <span className="animate-blink">_</span>;

export const LiveTranscriptionBubble: React.FC<LiveTranscriptionBubbleProps> = ({ userText, assistantText }) => {
  return (
    <div className="space-y-4 animate-fade-in-up pb-4">
      {userText && (
        <div className="flex flex-col items-end">
          <div className="flex items-start gap-3 max-w-full md:max-w-4xl flex-row-reverse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/80 opacity-75">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-br-none bg-gray-700/50">
              <p className="text-sm text-gray-300 italic whitespace-pre-wrap">{userText}<BlinkingCursor /></p>
            </div>
          </div>
        </div>
      )}
      {assistantText && (
        <div className="flex flex-col items-start">
          <div className="flex items-start gap-3 max-w-full md:max-w-4xl">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 opacity-75">
              <GeminiLogoIcon className="w-5 h-5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-700/50">
              <p className="text-sm text-gray-300 italic whitespace-pre-wrap">{assistantText}<BlinkingCursor /></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
