import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import FileList, { type FileData } from './FileList';
import FileModal from './FileModal';
import type { UserData } from './Auth';
import { Loader2 } from 'lucide-react';
import { apiFetch, apiFetchForm } from '../api/client';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import UploadArea from './UploadArea';
import UploadProgressModal from './UploadProgressModal';
import AppFooter from './AppFooter';

interface DashboardProps {
    user: UserData;
    onLogout: () => void;
}

// Constants
const MOBILE_BREAKPOINT = 1024;
const STORAGE_LIMIT_BYTES = 1 * 1024 * 1024 * 1024;

// Utility functions
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const mapFileType = (filename: string, mimeType?: string): string => {
    const fileExt = filename.split('.').pop()?.toLowerCase();
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (['xlsx', 'xls', 'csv'].includes(fileExt || '')) return 'sheet';
    if (['doc', 'docx'].includes(fileExt || '')) return 'doc';
    return 'file';
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
    // State management
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [openingFile, setOpeningFile] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const hasLoadedRef = useRef(false);
    // Check viewport size
    const checkMobile = useCallback(() => {
        const mobile = window.innerWidth < MOBILE_BREAKPOINT;
        setIsMobile(mobile);
        if (mobile) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
            setSidebarCollapsed(false);
        }
    }, []);

    // Transform raw DB data to FileData
    const transformFileData = useCallback((data: any[]): FileData[] => {
        return data.map((file: any) => ({
            id: file.file_id,
            filename: file.filename,
            type: mapFileType(file.filename, file.file_type),
            size: formatFileSize(file.file_size),
            uploaded_at: file.uploaded_at,
            storage_path: file.storage_path,
            raw_size: typeof file.file_size === 'number' ? file.file_size : 0,
            owner_name: file.owner_name || 'Unknown'
        }));
    }, []);

    const totalUsedBytes = useMemo(
        () => files.reduce((sum, f: any) => sum + (typeof f.raw_size === 'number' ? f.raw_size : 0), 0),
        [files]
    );

    // Fetch files from database
    const fetchFiles = useCallback(async (silent: boolean = false) => {
        try {
            if (!silent) {
                setLoading(true);
            }

            const data = await apiFetch<any[]>(`/api/files`);
            const safeData = Array.isArray(data) ? data : [];
            setFiles(transformFileData(safeData));
            hasLoadedRef.current = true;
        } catch (error) {
            console.error('Error fetching files:', error);
            if (!silent) {
                setFiles([]);
            }
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [user.org_id, transformFileData]);

    // Initial load and realtime setup
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Periodic refresh to catch out-of-band deletes
    useEffect(() => {
        const intervalId = window.setInterval(() => {
            fetchFiles(true);
        }, 30000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [fetchFiles]);

    // Refresh when returning to tab/window
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchFiles(true);
            }
        };

        window.addEventListener('focus', handleVisibility);
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('focus', handleVisibility);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [fetchFiles]);

    // Viewport detection
    useEffect(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [checkMobile]);

    useEffect(() => {
        if (!toast) return;
        const timer = window.setTimeout(() => setToast(null), 3000);
        return () => window.clearTimeout(timer);
    }, [toast]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobile, sidebarOpen]);

    // Handle file upload
    const handleFileUpload = useCallback(async (filesToUpload: FileList | null) => {
        if (!filesToUpload || filesToUpload.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const totalFiles = filesToUpload.length;

            for (let i = 0; i < totalFiles; i++) {
                const file = filesToUpload[i];
                const progressBase = (i / totalFiles) * 100;

                // Update progress - start
                setUploadProgress(progressBase + 10);

                const formData = new FormData();
                formData.append('file', file);
                await apiFetchForm(`/api/files/upload`, formData);

                setUploadProgress(progressBase + 100);
            }

            // Real-time subscription will auto-refresh, but we can force it
            await fetchFiles();

        } catch (error: any) {
            console.error('Upload error:', error);
            setToast({ message: `Failed to upload file: ${error.message}`, type: 'error' });
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [user.org_id, user.user_id, fetchFiles]);

    // Handle file open
    const handleFileOpen = useCallback(async (file: FileData) => {
        if (!file.storage_path) {
            setToast({ message: 'File path not found', type: 'error' });
            return;
        }

        try {
            setOpeningFile(file.id);

            const data = await apiFetch<{ signed_url: string }>(`/api/files/${file.id}/download`);
            if (data?.signed_url) {
                window.open(data.signed_url, '_blank');
            }
        } catch (error) {
            console.error('Error opening file:', error);
            setToast({ message: 'Failed to open file', type: 'error' });
        } finally {
            setOpeningFile(null);
        }
    }, []);

    // Handle file download
    const handleFileDownload = useCallback(async (file: FileData, e?: React.MouseEvent) => {
        e?.stopPropagation();

        if (!file.storage_path) {
            setToast({ message: 'File path not found', type: 'error' });
            return;
        }

        try {
            setOpeningFile(file.id);

            const data = await apiFetch<{ signed_url: string; filename: string }>(`/api/files/${file.id}/download`);
            if (data?.signed_url) {
                const link = document.createElement('a');
                link.href = data.signed_url;
                link.download = file.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            setToast({ message: 'Failed to download file', type: 'error' });
        } finally {
            setOpeningFile(null);
        }
    }, []);

    // Handle file delete (remove from storage and DB)
    const handleFileDelete = useCallback(async (file: FileData) => {
        try {
            const confirmDelete = window.confirm(`Delete file: ${file.filename}?`);
            if (!confirmDelete) return;

            // Optimistic update - remove from UI immediately
            setFiles(prev => prev.filter(f => f.id !== file.id));

            await apiFetch(`/api/files/${file.id}`, { method: 'DELETE' });
            await fetchFiles(true);
            setToast({ message: 'File deleted successfully', type: 'success' });

        } catch (error) {
            console.error("Delete error:", error);
            setToast({ message: 'Failed to delete file', type: 'error' });
        }
    }, [fetchFiles]);


    // Drag and drop handlers
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileUpload(e.dataTransfer.files);
    }, [handleFileUpload]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e.target.files);
    }, [handleFileUpload]);

    const toggleSidebar = useCallback(() => {
        if (isMobile) {
            setSidebarOpen(prev => !prev);
        } else {
            setSidebarCollapsed(prev => !prev);
        }
    }, [isMobile]);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-[60] w-full max-w-sm">
                    <div className={`rounded-2xl border shadow-2xl px-4 py-3 backdrop-blur-md ${toast.type === 'success'
                        ? 'bg-emerald-50/90 border-emerald-100 text-emerald-900'
                        : 'bg-rose-50/90 border-rose-100 text-rose-900'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${toast.type === 'success'
                                ? 'bg-emerald-100'
                                : 'bg-rose-100'
                                }`}>
                                {toast.type === 'success' ? (
                                    <svg className="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-rose-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                            <p className="text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => setToast(null)}
                                className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleChange}
            />

            {/* Mobile Sidebar Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Upload Progress Modal */}
            {uploading && (
                <UploadProgressModal uploadProgress={uploadProgress} />
            )}

            {/* Responsive Sidebar */}
            <DashboardSidebar
                isMobile={isMobile}
                sidebarOpen={sidebarOpen}
                sidebarCollapsed={sidebarCollapsed}
                sidebarRef={sidebarRef}
                setSidebarOpen={setSidebarOpen}
                usedBytes={totalUsedBytes}
                limitBytes={STORAGE_LIMIT_BYTES}
                formatBytes={formatFileSize}
            />

            {/* Main content area */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10 w-full">
                {/* Responsive Navbar */}
                <DashboardHeader
                    user={user}
                    toggleSidebar={toggleSidebar}
                    sidebarCollapsed={sidebarCollapsed}
                    onLogout={onLogout}
                />

                {/* Content scroll area - Responsive */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-thin">
                    {/* Page header - Responsive */}
                    <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">My Files</h1>
                            <p className="mt-1 text-sm sm:text-base text-slate-500">Manage and organize your documents</p>
                        </div>

                        <button
                            onClick={handleClick}
                            disabled={uploading}
                            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white rounded-xl font-medium shadow-lg shadow-slate-300/40 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-full sm:w-auto"
                        >
                            {uploading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                            <span className="hidden sm:inline">{uploading ? 'Uploading...' : 'Upload File'}</span>
                            <span className="sm:hidden">Upload</span>
                        </button>
                    </div>

                    {/* Upload Area - Responsive */}
                    <UploadArea
                        dragActive={dragActive}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    />

                    {/* File list container - Responsive */}
                    <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800 text-sm sm:text-base">My Files</h2>
                            <div className="flex gap-1 sm:gap-2">
                                <button className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <button className="p-1.5 sm:p-2 text-slate-600 bg-slate-100 rounded-lg">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="py-12 sm:py-16 text-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
                                <p className="text-sm text-slate-500">Loading files...</p>
                            </div>
                        ) : (
                            <FileList
                                files={files}
                                onFileSelect={setSelectedFile}
                                onFileOpen={handleFileOpen}
                                onFileDownload={handleFileDownload}
                                onFileDelete={handleFileDelete}
                                openingFile={openingFile}
                            />
                        )}
                    </div>
                </div>
                <AppFooter />
            </main>

            {/* Modal */}
            {selectedFile && (
                <FileModal
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>
    );
}
