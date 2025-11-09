import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardPage } from './DashboardPage';
import { UploadPage } from './UploadPage';
import { FilesPage } from './FilesPage';
import { Login } from './Login';
import { SettingsPage } from './SettingsPage';
import { NotificationsPage } from './NotificationsPage';
import { dummyFiles } from '../utils/dummyData';
import { getSession, clearSession } from '../utils/sessionManager';
import { authService } from '../services/authService';

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(false);
    const [files, setFiles] = useState(dummyFiles);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const sessionData = getSession();
        if (sessionData) {
            setUser({
                email: sessionData.email,
                name: sessionData.name,
                user_id: sessionData.user_id
            });
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const handleLogout = async () => {
        try {
            // Call logout API to invalidate session on backend
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local session state regardless of API response
            clearSession();
            setUser(null);
            setIsAuthenticated(false);
            setCurrentPage('dashboard');
        }
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
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

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
                {currentPage === 'upload' && <UploadPage onUpload={handleUpload} darkMode={darkMode} userId={user?.user_id} />}
                {currentPage === 'files' && <FilesPage files={files} darkMode={darkMode} />}
                {currentPage === 'settings' && <SettingsPage darkMode={darkMode} user={user} />}
                {currentPage === 'notifications' && <NotificationsPage darkMode={darkMode} />}
            </main>
        </div>
    );
}
