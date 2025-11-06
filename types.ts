


import { File } from "buffer";

export enum ConversationStatus {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
}

export type SerializableFile = {
  name: string;
  type: string;
};

export interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'assistant' | 'system';
  text: string;
  file?: File | SerializableFile;
  status?: 'pending' | 'complete' | 'error';
  videoOperationResponse?: any;
}

export const AVAILABLE_MODELS = [
    'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-flash-lite-latest'
];

export interface AppSettings {
  systemInstruction: string;
  voice: string;
  model: string;
}

export interface ChatSession {
    id: string;
    title: string;
    transcript: TranscriptEntry[];
    settings: AppSettings;
}

export enum StreamSource {
    NONE,
    WEBCAM,
    SCREEN,
}

export const PREBUILT_VOICES = [
    'Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'
];