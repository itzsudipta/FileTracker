import React from 'react';
import { Upload, Plus } from 'lucide-react';

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
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onClick}
            className={`group relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer p-6 sm:p-8 text-center ${
                dragActive
                    ? 'border-zinc-900 bg-zinc-100/80 scale-[1.005]'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
            }`}
        >
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                    dragActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'
                }`}>
                    <Upload className="w-5 h-5 stroke-[2]" />
                </div>
                <p className="text-sm font-semibold text-zinc-800">
                    {dragActive ? 'Drop files to upload' : 'Drag & drop your files here'}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                    or click to browse from your device
                </p>
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-medium shadow-xs group-hover:bg-zinc-800 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Select Files</span>
                </div>
            </div>
        </div>
    );
}
