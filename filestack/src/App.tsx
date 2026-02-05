import React, { useState, useEffect } from 'react';
import Auth, { type UserData } from './components/Auth';
import Dashboard from './components/Dashboard'

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

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {!user ? (
        <Auth onLogin={setUser} />
      ) : (
        <Dashboard
          user={user}
          onLogout={() => setUser(null)}
          darkMode={darkMode}
          toggleTheme={() => setDarkMode(!darkMode)}
        />
      )}
    </div>
  );
}