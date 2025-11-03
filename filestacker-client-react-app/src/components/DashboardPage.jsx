import React from 'react';
import { File, HardDrive, Clock, Download } from 'lucide-react';
import { StatCard } from './StatCard.jsx';
import { getFileIcon, formatBytes, formatDate } from '../utils/formatters.jsx';

export const DashboardPage = ({ files, darkMode }) => {
    const totalFiles = files.length;
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const recentFiles = files.filter(f => {
        const fileDate = new Date(f.uploadDate);
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return fileDate > dayAgo;
    }).length;

    const storagePercent = (totalSize / (5 * 1024 * 1024 * 1024)) * 100; // Assuming 5GB limit

    const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
    const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
    const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<File className="w-6 h-6" />}
                    label="Total Files"
                    value={totalFiles}
                    color="blue"
                    cardBg={cardBg}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                />
                <StatCard
                    icon={<HardDrive className="w-6 h-6" />}
                    label="Storage Used"
                    value={formatBytes(totalSize)}
                    color="purple"
                    cardBg={cardBg}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                />
                <StatCard
                    icon={<Clock className="w-6 h-6" />}
                    label="Recent Uploads"
                    value={recentFiles}
                    color="emerald"
                    cardBg={cardBg}
                    textPrimary={textPrimary}
                    textSecondary={textSecondary}
                />
            </div>

            {/* Storage Overview */}
            <div className={`${cardBg} rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Storage Overview</h3>
                    <span className={`text-sm ${textSecondary}`}>{Math.round(storagePercent)}% used</span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(storagePercent, 100)}%` }}
                    />
                </div>
                <p className={`mt-2 text-sm ${textSecondary}`}>
                    {formatBytes(totalSize)} of 5 GB used
                </p>
            </div>

            {/* Recent Files */}
            <div className={`${cardBg} rounded-xl p-6 border ${borderColor} transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Files</h3>
                </div>
                <div className="space-y-3">
                    {files.slice(0, 5).map(file => (
                        <div key={file.id} className={`flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer border ${borderColor}`}>
                            <div className="flex items-center space-x-3">
                                <div className="text-blue-500">
                                    {getFileIcon(file.type)}
                                </div>
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className={`text-xs ${textSecondary}`}>{formatBytes(file.size)} • {formatDate(file.uploadDate)}</p>
                                </div>
                            </div>
                            <button className={`p-2 rounded-lg hover:bg-slate-700/50 ${textSecondary} hover:${textPrimary} transition-colors`}>
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
