import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import FileList, { type FileData } from './FileList';
import FileModal from './FileModal';
import type { UserData } from './Auth';
import { supabase } from '../supabaseClient';
import { Upload, Loader2, Menu, X } from 'lucide-react';

// Extended FileData with owner_name for modal
export interface FileDataWithOwner extends FileData {
    owner_name: string;
}

interface DashboardProps {
    user: UserData;
    onLogout: () => void;
    darkMode: boolean;
    toggleTheme: () => void;
}

export default function Dashboard({ user, onLogout, darkMode, toggleTheme }: DashboardProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileDataWithOwner | null>(null);
    const [files, setFiles] = useState<FileDataWithOwner[]>([]); // Always initialize as empty array
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
                setSidebarCollapsed(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    // Fetch real-time data from Supabase
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('file_data')
                .select(`
                    file_id,
                    filename,
                    file_type,
                    file_size,
                    uploaded_at,
                    owner:owner_id (user_name)
                `)
                .eq('org_id', user.org_id)
                .eq('is_deleted', false)
                .order('uploaded_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            // Ensure data is an array, default to empty array if null/undefined
            const safeData = data || [];

            const transformedFiles: FileDataWithOwner[] = safeData.map((file: any) => ({
                id: file.file_id,
                filename: file.filename,
                type: file.file_type,
                size: formatFileSize(file.file_size),
                uploaded_at: file.uploaded_at,
                owner_name: file.owner?.user_name || 'Unknown'
            }));

            setFiles(transformedFiles);

        } catch (error) {
            console.error('Error fetching files:', error);
            setFiles([]); // Ensure files is always an array even on error
        } finally {
            setLoading(false);
        }
    };

    // Handle file upload
    const handleFileUpload = async (filesToUpload: FileList | null) => {
        if (!filesToUpload || filesToUpload.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                setUploadProgress(((i + 0.5) / filesToUpload.length) * 100);

                const fileExt = file.name.split('.').pop()?.toLowerCase();
                const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const storagePath = `${user.org_id}/${uniqueName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('filedata')
                    .upload(storagePath, file, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.type || 'application/octet-stream'
                    });

                if (uploadError) {
                    console.error('Storage upload error:', uploadError);
                    throw new Error(`Storage upload failed: ${uploadError.message}`);
                }

                setUploadProgress(((i + 0.8) / filesToUpload.length) * 100);

                let fileType = 'file';
                if (file.type.startsWith('image/')) fileType = 'image';
                else if (file.type === 'application/pdf') fileType = 'pdf';
                else if (fileExt === 'xlsx' || fileExt === 'xls' || fileExt === 'csv') fileType = 'sheet';
                else if (fileExt === 'doc' || fileExt === 'docx') fileType = 'doc';

                const fileSizeBytes = file.size;

                const { error: dbError } = await supabase
                    .from('file_data')
                    .insert([
                        {
                            filename: file.name,
                            file_type: fileType,
                            file_size: fileSizeBytes,
                            storage_path: storagePath,
                            org_id: user.org_id,
                            owner_id: user.user_id,
                            is_deleted: false,
                            uploaded_at: new Date().toISOString()
                        }
                    ]);

                if (dbError) {
                    console.error('Database insert error:', dbError);
                    throw new Error(`Database insert failed: ${dbError.message}`);
                }

                setUploadProgress(((i + 1) / filesToUpload.length) * 100);
            }

            await fetchFiles();
            alert('Files uploaded successfully!');

        } catch (error: any) {
            console.error('Upload error:', error);
            alert(`Failed to upload file: ${error.message}`);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileUpload(e.target.files);
    };

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    // Ensure files is always an array before passing to FileList
    const safeFiles = files || [];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
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
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-slate-500 text-center">{Math.round(uploadProgress)}%</p>
                    </div>
                </div>
            )}

            {/* Responsive Sidebar */}
            <aside
                ref={sidebarRef}
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 h-full bg-white border-r border-slate-200/60 
                    transition-all duration-300 ease-out shadow-2xl lg:shadow-none
                    ${isMobile
                        ? (sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72')
                        : (sidebarCollapsed ? 'w-20' : 'w-72')
                    }
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Logo area - Responsive */}
                    <div className="h-16 lg:h-20 flex items-center px-4 lg:px-6 border-b border-slate-100">
                        {/* Mobile close button */}
                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="mr-3 p-2 hover:bg-slate-100 rounded-lg lg:hidden"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        )}

                        <div className={`
                            flex items-center gap-3 transition-all duration-500 overflow-hidden
                            ${(isMobile || !sidebarCollapsed) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                        `}>
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl shadow-lg shadow-slate-300/40 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <span className="font-bold text-lg lg:text-xl text-slate-800 tracking-tight whitespace-nowrap">FileStacker</span>
                        </div>

                        {/* Collapsed logo - Desktop only */}
                        {!isMobile && sidebarCollapsed && (
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl shadow-lg shadow-slate-300/40 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Navigation - Responsive */}
                    <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 overflow-y-auto">
                        <button
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group bg-slate-100 text-slate-900 shadow-sm"
                        >
                            <svg className="w-5 h-5 text-slate-800 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span className={`
                                font-medium text-sm whitespace-nowrap transition-all duration-500
                                ${(isMobile || !sidebarCollapsed) ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                            `}>
                                My Files
                            </span>
                            {(isMobile || !sidebarCollapsed) && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0" />
                            )}
                        </button>
                    </nav>

                    {/* Storage indicator - Responsive */}
                    <div className={`
                        p-3 lg:p-4 mx-3 lg:mx-4 mb-4 lg:mb-6 transition-all duration-500
                        ${(isMobile || !sidebarCollapsed) ? 'block' : 'hidden'}
                    `}>
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2 lg:mb-3">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Storage</span>
                                <span className="text-xs font-bold text-slate-800">75%</span>
                            </div>
                            <div className="w-full h-1.5 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full" />
                            </div>
                            <p className="mt-1.5 lg:mt-2 text-xs text-slate-500">7.5 GB of 10 GB</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10 w-full">
                {/* Responsive Navbar */}
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
                    {/* Left side - Menu button and Search */}
                    <div className="flex items-center gap-3 flex-1">
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Desktop sidebar toggle */}
                        <button
                            onClick={toggleSidebar}
                            className="hidden lg:flex p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300"
                        >
                            <svg
                                className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Search bar - Responsive */}
                        <div className="flex-1 max-w-md hidden sm:block">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 lg:h-5 lg:w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search files..."
                                    className="w-full pl-9 lg:pl-11 pr-4 py-2 lg:py-2.5 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-300 hover:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right actions - Responsive */}
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        {/* Mobile search button */}
                        <button className="sm:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 lg:p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:rounded-xl transition-all duration-300"
                        >
                            {darkMode ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {/* User profile - Responsive */}
                        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-slate-800">{user.user_name}</p>
                                <p className="text-xs text-slate-500 hidden lg:block">{user.org_name}</p>
                            </div>
                            <div className="relative group">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold shadow-lg shadow-slate-300/40 cursor-pointer ring-2 ring-white hover:ring-slate-200 transition-all duration-300">
                                    {user.user_name.charAt(0).toUpperCase()}
                                </div>

                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                                    <div className="p-2">
                                        <div className="px-3 py-2 border-b border-slate-50 md:hidden">
                                            <p className="text-sm font-semibold text-slate-800">{user.user_name}</p>
                                            <p className="text-xs text-slate-500">{user.org_name}</p>
                                        </div>
                                        <button
                                            onClick={onLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left mt-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content scroll area - Responsive */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* Page header - Responsive */}
                    <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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
                    <div
                        className={`
                            mb-6 lg:mb-8 p-6 sm:p-8 rounded-xl lg:rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                            ${dragActive
                                ? 'border-slate-400 bg-slate-50 shadow-lg'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }
                        `}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleClick}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className={`
                                w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300
                                ${dragActive ? 'bg-slate-200 scale-110' : 'bg-slate-50'}
                            `}>
                                <Upload className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${dragActive ? 'text-slate-700' : 'text-slate-400'}`} />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1">
                                {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                                or click to browse from your computer
                            </p>
                            <button
                                type="button"
                                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg sm:rounded-xl shadow-md transition-all duration-300"
                            >
                                Select Files
                            </button>
                            <p className="mt-2 sm:mt-3 text-xs text-slate-400">
                                Supports PDF, Images, Excel up to 50MB
                            </p>
                        </div>
                    </div>

                    {/* File list container - Responsive */}
                    <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Recent Files</h2>
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
                                files={safeFiles}
                                onFileSelect={setSelectedFile}
                            />
                        )}
                    </div>
                </div>
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