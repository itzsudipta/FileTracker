import React from 'react';
import { Image, FileText, MoreVertical, FileSpreadsheet, File, Download, Share2, Trash2 } from 'lucide-react';

export interface FileData {
    id: number;
    filename: string;
    type: string;
    size: string;
    uploaded_at: string;
    owner_name: string;
}

interface FileListProps {
    files: FileData[];
    onFileSelect: (file: FileData) => void;
}

export default function FileList({ files, onFileSelect }: FileListProps) {
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <Image className="w-5 h-5 text-emerald-600" />;
            case 'pdf':
                return <FileText className="w-5 h-5 text-rose-600" />;
            case 'sheet':
                return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
            default:
                return <File className="w-5 h-5 text-slate-600" />;
        }
    };

    const getFileBg = (type: string) => {
        switch (type) {
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
        <div className="flex-1 overflow-y-auto">
            {/* File Table */}
            <div className="px-8 pb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4 text-left">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">File Name</span>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Size</span>
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Modified</span>
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {files.map((file, index) => (
                                <tr
                                    key={file.id}
                                    onClick={() => onFileSelect(file)}
                                    className="group hover:bg-slate-50/80 cursor-pointer transition-all duration-200"
                                    style={{
                                        animationDelay: `${index * 50}ms`
                                    }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-12 h-12 rounded-xl flex items-center justify-center shadow-sm
                                                ${getFileBg(file.type)}
                                                group-hover:scale-110 group-hover:shadow-md transition-all duration-300
                                            `}>
                                                {getFileIcon(file.type)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                                                    {file.filename}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5 capitalize">
                                                    {file.type} Document
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                            {file.size}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(file.uploaded_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                                title="Share"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="w-px h-4 bg-slate-200 mx-1" />
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {files.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center">
                                <File className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-1">No files yet</h3>
                            <p className="text-sm text-slate-400">Upload your first file to get started</p>
                        </div>
                    )}
                </div>

                {/* Pagination / Footer */}
                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing <span className="font-semibold text-slate-700">{files.length}</span> files</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}