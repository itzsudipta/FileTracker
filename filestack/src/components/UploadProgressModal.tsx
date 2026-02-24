import { Loader2 } from 'lucide-react';

interface UploadProgressModalProps {
    uploadProgress: number;
}

export default function UploadProgressModal({ uploadProgress }: UploadProgressModalProps) {
    const safeProgress = Math.min(100, Math.max(0, uploadProgress));
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-sm mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-slate-600 animate-spin" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 text-center mb-2">Uploading...</h3>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-slate-800 transition-all duration-300"
                        style={{ width: `${safeProgress}%` }}
                    />
                </div>
                <p className="text-sm text-slate-500 text-center">{Math.round(safeProgress)}%</p>
            </div>
        </div>
    );
}
