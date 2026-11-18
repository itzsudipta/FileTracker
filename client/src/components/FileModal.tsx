import { useState } from 'react';
import {
    X,
    FileText,
    Image,
    FileSpreadsheet,
    File,
    FileCode,
    FileArchive,
    User,
    Calendar,
    HardDrive,
    ExternalLink,
    Download,
    Trash2,
    Copy,
    Check
} from 'lucide-react';
import type { FileData } from './FileList';

interface FileModalProps {
    file: FileData & {
        owner_name: string;
    };
    onClose: () => void;
    onOpen?: (file: FileData) => void;
    onDownload?: (file: FileData) => void;
    onDelete?: (file: FileData) => void;
}

const getFileIconConfig = (filename: string, type: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '') || type === 'image') {
        return { Icon: Image, color: 'text-emerald-600', bg: 'bg-emerald-50' };
    }
    if (ext === 'pdf' || type === 'pdf') {
        return { Icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' };
    }
    if (['xlsx', 'xls', 'csv'].includes(ext || '') || type === 'sheet') {
        return { Icon: FileSpreadsheet, color: 'text-emerald-700', bg: 'bg-emerald-50' };
    }
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '') || type === 'doc') {
        return { Icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' };
    }
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext || '')) {
        return { Icon: FileArchive, color: 'text-amber-600', bg: 'bg-amber-50' };
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'html', 'css', 'json', 'sql'].includes(ext || '')) {
        return { Icon: FileCode, color: 'text-violet-600', bg: 'bg-violet-50' };
    }
    return { Icon: File, color: 'text-slate-600', bg: 'bg-slate-100' };
};

export default function FileModal({ file, onClose, onOpen, onDownload, onDelete }: FileModalProps) {
    const [copied, setCopied] = useState(false);
    const { Icon, color, bg } = getFileIconConfig(file.filename, file.type);

    const formatUploadedAt = (dateString: string): string => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleCopyName = () => {
        navigator.clipboard.writeText(file.filename);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs p-4">
            <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h2 className="text-sm font-semibold text-slate-900">File Details</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {/* File Header Card */}
                    <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-5">
                        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                            <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm text-slate-900 truncate" title={file.filename}>
                                {file.filename}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">{file.size}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopyName}
                            title="Copy filename"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Metadata Items */}
                    <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="flex items-center gap-2 text-slate-500">
                                <HardDrive className="w-3.5 h-3.5" /> Size
                            </span>
                            <span className="font-medium text-slate-800">{file.size}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                            <span className="flex items-center gap-2 text-slate-500">
                                <Calendar className="w-3.5 h-3.5" /> Uploaded
                            </span>
                            <span className="font-medium text-slate-800">{formatUploadedAt(file.uploaded_at)}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2">
                            <span className="flex shrink-0 items-center gap-2 text-slate-500">
                                <User className="w-3.5 h-3.5" /> Uploaded by
                            </span>
                            <span className="min-w-0 wrap-anywhere text-right font-medium text-slate-800">{file.owner_name}</span>
                        </div>

                        {file.storage_path && (
                            <div className="flex items-center justify-between gap-3 py-2">
                                <span className="shrink-0 text-slate-500">Storage Key</span>
                                <span className="min-w-0 max-w-[200px] truncate font-mono text-[11px] text-slate-600" title={file.storage_path}>
                                    {file.storage_path}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => { onOpen?.(file); onClose(); }}
                            className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { onDownload?.(file); onClose(); }}
                            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                        </button>
                    </div>

                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => { onDelete(file); onClose(); }}
                            className="w-full mt-2 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete File</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
