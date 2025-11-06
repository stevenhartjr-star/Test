
import React, { useRef, useEffect, useMemo } from 'react';
import { TranscriptEntry } from '../types';
import { UserIcon, GeminiLogoIcon, SystemIcon, FileIcon, RegenerateIcon, DownloadIcon, LoadingSpinnerIcon, EditIcon, MagicWandIcon } from './icons';
import clsx from 'clsx';

// Make sure marked and hljs are available globally from the CDN scripts in index.html
declare const marked: any;
declare const hljs: any;

interface MessageBubbleProps {
  entry: TranscriptEntry;
  onRegenerate: (messageId: string) => void;
  onRequestEdit: (file: File) => void;
  onRequestExtend?: (entryId: string, videoOperationResponse: any) => void;
}

const SpeakerIcon: React.FC<{ speaker: TranscriptEntry['speaker'] }> = ({ speaker }) => {
  const iconProps = { className: "w-5 h-5 text-white" };
  const wrapperClasses = "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center";
  switch(speaker) {
    case 'user': 
      return (
        <div className={clsx(wrapperClasses, 'bg-blue-500/80')}>
            <UserIcon {...iconProps} />
        </div>
      );
    case 'assistant': 
      return (
        <div className={clsx(wrapperClasses, 'bg-gradient-to-br from-purple-500 to-blue-500')}>
            <GeminiLogoIcon {...iconProps} />
        </div>
      );
    case 'system': return <SystemIcon className="w-6 h-6 text-yellow-400/80" />;
    default: return null;
  }
};

const FilePreview: React.FC<{ 
    entry: TranscriptEntry;
    onRequestEdit: (file: File) => void;
    onRequestExtend?: (entryId: string, videoOperationResponse: any) => void;
}> = ({ entry, onRequestEdit, onRequestExtend }) => {
    const { file, videoOperationResponse } = entry;
    if (!file) return null;

    const isFileObject = typeof File !== 'undefined' && file instanceof File;
    const isImage = isFileObject && file.type.startsWith('image/');
    const isVideo = isFileObject && file.type.startsWith('video/');

    const previewUrl = useMemo(() => {
        if (isFileObject) {
            return URL.createObjectURL(file);
        }
        return '';
    }, [file, isFileObject]);

    useEffect(() => {
        if (previewUrl) {
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [previewUrl]);

    const renderPreview = () => {
        if (isImage) {
            return <img src={previewUrl} alt={file.name} className="my-2 rounded-lg max-w-xs max-h-48 object-cover shadow-md" />;
        }
    
        if (isVideo) {
            return <video src={previewUrl} controls className="my-2 rounded-lg max-w-xs max-h-48 object-contain shadow-md" />;
        }
        
        return (
            <div className="my-2 p-2 bg-gray-600/50 rounded-lg flex items-center gap-2 text-xs">
                <FileIcon className="w-4 h-4" />
                <span>{file.name}</span>
            </div>
        );
    };

    return (
        <div className="relative group/preview">
            {renderPreview()}
            <div className="absolute bottom-2 right-2 mb-2 mr-2 flex items-center gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                {isImage && (
                    <button 
                        onClick={() => onRequestEdit(file as File)}
                        className="p-2 bg-gray-900/60 rounded-full text-white hover:bg-gray-700"
                        title="Edit image"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                )}
                 {isVideo && videoOperationResponse && onRequestExtend && (
                    <button
                        onClick={() => onRequestExtend(entry.id, videoOperationResponse)}
                        className="p-2 bg-gray-900/60 rounded-full text-white hover:bg-gray-700"
                        title="Extend video"
                    >
                        <MagicWandIcon className="w-4 h-4" />
                    </button>
                )}
                {isFileObject && (
                    <a 
                        href={previewUrl} 
                        download={file.name}
                        className="p-2 bg-gray-900/60 rounded-full text-white hover:bg-gray-700"
                        title="Download file"
                    >
                        <DownloadIcon className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ entry, onRegenerate, onRequestEdit, onRequestExtend }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && entry.speaker === 'assistant' && entry.text) {
      const parsedHtml = marked.parse(entry.text, { gfm: true, breaks: true });
      contentRef.current.innerHTML = parsedHtml;
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [entry.text, entry.speaker]);

  const bubbleClasses = clsx({
    'bg-blue-600/40 rounded-br-none': entry.speaker === 'user',
    'bg-gray-700/60 rounded-bl-none': entry.speaker === 'assistant',
    'bg-transparent text-yellow-400/90 text-xs italic self-center text-center': entry.speaker === 'system',
  });

  if (entry.speaker === 'system') {
    return (
      <div className="flex justify-center">
        <div className={bubbleClasses}>{entry.text}</div>
      </div>
    );
  }

  const isPending = entry.status === 'pending';

  return (
    <div className={clsx('group flex flex-col', entry.speaker === 'user' ? 'items-end' : 'items-start')}>
      <div className={clsx('flex items-start gap-3 max-w-full md:max-w-4xl', entry.speaker === 'user' ? 'flex-row-reverse' : 'flex-row')}>
        <SpeakerIcon speaker={entry.speaker} />
        <div className={clsx('px-4 py-2 rounded-2xl', bubbleClasses)}>
          {entry.file && <FilePreview entry={entry} onRequestEdit={onRequestEdit} onRequestExtend={onRequestExtend}/>}
          {isPending && (
             <div className="flex items-center gap-2 text-sm text-gray-300">
                <LoadingSpinnerIcon className="w-4 h-4" />
                <span>{entry.text}</span>
             </div>
          )}
          {!isPending && entry.speaker === 'assistant' ? (
            <div ref={contentRef} className="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-headings:my-3 prose-pre:bg-gray-800/80 prose-pre:p-3 prose-pre:rounded-md">
              {/* Content injected by marked */}
            </div>
          ) : !isPending ? (
            <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
          ) : null}
        </div>
        {entry.speaker === 'assistant' && !isPending && (
           <button 
             onClick={() => onRegenerate(entry.id)}
             className='self-center p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
             title='Regenerate response'
            >
             <RegenerateIcon className='w-4 h-4' />
           </button>
        )}
      </div>
    </div>
  );
};
