import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardPage } from './DashboardPage';
import { UploadPage } from './UploadPage';
import { FilesPage } from './FilesPage';
import { Login } from './Login';
import { dummyFiles } from '../utils/dummyData';

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [files, setFiles] = useState(dummyFiles);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentPage('dashboard');
    };

    const handleUpload = (file) => {
        const newFile = {
            id: Date.now(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            user: user?.name || 'You',
            tags: [],
        };
        setFiles([...files, newFile]);
    };

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} darkMode={darkMode} />;
    }

    return (
        <div className={`${darkMode ? 'dark bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen flex`}>
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                user={user}
                onLogout={handleLogout}
            />
            <main className="flex-1 overflow-y-auto">
                {currentPage === 'dashboard' && <DashboardPage files={files} darkMode={darkMode} />}
                {currentPage === 'upload' && <UploadPage onUpload={handleUpload} darkMode={darkMode} />}
                {currentPage === 'files' && <FilesPage files={files} darkMode={darkMode} />}
            </main>
        </div>
    );
}
