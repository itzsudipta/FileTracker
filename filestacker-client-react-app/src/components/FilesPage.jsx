import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Folder } from 'lucide-react';
import { getFileIcon, formatBytes, formatDate } from '../utils/formatters.jsx';
import { FileModal } from './FileModal';

export const FilesPage = ({ files, darkMode }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    const cardBg = darkMode ? 'bg-slate-800' : 'bg-white';
    const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
    const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
    const borderColor = darkMode ? 'border-slate-700' : 'border-gray-200';

    // Filter and search
    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || file.type.includes(filterType);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">My Files</h2>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 ${cardBg} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${textPrimary}`}
                    />
                </div>

                <div className="relative">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className={`px-4 py-3 pr-10 ${cardBg} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all ${textPrimary}`}
                    >
                        <option value="all">All Types</option>
                        <option value="image">Images</option>
                        <option value="video">Videos</option>
                        <option value="pdf">PDFs</option>
                        <option value="audio">Audio</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary} pointer-events-none`} />
                </div>
            </div>

            {/* Files Grid */}
            {filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map(file => (
                        <div
                            key={file.id}
                            onClick={() => setSelectedFile(file)}
                            className={`${cardBg} rounded-xl p-5 border ${borderColor} hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate group-hover:text-blue-500 transition-colors">{file.name}</p>
                                        <p className={`text-xs ${textSecondary}`}>{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center justify-between text-xs ${textSecondary}`}>
                                <span>{formatDate(file.uploadDate)}</span>
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded">
                                    {file.tags && file.tags[0] || 'untagged'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Folder className={`w-16 h-16 mx-auto mb-4 ${textSecondary}`} />
                    <p className="text-xl font-semibold mb-2">No files found</p>
                    <p className={textSecondary}>Try adjusting your search or filters</p>
                </div>
            )}

            {selectedFile && (
                <FileModal
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
};
