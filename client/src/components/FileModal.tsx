import { useId, useState } from 'react';
import {
    X,
    FileText,
    Image,
    FileSpreadsheet,
    File,
    FileCode,
    FileArchive,
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
    const titleId = useId();
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
            <div
                role="dialog"
                aria-labelledby={titleId}
                className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5"
            >
                <div className="flex items-start gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                        <Icon className={`size-5 ${color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 id={titleId} className="wrap-anywhere text-sm font-semibold text-slate-900">
                            {file.filename}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">{file.size}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopyName}
                        aria-label={copied ? 'Filename copied' : 'Copy filename'}
                        title={copied ? 'Filename copied' : 'Copy filename'}
                        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                        {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close file details"
                        className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <dl className="mt-5 space-y-2 text-xs">
                    <div className="flex justify-between gap-3">
                        <dt className="shrink-0 text-slate-500">Uploaded</dt>
                        <dd className="text-right text-slate-800">{formatUploadedAt(file.uploaded_at)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="shrink-0 text-slate-500">Uploaded by</dt>
                        <dd className="min-w-0 wrap-anywhere text-right text-slate-800">{file.owner_name}</dd>
                    </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    {onOpen && (
                        <button
                            type="button"
                            onClick={() => { onOpen(file); onClose(); }}
                            className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            Preview
                        </button>
                    )}
                    {onDownload && (
                        <button
                            type="button"
                            onClick={() => { onDownload(file); onClose(); }}
                            className="flex-1 cursor-pointer rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                        >
                            Download
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => { onDelete(file); onClose(); }}
                            className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
