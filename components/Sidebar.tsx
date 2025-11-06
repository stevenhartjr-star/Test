import React, { useState, useMemo } from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon, CloseIcon } from './icons';
import clsx from 'clsx';

interface SidebarProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ chats, activeChatId, onNewChat, onSelectChat, onClearHistory, isOpen, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
      onClearHistory();
    }
  };

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return chats.filter(chat => 
        chat.title.toLowerCase().includes(lowercasedQuery) ||
        chat.transcript.some(entry => entry.text?.toLowerCase().includes(lowercasedQuery))
    );
  }, [chats, searchQuery]);

  return (
    <>
      <div className={clsx(
        "fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={onToggle}></div>

      <aside className={clsx(
        "absolute md:relative z-40 h-full bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/60 flex flex-col w-64 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700/60">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button onClick={onNewChat} className="p-2 rounded-md hover:bg-gray-700" title="New Chat">
            <PlusIcon className="w-5 h-5" />
          </button>
          <button onClick={onToggle} className="p-2 rounded-md hover:bg-gray-700 md:hidden">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 border-b border-gray-700/60">
            <input 
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/80 border border-gray-600/50 rounded-md px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map((chat) => (
            <a
              href="#"
              key={chat.id}
              onClick={(e) => {
                e.preventDefault();
                onSelectChat(chat.id);
              }}
              className={clsx(
                "block px-3 py-2 rounded-md text-sm truncate transition-colors",
                chat.id === activeChatId
                  ? 'bg-blue-600/50 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-700/80'
              )}
            >
              {chat.title}
            </a>
          ))}
          {filteredChats.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-4">No chats found.</p>
          )}
        </nav>
        <div className="p-4 border-t border-gray-700/60">
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Clear Conversations
          </button>
        </div>
      </aside>
    </>
  );
};