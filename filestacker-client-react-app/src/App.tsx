import { useState } from 'react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './components/DashboardPage';
import { UploadPage } from './components/UploadPage';
import { FilesPage } from './components/FilesPage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { Toast } from './components/Toast';  // (if you already have one for notifications)
import { FileModal } from './components/FileModal'; // (optional if used for preview/download)
import { Login } from './components/Login';

export function App() {
  // State management
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2); // Unread notifications count

  // Toggle dark/light mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Authentication handlers
  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setFiles([]);
  };

  const handleUpdateUser = (userData: any) => {
    setUser(userData);
  };

  // File upload handler
  const handleFileUpload = (file: any) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toLocaleString(),
      user: user?.name || 'Current User',
      tags: [],
    };
    setFiles((prev) => [...prev, newFile]);
    setToast({ message: `${file.name} uploaded successfully!`, type: 'success' });
    setCurrentPage('files');
  };

  // Close toast after few seconds
  const closeToast = () => setToast(null);

  // Open file modal (for preview/details)
  const closeFileModal = () => setSelectedFile(null);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div
      className={`flex h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}
    >
      {/* Sidebar Section */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
        onLogout={handleLogout}
        notificationCount={notificationCount}
      />

      {/* Main Page Area */}
      <main className="flex-1 overflow-auto p-6">
        {currentPage === 'dashboard' && (
          <DashboardPage files={files} darkMode={darkMode} />
        )}

        {currentPage === 'upload' && (
          <UploadPage onUpload={handleFileUpload} darkMode={darkMode} />
        )}

        {currentPage === 'files' && (
          <FilesPage
            files={files}
            darkMode={darkMode}
          />
        )}

        {currentPage === 'notifications' && (
          <NotificationsPage darkMode={darkMode} />
        )}

        {currentPage === 'settings' && (
          <SettingsPage darkMode={darkMode} user={user} onUpdateUser={handleUpdateUser} />
        )}
      </main>

      {/* Optional Toast (Success/Error messages) */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* Optional File Modal */}
      {selectedFile && (
        <FileModal file={selectedFile} onClose={closeFileModal} darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;
