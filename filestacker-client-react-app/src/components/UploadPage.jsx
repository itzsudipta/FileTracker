import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';

export const UploadPage = ({ onUpload, darkMode }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
    const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
    const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files);
        }
    };

    const handleFileUpload = (uploadedFiles) => {
        setIsUploading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    onUpload(uploadedFiles);
                    setSelectedFile(null);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold mb-6">Upload Files</h2>

            <div
                className={`${cardBg} rounded-xl p-12 border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-500/10' : borderColor} transition-all duration-300`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${isUploading ? 'animate-pulse' : ''}`}>
                        <UploadCloud className="w-10 h-10 text-white" />
                    </div>

                    {!isUploading ? (
                        <>
                            <h3 className="text-2xl font-bold mb-2">Upload Your Files</h3>
                            <p className={`${textSecondary} mb-6`}>
                                Drag and drop your files here, or click to browse
                            </p>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={(e) => e.target.files.length > 0 && handleFileUpload(e.target.files)}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Choose Files
                            </button>

                            <p className={`text-xs ${textSecondary} mt-4`}>
                                Supported formats: PDF, Images, Videos, Documents
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold mb-2">Uploading...</h3>
                            <p className={`${textSecondary} mb-6`}>{progress}% complete</p>

                            <div className="max-w-md mx-auto">
                                <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Upload Tips */}
            <div className={`${cardBg} rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
                <h4 className="font-semibold mb-3">Upload Tips</h4>
                <ul className={`space-y-2 ${textSecondary} text-sm`}>
                    <li>• Maximum file size: 100 MB per file</li>
                    <li>• You can upload multiple files at once</li>
                    <li>• Files are automatically scanned for security</li>
                    <li>• All uploads are encrypted and secure</li>
                </ul>
            </div>
        </div>
    );
};
