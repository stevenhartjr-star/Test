import { ChatSession } from "../types";

const CHAT_HISTORY_KEY = 'gemini_chat_history';

export const saveChats = (chats: ChatSession[]): void => {
  try {
    // Use a replacer function to handle non-serializable File objects.
    // This converts File objects into a serializable format with name and type,
    // allowing us to preserve the file's metadata across sessions without
    // storing its content, which could exceed localStorage limits.
    const data = JSON.stringify(chats, (key, value) => {
      if (typeof File !== 'undefined' && value instanceof File) {
        return { name: value.name, type: value.type };
      }
      return value;
    });
    localStorage.setItem(CHAT_HISTORY_KEY, data);
  } catch (error) {
    console.error("Failed to save chat history to localStorage", error);
  }
};

export const loadChats = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    if (data) {
      // Basic validation
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load chat history from localStorage", error);
  }
  return [];
};

export const clearChats = (): void => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear chat history from localStorage", error);
  }
};