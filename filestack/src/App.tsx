import React, { useState, useEffect } from 'react';
import Auth, { type UserData } from './components/Auth';
import Dashboard from './components/Dashboard'
import { apiFetch } from './api/client';

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    apiFetch<{ user: UserData }>('/api/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => {
        // Not logged in
      });
  }, []);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {!user ? (
        <Auth onLogin={setUser} />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleTheme={() => setDarkMode(!darkMode)}
        />
      )}
    </div>
  );
}
