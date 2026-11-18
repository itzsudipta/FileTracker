import { useState, useEffect } from 'react';
import Auth, { type AuthSession } from './components/Auth';
import Dashboard from './components/Dashboard'
import { apiFetch } from './api/client';

export default function App() {
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    apiFetch<AuthSession>('/api/auth/me', { cache: 'no-store', signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) {
          setSession(result.expires_at > Date.now() ? result : null);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setSession(null);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!session) return;

    const expireSession = () => setSession(current => current === session ? null : current);
    const timer = window.setTimeout(expireSession, Math.max(0, session.expires_at - Date.now()));
    const checkDeadline = () => {
      if (Date.now() >= session.expires_at) expireSession();
    };
    document.addEventListener('visibilitychange', checkDeadline);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', checkDeadline);
    };
  }, [session]);

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setSession(current => current === session ? null : current);
    }
  };

  if (session === undefined) {
    return (
      <main className="grid min-h-dvh place-items-center bg-slate-50 text-sm text-slate-600">
        <p role="status">Checking session…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      {!session ? (
        <Auth onLogin={setSession} />
      ) : (
        <Dashboard
          user={session.user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
