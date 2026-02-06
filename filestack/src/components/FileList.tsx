import React, { useCallback } from 'react';
import {
    Image,
    FileText,
    MoreVertical,
    FileSpreadsheet,
    File,
    Download,
    ExternalLink,
    Loader2,
    Trash2
} from 'lucide-react';

export interface FileData {
    id: string;
    filename: string;
    type: string;
    size: string;
    uploaded_at: string;
    owner_name: string;
    storage_path?: string;
    url?: string;
    raw_size?: number;
}

interface FileListProps {
    files?: FileData[];
    onFileSelect: (file: FileData) => void;
    onFileOpen?: (file: FileData) => void;
    onFileDownload?: (file: FileData, e?: React.MouseEvent) => void;
    onFileDelete?: (file: FileData) => void;
    openingFile?: string | null;
}


const FILE_ICONS = {
    image: { icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    pdf: { icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    sheet: { icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    default: { icon: File, color: 'text-slate-600', bg: 'bg-slate-100' }
} as const;


const getFileIconConfig = (type: string) => {
    return FILE_ICONS[type as keyof typeof FILE_ICONS] || FILE_ICONS.default;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function FileList({
    files = [],
    onFileSelect,
    onFileOpen,
    onFileDownload,
    onFileDelete,
    openingFile
}: FileListProps) {
    
    const handleRowClick = useCallback((file: FileData) => {
        if (onFileOpen) {
            onFileOpen(file);
        } else if (file.url) {
            window.open(file.url, '_blank');
        } else {
            onFileSelect(file);
        }
    }, [onFileOpen, onFileSelect]);

   
    const handleDownload = useCallback((e: React.MouseEvent, file: FileData) => {
        e.stopPropagation();
        if (onFileDownload) {
            onFileDownload(file, e);
        } else if (file.url) {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [onFileDownload]);

   
    const handleDetailsClick = useCallback((e: React.MouseEvent, file: FileData) => {
        e.stopPropagation();
        onFileSelect(file);
    }, [onFileSelect]);

    
    const handleDeleteClick = useCallback((e: React.MouseEvent, file: FileData) => {
        e.stopPropagation();
        if (onFileDelete) {
            onFileDelete(file);
        }
    }, [onFileDelete]);

    
    const renderFileIcon = useCallback((type: string, isLoading: boolean) => {
        if (isLoading) {
            return <Loader2 className="w-5 h-5 animate-spin text-slate-600" />;
        }
        const config = getFileIconConfig(type);
        const IconComponent = config.icon;
        return <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${config.color}`} />;
    }, []);

    
    const getFileBgClass = useCallback((type: string) => {
        return getFileIconConfig(type).bg;
    }, []);

    if (files.length === 0) {
        return (
            <div className="py-12 sm:py-16 text-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-slate-50 rounded-full flex items-center justify-center">
                    <File className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-1">Upload your first file</h3>
                <p className="text-xs sm:text-sm text-slate-400">Start by adding a file to your workspace</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            
            <div className="min-w-full">
                
                <div className="hidden sm:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="col-span-6 lg:col-span-5">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">File Name</span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</span>
                    </div>
                    <div className="col-span-3 lg:col-span-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Modified</span>
                    </div>
                    <div className="col-span-1 lg:col-span-2 text-right">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</span>
                    </div>
                </div>

                
                <div className="sm:hidden px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Files</span>
                    <span className="text-xs text-slate-400">{files.length} items</span>
                </div>

                {/* File Items */}
                <div className="divide-y divide-slate-50">
                    {files.map((file) => {
                        const isLoading = openingFile === file.id;
                        const fileBgClass = getFileBgClass(file.type);

                        return (
                            <div
                                key={file.id}
                                className="group hover:bg-slate-50/80 transition-all duration-200"
                            >
                              
                                <div
                                    className="hidden sm:grid grid-cols-12 gap-4 px-4 lg:px-6 py-3 lg:py-4 items-center cursor-pointer"
                                    onClick={() => handleRowClick(file)}
                                >
                                    <div className="col-span-6 lg:col-span-5">
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${fileBgClass} group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                                                {renderFileIcon(file.type, isLoading)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate text-sm lg:text-base">
                                                    {file.filename}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5 capitalize hidden lg:block">
                                                    {file.type} Document
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                            {file.size}
                                        </span>
                                    </div>
                                    <div className="col-span-3 lg:col-span-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate text-xs lg:text-sm">
                                                {formatDate(file.uploaded_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-1 lg:col-span-2 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRowClick(file);
                                                }}
                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                                                title="Open"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <ExternalLink className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => handleDownload(e, file)}
                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                                                title="Download"
                                                disabled={isLoading}
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {onFileDelete && (
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, file)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDetailsClick(e, file)}
                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all hidden lg:block"
                                                title="Details"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="sm:hidden px-4 py-4 cursor-pointer active:bg-slate-100 transition-colors"
                                    onClick={() => handleRowClick(file)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${fileBgClass}`}>
                                            {renderFileIcon(file.type, isLoading)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-slate-800 text-sm truncate pr-2">
                                                        {file.filename}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-slate-400 capitalize">
                                                            {file.type}
                                                        </span>
                                                        <span className="text-xs text-slate-300">•</span>
                                                        <span className="text-xs text-slate-500">
                                                            {file.size}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {formatDate(file.uploaded_at)}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-1 shrink-0">
                                                    <button
                                                        onClick={(e) => handleDownload(e, file)}
                                                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                                                        disabled={isLoading}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    {onFileDelete && (
                                                        <button
                                                            onClick={(e) => handleDeleteClick(e, file)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            disabled={isLoading}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-8 pb-4 sm:pb-8 text-sm text-slate-500">
                <p className="text-xs sm:text-sm">Showing <span className="font-semibold text-slate-700">{files.length}</span> files</p>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 text-xs sm:text-sm" disabled>
                        Previous
                    </button>
                    <button className="px-3 py-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 text-xs sm:text-sm" disabled>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
