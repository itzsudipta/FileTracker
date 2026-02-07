import React from 'react';
import { X } from 'lucide-react';

interface DashboardSidebarProps {
    isMobile: boolean;
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    setSidebarOpen: (open: boolean) => void;
    usedBytes: number;
    limitBytes: number;
    formatBytes: (bytes: number) => string;
}

const SIDEBAR_BASE_CLASSES = "fixed lg:static inset-y-0 left-0 z-50 h-full bg-white border-r border-slate-200/60 transition-all duration-300 ease-out shadow-2xl lg:shadow-none";

export default function DashboardSidebar({
    isMobile,
    sidebarOpen,
    sidebarCollapsed,
    sidebarRef,
    setSidebarOpen,
    usedBytes,
    limitBytes,
    formatBytes
}: DashboardSidebarProps) {
    const safeLimit = Math.max(limitBytes, 1);
    const percentUsed = Math.min(100, Math.max(0, Math.round((usedBytes / safeLimit) * 100)));
    const usedLabel = formatBytes(usedBytes);
    const limitLabel = formatBytes(limitBytes);

    return (
        <aside
            ref={sidebarRef}
            className={
                isMobile
                    ? `${SIDEBAR_BASE_CLASSES} ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}`
                    : `${SIDEBAR_BASE_CLASSES} ${sidebarCollapsed ? 'w-20' : 'w-72'}`
            }
        >
            <div className="h-full flex flex-col">
                {/* Logo area - Responsive */}
                <div className={`h-16 lg:h-20 flex items-center border-b border-slate-100 ${sidebarCollapsed && !isMobile ? 'justify-center px-0' : 'px-4 lg:px-6'}`}>
                    {/* Mobile close button */}
                    {isMobile && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="mr-3 p-2 hover:bg-slate-100 rounded-lg lg:hidden"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    )}

                    <div className={`flex items-center gap-3 transition-all duration-500 overflow-hidden ${(isMobile || !sidebarCollapsed) ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-linear-to-br from-slate-800 to-slate-600 rounded-xl shadow-lg shadow-slate-300/40 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg lg:text-xl text-slate-800 tracking-tight whitespace-nowrap">FileTracker</span>
                    </div>

                    {/* Collapsed logo - Desktop only */}
                    {!isMobile && sidebarCollapsed && (
                        <div className="w-10 h-10 bg-linear-to-br from-slate-800 to-slate-600 rounded-xl shadow-lg shadow-slate-300/40 flex items-center justify-center">
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
                        <svg className="w-5 h-5 text-slate-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span className={`font-medium text-sm whitespace-nowrap transition-all duration-500 ${(isMobile || !sidebarCollapsed) ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                            My Files
                        </span>
                        {(isMobile || !sidebarCollapsed) && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-800 shrink-0" />
                        )}
                    </button>
                </nav>

                {/* Storage indicator - Responsive */}
                <div className={`border-t border-slate-100 ${sidebarCollapsed && !isMobile ? 'hidden' : 'block'}`}>
                    <div className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="flex items-center justify-between mb-2 lg:mb-3">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Storage</span>
                            <span className="text-xs font-bold text-slate-800">{percentUsed}%</span>
                        </div>
                        <div className="w-full h-1.5 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-300"
                                style={{ width: `${percentUsed}%` }}
                            />
                        </div>
                        <p className="mt-1.5 lg:mt-2 text-xs text-slate-500">{usedLabel} of {limitLabel}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
