import React from 'react';
import { GeminiLogoIcon } from './icons';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const handleSelectKey = async () => {
    // FIX: Add `(window as any)` to support `aistudio` property in TypeScript.
    if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
      await (window as any).aistudio.openSelectKey();
      onKeySelected(); // Assume success to avoid race condition and immediately hide modal
    } else {
      alert("API Key selection is not available in this environment.");
    }
  };

  return (
    <div className="text-white h-screen flex flex-col items-center justify-center font-sans">
      <div className="text-center p-8 max-w-lg bg-gray-900/75 backdrop-blur-sm rounded-xl shadow-2xl">
        <GeminiLogoIcon className="w-20 h-20 mx-auto mb-6 text-gray-500" />
        <h1 className="text-3xl font-bold mb-4 text-gray-200">Welcome to Gemini Assistant</h1>
        <p className="text-gray-400 mb-8">
          To use advanced features like video generation, you need to select a Google AI Studio API key. 
          Your project will be enabled for use with the Gemini API.
        </p>
        <button
          onClick={handleSelectKey}
          className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors text-lg shadow-lg hover:shadow-blue-500/30"
        >
          Select API Key
        </button>
        <p className="text-xs text-gray-500 mt-8">
          By using this service, you agree to the Gemini API terms of service. 
          For more information on billing, please visit the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            official documentation
          </a>.
        </p>
      </div>
    </div>
  );
};