

import React, { useRef, useEffect } from 'react';
import { TranscriptEntry } from '../types';
import { LoadingBubble } from './LoadingBubble';
import { MessageBubble } from './MessageBubble';
import { LiveTranscriptionBubble } from './LiveTranscriptionBubble';

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
  isAssistantResponding: boolean;
  onRegenerateResponse: (messageId: string) => void;
  onRequestEdit: (file: File) => void;
  onRequestExtend: (entryId: string, videoOperationResponse: any) => void;
  liveTranscription: { user: string; assistant: string };
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript, isAssistantResponding, onRegenerateResponse, onRequestEdit, onRequestExtend, liveTranscription }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcript, isAssistantResponding, liveTranscription]);

  return (
    <div className="space-y-6 flex flex-col pb-4">
      {transcript.map((entry) => (
        <MessageBubble 
          key={entry.id}
          entry={entry}
          onRegenerate={onRegenerateResponse}
          onRequestEdit={onRequestEdit}
          onRequestExtend={onRequestExtend}
        />
      ))}
      {isAssistantResponding && <LoadingBubble />}
      {(liveTranscription.user || liveTranscription.assistant) && (
        <LiveTranscriptionBubble userText={liveTranscription.user} assistantText={liveTranscription.assistant} />
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};
