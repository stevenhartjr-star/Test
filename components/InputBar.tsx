import React, { useState, useRef, useEffect } from 'react';
import { PaperclipIcon, SendIcon, CameraIcon, ScreenIcon, SwitchCameraIcon, EditIcon, MicIcon } from './icons';
import { ConversationStatus, StreamSource } from '../types';
import clsx from 'clsx';
import { ControlButton } from './ControlButton';

interface InputBarProps {
    onSendMessage: (message: string) => void;
    isAudioStreaming: boolean;
    isAssistantResponding: boolean;
    streamSource: StreamSource;
    onRequestStream: (source: StreamSource) => void;
    onToggleCamera: () => void;
    onStartAudio: () => void;
    onStopAudio: () => void;
    audioStatus: ConversationStatus;
    stagedFile: File | null;
    onFileChange: (file: File | null) => void;
    onRequestEdit: (file: File) => void;
    videoExtensionContext: { entryId: string; video: any } | null;
    onCancelExtension: () => void;
}

export const InputBar: React.FC<InputBarProps> = ({ 
    onSendMessage, 
    isAudioStreaming, 
    isAssistantResponding,
    streamSource, 
    onRequestStream, 
    onToggleCamera,
    onStartAudio,
    onStopAudio,
    audioStatus,
    stagedFile,
    onFileChange,
    onRequestEdit,
    videoExtensionContext,
    onCancelExtension
}) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null); // Use 'any' for cross-browser webkitSpeechRecognition

    useEffect(() => {
        // FIX: Cast `window` to `any` to access the non-standard `SpeechRecognition` property, resolving the TypeScript error.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition is not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText(prevText => (prevText ? prevText.trim() + ' ' : '') + transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    const handleToggleListen = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not available on your browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSend = () => {
        if (text.trim() || stagedFile || videoExtensionContext) {
            onSendMessage(text.trim());
            setText('');
            onFileChange(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            onFileChange(selectedFile);
        }
    };

    const handleStreamToggle = (source: StreamSource) => {
        if (!isAudioStreaming) {
            alert("Please start an audio session first to use webcam or screen sharing.");
            return;
        }
        onRequestStream(source);
    };

    const isDisabled = isAudioStreaming || isAssistantResponding;
    const isExtending = videoExtensionContext !== null;

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-end gap-2 bg-gray-800 rounded-xl p-2 shadow-md">
                <div className='flex items-center self-end'>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button title="Attach File" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 disabled:opacity-50" disabled={isDisabled || isExtending}>
                        <PaperclipIcon className="w-5 h-5" />
                    </button>
                    <button 
                        title="Voice Input" 
                        onClick={handleToggleListen} 
                        className={clsx(
                            "p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 transition-colors",
                            isListening ? "text-red-400 animate-pulse" : "text-gray-400 hover:text-white"
                        )}
                        disabled={isDisabled || isExtending}
                    >
                        <MicIcon className="w-5 h-5" />
                    </button>
                    <ControlButton status={audioStatus} onStart={onStartAudio} onStop={onStopAudio} />
                </div>

                <div className='flex-1 flex flex-col'>
                    {isExtending && (
                        <div className="mx-2 mb-2 px-3 py-1.5 text-sm bg-blue-800/80 rounded-md flex justify-between items-center animate-fade-in-up">
                            <span className='truncate text-gray-200 font-medium'>Video Extension: Describe the next scene.</span>
                            <button onClick={onCancelExtension} className="text-gray-300 hover:text-white text-lg ml-2">×</button>
                        </div>
                    )}
                    {stagedFile && !isExtending && (
                        <div className="mx-2 mb-2 px-3 py-1.5 text-sm bg-gray-700/80 rounded-md flex justify-between items-center animate-fade-in-up">
                            <span className='truncate text-gray-300'>Attached: {stagedFile.name}</span>
                            <div className="flex items-center">
                                {stagedFile.type.startsWith('image/') && (
                                    <button onClick={() => onRequestEdit(stagedFile)} className="text-gray-400 hover:text-white text-lg ml-2 p-1 rounded-full hover:bg-gray-600" title="Edit image">
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={() => onFileChange(null)} className="text-gray-400 hover:text-white text-lg ml-2">×</button>
                            </div>
                        </div>
                    )}
                    <textarea
                        ref={textAreaRef}
                        rows={1}
                        value={text}
                        onChange={handleInput}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={isListening ? 'Listening...' : isExtending ? "A dragon appears and..." : "Type a message..."}
                        className="w-full bg-transparent text-white rounded-lg px-2 py-1.5 focus:outline-none resize-none max-h-48"
                        disabled={isDisabled}
                    />
                </div>
                
                <div className='flex items-center self-end'>
                    {streamSource === StreamSource.WEBCAM && (
                        <button
                            title="Switch Camera"
                            onClick={onToggleCamera}
                            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        >
                            <SwitchCameraIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        title={streamSource === StreamSource.WEBCAM ? "Stop Webcam" : "Share Webcam"}
                        onClick={() => handleStreamToggle(StreamSource.WEBCAM)}
                        className={clsx("p-2 rounded-full hover:bg-gray-700 disabled:opacity-50", streamSource === StreamSource.WEBCAM ? 'text-blue-400' : 'text-gray-400 hover:text-white')}
                        disabled={!isAudioStreaming && streamSource !== StreamSource.WEBCAM}
                    >
                        <CameraIcon className="w-5 h-5" />
                    </button>
                     <button
                        title={streamSource === StreamSource.SCREEN ? "Stop Screen Share" : "Share Screen"}
                        onClick={() => handleStreamToggle(StreamSource.SCREEN)}
                        className={clsx("p-2 rounded-full hover:bg-gray-700 disabled:opacity-50", streamSource === StreamSource.SCREEN ? 'text-blue-400' : 'text-gray-400 hover:text-white')}
                        disabled={!isAudioStreaming && streamSource !== StreamSource.SCREEN}
                    >
                        <ScreenIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleSend} className="p-2 text-white bg-blue-600 rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-600 transition-colors" disabled={isDisabled || (!text.trim() && !stagedFile && !isExtending)}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};