import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import { formatBytes, formatDate, getFileIcon } from '../utils/formatters.jsx';

const InfoRow = ({ label, value, textSecondary }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
        <span className={`text-sm ${textSecondary}`}>{label}</span>
        <span className="font-medium text-right max-w-xs truncate">{value}</span>
    </div>
);

export const FileModal = ({ file, onClose, darkMode }) => {
    if (!file) return null;

    const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
    const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
    const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';

    const handleDelete = () => {
        // Add delete logic here
        onClose();
    };

    const handleDownload = () => {
        // Add download logic here
        console.log('Downloading', file.name);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className={`${cardBg} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${borderColor} transition-colors duration-300 ${textPrimary}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
                    <h3 className="text-xl font-bold">File Details</h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg hover:bg-slate-700/50 ${textSecondary} hover:${textPrimary} transition-colors`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* File Preview */}
                    <div className="flex items-center justify-center p-12 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
                            {getFileIcon(file.type)}
                        </div>
                    </div>

                    {/* File Info */}
                    <div className="space-y-4">
                        <InfoRow label="Name" value={file.name} textSecondary={textSecondary} />
                        <InfoRow label="Size" value={formatBytes(file.size)} textSecondary={textSecondary} />
                        <InfoRow label="Type" value={file.type} textSecondary={textSecondary} />
                        <InfoRow label="Uploaded" value={formatDate(file.uploadDate)} textSecondary={textSecondary} />
                        <InfoRow label="Uploaded by" value={file.user} textSecondary={textSecondary} />
                        <div className="flex items-start justify-between py-3">
                            <span className={`text-sm ${textSecondary}`}>Tags</span>
                            <div className="flex flex-wrap gap-2 justify-end">
                                {file.tags && file.tags.length > 0 ? (
                                    file.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className={`text-sm ${textSecondary}`}>No tags</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className={`px-4 py-3 border ${borderColor} rounded-lg font-medium hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 flex items-center justify-center space-x-2`}
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
