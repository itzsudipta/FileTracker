import { Loader2 } from 'lucide-react';

interface UploadProgressModalProps {
    uploadProgress: number;
}

export default function UploadProgressModal({ uploadProgress }: UploadProgressModalProps) {
    const safeProgress = Math.min(100, Math.max(0, uploadProgress));

    return (
        <div className="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:bottom-6 sm:right-6">
            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-xl sm:w-80">
                <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
                        <span className="text-xs font-semibold tracking-wide">Uploading...</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-400">
                        {Math.round(safeProgress)}%
                    </span>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-200 rounded-full"
                        style={{ width: `${safeProgress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
