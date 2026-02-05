import React from 'react';
import { FolderOpen } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}>
            <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shrink-0">FS</div>
                {isOpen && <span className="ml-3 font-bold text-lg tracking-tight text-gray-800 dark:text-white transition-opacity">FileStacker</span>}
            </div>

            <nav className="flex-1 p-4">
                <button className="flex items-center w-full p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium whitespace-nowrap overflow-hidden">
                    <FolderOpen className="w-5 h-5 mr-3 shrink-0" />
                    {isOpen && "My Files"}
                </button>
            </nav>
        </aside>
    );
}