import React from 'react';
import { X, FileText, Image, FileSpreadsheet, File, User, Calendar, HardDrive } from 'lucide-react';
import type { FileData } from './FileList';

interface FileModalProps {
    file: FileData & {
        owner_name: string;   // ADDED FIELD
    };
    onClose: () => void;
}

export default function FileModal({ file, onClose }: FileModalProps) {
    const getFileIcon = () => {
        switch (file.type) {
            case 'image':
                return <Image className="w-8 h-8 text-emerald-600" />;
            case 'pdf':
                return <FileText className="w-8 h-8 text-rose-600" />;
            case 'sheet':
                return <FileSpreadsheet className="w-8 h-8 text-emerald-600" />;
            default:
                return <File className="w-8 h-8 text-slate-600" />;
        }
    };

    const getFileBg = () => {
        switch (file.type) {
            case 'image':
                return 'bg-emerald-50';
            case 'pdf':
                return 'bg-rose-50';
            case 'sheet':
                return 'bg-emerald-50';
            default:
                return 'bg-slate-100';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800">File Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

              
                <div className="p-8 flex flex-col items-center text-center">

                    <div className={`w-20 h-20 ${getFileBg()} rounded-2xl flex items-center justify-center mb-6`}>
                        {getFileIcon()}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-6 break-all">
                        {file.filename}
                    </h3>

                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                            <div className="flex items-center gap-2 text-slate-500">
                                <HardDrive className="w-4 h-4" />
                                <span className="text-sm">Size</span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">{file.size}</span>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-50">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Uploaded</span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">{file.uploaded_at}</span>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-2 text-slate-500">
                                <User className="w-4 h-4" />
                                <span className="text-sm">Uploaded by</span>
                            </div>

                            <span className="text-sm font-medium text-slate-800">
                                {file.owner_name}
                            </span>

                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
