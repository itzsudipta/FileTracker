import React, { useCallback } from 'react';
import {
    Image,
    FileText,
    FileSpreadsheet,
    File,
    FileCode,
    FileArchive,
    Download,
    ExternalLink,
    Loader2,
    Trash2,
    Info
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
    viewMode?: 'list' | 'grid';
    onFileSelect: (file: FileData) => void;
    onFileOpen?: (file: FileData) => void;
    onFileDownload?: (file: FileData, e?: React.MouseEvent) => void;
    onFileDelete?: (file: FileData) => void;
    openingFile?: string | null;
}

const getFileIcon = (filename: string, type: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '') || type === 'image') {
        return { Icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-50/80' };
    }
    if (ext === 'pdf' || type === 'pdf') {
        return { Icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50/80' };
    }
    if (['xlsx', 'xls', 'csv'].includes(ext || '') || type === 'sheet') {
        return { Icon: FileSpreadsheet, color: 'text-emerald-700', bg: 'bg-emerald-50/80' };
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '') || type === 'doc') {
        return { Icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50/80' };
    }
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext || '')) {
        return { Icon: FileArchive, color: 'text-amber-600', bg: 'bg-amber-50/80' };
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'html', 'css', 'json', 'sql'].includes(ext || '')) {
        return { Icon: FileCode, color: 'text-violet-600', bg: 'bg-violet-50/80' };
    }
    return { Icon: File, color: 'text-slate-600', bg: 'bg-slate-100' };
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default function FileList({
    files = [],
    viewMode = 'list',
    onFileSelect,
    onFileOpen,
    onFileDownload,
    onFileDelete,
    openingFile
}: FileListProps) {

    const handleRowClick = useCallback((file: FileData) => {
        if (onFileOpen) {
            onFileOpen(file);
        } else {
            onFileSelect(file);
        }
    }, [onFileOpen, onFileSelect]);

    const renderActions = (file: FileData) => {
        const isOpening = openingFile === file.id;
        const buttonClass = 'grid size-8 shrink-0 place-items-center rounded-lg text-slate-600 transition-colors sm:size-9';
        const standardButtonClass = `${buttonClass} hover:bg-slate-100 hover:text-slate-900`;

        return (
            <div className="inline-flex shrink-0 items-center" onClick={event => event.stopPropagation()}>
                <button type="button" title="Preview file" aria-label="Preview file" disabled={isOpening} onClick={() => handleRowClick(file)} className={standardButtonClass}>
                    {isOpening ? <Loader2 className="size-4 animate-spin" /> : <ExternalLink className="size-4" />}
                </button>
                <button type="button" title="Download file" aria-label="Download file" onClick={event => onFileDownload?.(file, event)} className={standardButtonClass}>
                    <Download className="size-4" />
                </button>
                <button type="button" title="View file details" aria-label="View file details" onClick={() => onFileSelect(file)} className={standardButtonClass}>
                    <Info className="size-4" />
                </button>
                <button type="button" title="Delete file" aria-label="Delete file" onClick={() => onFileDelete?.(file)} className={`${buttonClass} hover:bg-red-50 hover:text-red-700`}>
                    <Trash2 className="size-4" />
                </button>
            </div>
        );
    };

    if (files.length === 0) {
        return null;
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4">
                {files.map((file) => {
                    const { Icon, color, bg } = getFileIcon(file.filename, file.type);

                    return (
                        <div
                            key={file.id}
                            onClick={() => handleRowClick(file)}
                            className="flex min-w-0 cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"
                        >
                            {/* Card Top */}
                            <div>
                                <div className={`mb-3 grid size-10 place-items-center rounded-xl ${bg}`}>
                                    <Icon className={`size-5 ${color}`} aria-hidden="true" />
                                </div>
                                <button
                                    type="button"
                                    title={file.filename}
                                    onClick={event => { event.stopPropagation(); handleRowClick(file); }}
                                    className="block max-w-full truncate text-left text-sm font-semibold text-slate-900 hover:underline"
                                >
                                    {file.filename}
                                </button>
                                <p className="mt-1 text-xs text-slate-600">
                                    {file.size} · {formatDate(file.uploaded_at)}
                                </p>
                            </div>

                            {/* Card Actions */}
                            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                                <span className="min-w-0 truncate text-xs text-slate-600" title={file.owner_name}>
                                    {file.owner_name}
                                </span>
                                {renderActions(file)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    // List View
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 tracking-wider">
                        <th scope="col" className="px-2 py-3 font-medium sm:px-4">Name</th>
                        <th scope="col" className="hidden w-24 px-3 py-3 font-medium sm:table-cell">Size</th>
                        <th scope="col" className="hidden w-32 px-3 py-3 font-medium md:table-cell">Uploaded</th>
                        <th scope="col" className="hidden w-36 px-3 py-3 font-medium lg:table-cell">Owner</th>
                        <th scope="col" className="w-36 px-2 py-3 text-right font-medium sm:w-44 sm:px-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {files.map((file) => {
                        const { Icon, color, bg } = getFileIcon(file.filename, file.type);

                        return (
                            <tr
                                key={file.id}
                                onClick={() => handleRowClick(file)}
                                className="group hover:bg-slate-50/70 transition-colors cursor-pointer"
                            >
                                {/* Name & Icon */}
                                <td className="px-2 py-3 sm:px-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className={`grid size-8 shrink-0 place-items-center rounded-lg sm:size-9 ${bg}`}>
                                            <Icon className={`size-4 ${color}`} aria-hidden="true" />
                                        </div>
                                        <div className="min-w-0">
                                            <button
                                                type="button"
                                                title={file.filename}
                                                onClick={event => { event.stopPropagation(); handleRowClick(file); }}
                                                className="block max-w-full truncate text-left font-medium text-slate-900 hover:underline"
                                            >
                                                {file.filename}
                                            </button>
                                            <p className="truncate text-xs text-slate-600 md:hidden" title={`${file.size} · ${formatDate(file.uploaded_at)}`}>
                                                <span className="sm:hidden">{file.size} · </span>{formatDate(file.uploaded_at)}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Size */}
                                <td className="hidden whitespace-nowrap px-3 py-3 text-xs font-medium text-slate-600 sm:table-cell">
                                    {file.size}
                                </td>

                                {/* Uploaded Date */}
                                <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-slate-600 md:table-cell">
                                    {formatDate(file.uploaded_at)}
                                </td>

                                {/* Owner */}
                                <td className="hidden truncate px-3 py-3 text-xs text-slate-600 lg:table-cell" title={file.owner_name}>
                                    {file.owner_name}
                                </td>

                                {/* Actions */}
                                <td className="px-2 py-3 text-right sm:px-4" onClick={event => event.stopPropagation()}>
                                    {renderActions(file)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
