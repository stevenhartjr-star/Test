
import React, { useState, useEffect } from 'react';
import { AppSettings, PREBUILT_VOICES, AVAILABLE_MODELS } from '../types';
import { CloseIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    if (isOpen) {
        setCurrentSettings(settings);
    }
  }, [settings, isOpen]);

  const handleSave = () => {
    onSave(currentSettings);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-md p-6 m-4 text-white relative animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
              Model
            </label>
            <select
              id="model"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              value={currentSettings.model}
              onChange={(e) => setCurrentSettings({ ...currentSettings, model: e.target.value })}
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-300 mb-2">
              System Instruction
            </label>
            <textarea
              id="systemInstruction"
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              value={currentSettings.systemInstruction}
              onChange={(e) => setCurrentSettings({ ...currentSettings, systemInstruction: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">Define the assistant's personality and role.</p>
          </div>

          <div>
            <label htmlFor="voice" className="block text-sm font-medium text-gray-300 mb-2">
              Assistant Voice (for Audio Sessions)
            </label>
            <select
              id="voice"
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
              value={currentSettings.voice}
              onChange={(e) => setCurrentSettings({ ...currentSettings, voice: e.target.value })}
            >
              {PREBUILT_VOICES.map((voice) => (
                <option key={voice} value={voice}>{voice}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
