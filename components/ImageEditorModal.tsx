import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon } from './icons';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  imageFile: File | null;
}

type Filter = 'none' | 'grayscale' | 'sepia' | 'invert';

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  imageFile,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [activeFilter, setActiveFilter] = useState<Filter>('none');

  const drawImage = useCallback((image: HTMLImageElement, filter: Filter = 'none') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    if (filter !== 'none') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            switch (filter) {
                case 'grayscale':
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    break;
                case 'sepia':
                    data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                    break;
                case 'invert':
                    data[i] = 255 - r;
                    data[i + 1] = 255 - g;
                    data[i + 2] = 255 - b;
                    break;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
  }, [dimensions]);

  useEffect(() => {
    if (isOpen && imageFile) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(imageFile);
      img.onload = () => {
        originalImageRef.current = img;
        const newAspectRatio = img.width / img.height;
        setAspectRatio(newAspectRatio);
        setDimensions({ width: img.width, height: img.height });
        setActiveFilter('none');
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } else {
      originalImageRef.current = null;
    }
  }, [isOpen, imageFile]);

  useEffect(() => {
    if (originalImageRef.current && dimensions.width > 0) {
      drawImage(originalImageRef.current, activeFilter);
    }
  }, [dimensions, activeFilter, drawImage]);


  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setDimensions({ width: newWidth, height: Math.round(newWidth / aspectRatio) });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setDimensions({ width: Math.round(newHeight * aspectRatio), height: newHeight });
  };

  const handleApplyFilter = (filter: Filter) => {
      setActiveFilter(filter);
  };
  
  const handleReset = () => {
    if(originalImageRef.current){
        setDimensions({ width: originalImageRef.current.width, height: originalImageRef.current.height });
        setActiveFilter('none');
    }
  };

  const handleSaveClick = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageFile) return;
    canvas.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], `edited_${imageFile.name}`, { type: blob.type });
        onSave(newFile);
      }
    }, imageFile.type, 0.95);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-4xl p-6 m-4 text-white relative animate-fade-in-up flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Image Editor</h2>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-1 gap-6 overflow-hidden">
            {/* Controls */}
            <div className="w-1/4 flex flex-col gap-6">
                <div>
                    <h3 className="font-semibold mb-2">Resize</h3>
                    <div className="flex gap-2">
                        <input type="number" value={dimensions.width} onChange={handleWidthChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Width" />
                        <input type="number" value={dimensions.height} onChange={handleHeightChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Height" />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Filters</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {(['none', 'grayscale', 'sepia', 'invert'] as Filter[]).map(filter => (
                            <button key={filter} onClick={() => handleApplyFilter(filter)} className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${activeFilter === filter ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                
                <button onClick={handleReset} className="mt-auto px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 font-semibold transition-colors">
                    Reset Changes
                </button>
            </div>
            
            {/* Canvas Preview */}
            <div className="w-3/4 bg-gray-900/50 rounded-md flex items-center justify-center p-4 overflow-auto">
                <canvas ref={canvasRef} className="max-w-full max-h-full object-contain"></canvas>
            </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 font-semibold transition-colors">
            Cancel
          </button>
          <button onClick={handleSaveClick} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold transition-colors">
            Save and Use Image
          </button>
        </div>
      </div>
    </div>
  );
};