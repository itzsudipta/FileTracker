import React from 'react';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
    dragActive: boolean;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onClick: () => void;
}

export default function UploadArea({
    dragActive,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onClick
}: UploadAreaProps) {
    return (
        <div
            className={`mb-4 lg:mb-6 p-6 sm:p-8 rounded-xl lg:rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${dragActive ? 'border-slate-400 bg-slate-50 shadow-lg' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onClick}
        >
            <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${dragActive ? 'bg-slate-200 scale-110' : 'bg-slate-50'}`}>
                    <Upload className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${dragActive ? 'text-slate-700' : 'text-slate-400'}`} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
                    {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                    or click to browse from your computer
                </p>
                <button
                    type="button"
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg sm:rounded-xl shadow-md transition-all duration-300"
                >
                    Select Files
                </button>
                <p className="mt-2 sm:mt-3 text-xs text-slate-400">
                    Supports PDF, Images, Excel up to 50MB
                </p>
            </div>
        </div>
    );
}
