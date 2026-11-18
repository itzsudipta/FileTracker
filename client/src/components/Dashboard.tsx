import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import FileList, { type FileData } from './FileList';
import FileModal from './FileModal';
import type { UserData } from './Auth';
import {
    Loader2,
    LayoutList,
    LayoutGrid,
    ArrowUpDown,
    Upload,
    Search,
    FolderOpen,
    CheckCircle2,
    AlertCircle,
    X
} from 'lucide-react';
import { apiFetch, apiUploadFile } from '../api/client';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import UploadProgressModal from './UploadProgressModal';

interface DashboardProps {
    user: UserData;
    onLogout: () => void;
}

interface RawBackendFile {
    file_id: string;
    filename: string;
    file_type?: string;
    file_size?: number;
    uploaded_at: string;
    storage_path?: string;
    owner_name?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'size-desc';

const STORAGE_LIMIT_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB limit

const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const mapFileType = (filename: string, mimeType?: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return 'image';
    if (mimeType === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (['xlsx', 'xls', 'csv'].includes(ext || '')) return 'sheet';
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) return 'doc';
    if (['zip', 'tar', 'gz', 'rar', '7z'].includes(ext || '')) return 'archive';
    return 'file';
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
    const [openingFile, setOpeningFile] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Filters and Display
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');
    const [windowDragActive, setWindowDragActive] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);

    // Transform DB files
    const transformFileData = useCallback((data: RawBackendFile[]): FileData[] => {
        return data.map((file) => ({
            id: file.file_id,
            filename: file.filename,
            type: mapFileType(file.filename, file.file_type),
            size: formatFileSize(file.file_size || 0),
            uploaded_at: file.uploaded_at,
            storage_path: file.storage_path,
            raw_size: typeof file.file_size === 'number' ? file.file_size : 0,
            owner_name: file.owner_name || user.user_name || 'You'
        }));
    }, [user.user_name]);

    // Fetch Files
    const fetchFiles = useCallback(async (silent: boolean = false) => {
        try {
            if (!silent) setLoading(true);
            const data = await apiFetch<RawBackendFile[]>('/api/files');
            const safeData = Array.isArray(data) ? data : [];
            setFiles(transformFileData(safeData));
        } catch (error) {
            console.error('Error fetching files:', error);
            if (!silent) setFiles([]);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [transformFileData]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Toast auto-dismiss
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    // Total storage used in bytes
    const totalUsedBytes = useMemo(
        () => files.reduce((sum, f) => sum + (f.raw_size || 0), 0),
        [files]
    );

    // Handle Upload
    const handleFileUpload = useCallback(async (filesToUpload: FileList | null) => {
        if (!filesToUpload || filesToUpload.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const totalFiles = filesToUpload.length;
            const filesArray = Array.from(filesToUpload);
            const totalBytes = filesArray.reduce((sum, f) => sum + (f.size || 0), 0);
            const safeTotal = totalBytes > 0 ? totalBytes : totalFiles;
            let loadedBytesSoFar = 0;

            for (let i = 0; i < totalFiles; i++) {
                const file = filesArray[i];
                const weight = totalBytes > 0 ? file.size : 1;
                const formData = new FormData();
                formData.append('file', file);

                await apiUploadFile('/api/files/upload', formData, {
                    onProgress: (loaded) => {
                        const currentLoaded = Math.min(loaded, weight);
                        const progress = ((loadedBytesSoFar + currentLoaded) / safeTotal) * 100;
                        setUploadProgress(Math.min(100, progress));
                    }
                });

                loadedBytesSoFar += weight;
                setUploadProgress(Math.min(100, (loadedBytesSoFar / safeTotal) * 100));
            }

            setToast({ message: `${totalFiles} file(s) uploaded successfully`, type: 'success' });
            await fetchFiles(true);
        } catch (error: unknown) {
            console.error('Upload error:', error);
            const message = error instanceof Error ? error.message : 'Failed to upload file';
            setToast({ message, type: 'error' });
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [fetchFiles]);

    // Global drag-and-drop listener
    useEffect(() => {
        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current += 1;
            if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
                setWindowDragActive(true);
            }
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current -= 1;
            if (dragCounter.current <= 0) {
                dragCounter.current = 0;
                setWindowDragActive(false);
            }
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            dragCounter.current = 0;
            setWindowDragActive(false);
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files);
            }
        };

        window.addEventListener('dragenter', handleDragEnter);
        window.addEventListener('dragleave', handleDragLeave);
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);

        return () => {
            window.removeEventListener('dragenter', handleDragEnter);
            window.removeEventListener('dragleave', handleDragLeave);
            window.removeEventListener('dragover', handleDragOver);
            window.removeEventListener('drop', handleDrop);
        };
    }, [handleFileUpload]);

    // Handle Open (Presigned inline preview)
    const handleFileOpen = useCallback(async (file: FileData) => {
        try {
            setOpeningFile(file.id);
            const data = await apiFetch<{ signed_url: string }>(`/api/files/${file.id}/open`);
            if (data?.signed_url) {
                window.open(data.signed_url, '_blank', 'noopener,noreferrer');
            }
        } catch (error: unknown) {
            console.error('Open error:', error);
            const message = error instanceof Error ? error.message : 'Failed to open file preview';
            setToast({ message, type: 'error' });
        } finally {
            setOpeningFile(null);
        }
    }, []);

    // Handle Download (Presigned attachment)
    const handleFileDownload = useCallback(async (file: FileData, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            setOpeningFile(file.id);
            const data = await apiFetch<{ signed_url: string; filename: string }>(`/api/files/${file.id}/download`);
            if (data?.signed_url) {
                const res = await fetch(data.signed_url);
                if (!res.ok) throw new Error('Download request failed');
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = file.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);
            }
        } catch (error: unknown) {
            console.error('Download error:', error);
            const message = error instanceof Error ? error.message : 'Failed to download file';
            setToast({ message, type: 'error' });
        } finally {
            setOpeningFile(null);
        }
    }, []);

    // Handle Delete
    const handleFileDelete = useCallback(async (file: FileData) => {
        if (!window.confirm(`Delete "${file.filename}"?`)) return;

        // Optimistic UI update
        setFiles(prev => prev.filter(f => f.id !== file.id));

        try {
            await apiFetch(`/api/files/${file.id}`, { method: 'DELETE' });
            setToast({ message: `Deleted "${file.filename}"`, type: 'success' });
            await fetchFiles(true);
        } catch (error: unknown) {
            console.error('Delete error:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete file';
            setToast({ message, type: 'error' });
            await fetchFiles(true);
        }
    }, [fetchFiles]);

    // Filter & Sort Pipeline
    const processedFiles = useMemo(() => {
        let result = [...files];

        // Search query
        if (searchQuery.trim()) {
            const query = searchQuery.trim().toLowerCase();
            result = result.filter(f =>
                f.filename.toLowerCase().includes(query) ||
                f.owner_name.toLowerCase().includes(query)
            );
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
            }
            if (sortBy === 'date-asc') {
                return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
            }
            if (sortBy === 'name-asc') {
                return a.filename.localeCompare(b.filename);
            }
            if (sortBy === 'size-desc') {
                return (b.raw_size || 0) - (a.raw_size || 0);
            }
            return 0;
        });

        return result;
    }, [files, searchQuery, sortBy]);

    const uploadButton = (
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4 md:w-full"
        >
            <Upload className="size-4" aria-hidden="true" />
            Upload
        </button>
    );

    return (
        <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-950">
            {/* Hidden native file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
            />

            {/* Global Drag-and-Drop Overlay */}
            {windowDragActive && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-6 pointer-events-none">
                    <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-blue-400 bg-white p-6 text-center shadow-2xl sm:p-10">
                        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-xl bg-blue-50 text-blue-600">
                            <Upload className="w-8 h-8 animate-bounce" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Drop files to upload</h3>
                        <p className="text-sm text-slate-500 mt-1">Release to start uploading immediately</p>
                    </div>
                </div>
            )}

            {/* Top Navigation */}
            <DashboardHeader user={user} onLogout={onLogout} />

            <div className="grid w-full flex-1 grid-cols-1 grid-rows-[1fr_auto] md:grid-cols-[12rem_minmax(0,1fr)] md:grid-rows-1">
                <DashboardSidebar
                    usedBytes={totalUsedBytes}
                    limitBytes={STORAGE_LIMIT_BYTES}
                    formatBytes={formatFileSize}
                    uploadAction={uploadButton}
                />

                <main className="row-start-1 min-w-0 px-4 py-5 sm:px-6 md:col-start-2 md:py-6 lg:px-8 lg:py-8">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">All files</h1>
                            <p className="mt-1 text-sm text-slate-600" aria-live="polite">
                                {loading ? 'Loading files…' : `${processedFiles.length} ${searchQuery.trim() ? 'matching ' : ''}file${processedFiles.length === 1 ? '' : 's'}`}
                            </p>
                        </div>

                        <div className="md:hidden">{uploadButton}</div>
                    </div>

                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <div className="relative w-full lg:w-auto lg:min-w-44 lg:max-w-sm lg:flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                                type="text"
                                aria-label="Search files"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search files"
                                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-base text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                    className="absolute inset-y-0 right-0 grid w-10 place-items-center rounded-lg text-slate-500 hover:text-blue-700"
                                >
                                    <X className="size-4" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <div className="flex w-full items-center justify-between gap-2 lg:ml-auto lg:w-auto">
                            {/* Sort Selector */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    aria-label="Sort files"
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="h-11 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm font-medium text-slate-700 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="date-desc">Newest first</option>
                                    <option value="date-asc">Oldest first</option>
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="size-desc">Largest size</option>
                                </select>
                                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            {/* View Switcher: List vs Grid */}
                            <div className="flex h-11 items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5" role="group" aria-label="File layout">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    title="List view"
                                    aria-label="List view"
                                    aria-pressed={viewMode === 'list'}
                                    className={`grid h-full w-10 place-items-center rounded-lg transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    <LayoutList className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    title="Grid view"
                                    aria-label="Grid view"
                                    aria-pressed={viewMode === 'grid'}
                                    className={`grid h-full w-10 place-items-center rounded-lg transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Files Section */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-slate-600" />
                            <p className="text-xs font-medium">Fetching files...</p>
                        </div>
                    ) : processedFiles.length === 0 ? (
                        /* Empty State */
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center sm:py-6">
                            <div className="mx-auto mb-2 grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
                                <FolderOpen className="size-5" aria-hidden="true" />
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                {searchQuery.trim() ? 'No matching files' : 'No files yet'}
                            </h2>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
                                {searchQuery.trim() ? 'Try a different file name or owner.' : 'Use Upload or drop a file here.'}
                            </p>
                        </div>
                    ) : (
                        <FileList
                            files={processedFiles}
                            viewMode={viewMode}
                            onFileSelect={(file) => setSelectedFile(file)}
                            onFileOpen={handleFileOpen}
                            onFileDownload={handleFileDownload}
                            onFileDelete={handleFileDelete}
                            openingFile={openingFile}
                        />
                    )}
                </main>

            </div>

            <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-600">
                Developed by <span className="font-medium text-slate-800">Sudipta Sarkar</span>
            </footer>

            {/* File Details Modal */}
            {selectedFile && (
                <FileModal
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                    onOpen={handleFileOpen}
                    onDownload={handleFileDownload}
                    onDelete={handleFileDelete}
                />
            )}

            {/* Non-intrusive Upload Progress */}
            {uploading && (
                <UploadProgressModal uploadProgress={uploadProgress} />
            )}

            {/* Floating Toast Notification */}
            {toast && (
                <div role="status" className="fixed inset-x-4 bottom-4 z-50 flex justify-center sm:bottom-6">
                    <div className={`px-4 py-2.5 rounded-2xl shadow-lg border flex items-center gap-2.5 text-xs font-medium ${
                        toast.type === 'success'
                            ? 'bg-slate-900 text-white border-slate-800'
                            : 'bg-red-600 text-white border-red-700'
                    }`}>
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-white shrink-0" />
                        )}
                        <span className="min-w-0 wrap-anywhere">{toast.message}</span>
                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            aria-label="Dismiss notification"
                            className="ml-1 shrink-0 rounded-md p-1 hover:opacity-75"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
