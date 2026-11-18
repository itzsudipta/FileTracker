import React, { useState } from 'react';
import { CircleAlert, Loader2 } from 'lucide-react';
import { apiFetch } from '../api/client';
import { FileStackerIcon } from './FileStackerBrand';

export interface UserData {
    user_id: string;
    user_name: string;
    org_id: string;
    org_name: string;
}

export interface AuthSession {
    user: UserData;
    expires_at: number;
}

interface AuthProps {
    onLogin: (session: AuthSession) => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        user_email: '',
        u_password: '',
        user_name: '',
        org_name: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        try {
            if (isLogin) {
                const res = await apiFetch<AuthSession>('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.user_email.trim(),
                        password: formData.u_password
                    })
                });
                onLogin(res);
            } else {
                const res = await apiFetch<AuthSession>('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.user_email.trim(),
                        password: formData.u_password,
                        user_name: formData.user_name.trim(),
                        org_name: formData.org_name.trim()
                    })
                });
                onLogin(res);
            }
        } catch (error: unknown) {
            console.error('Auth Error:', error);
            const message = error instanceof Error ? error.message : 'Authentication failed. Please check your credentials.';
            setErrorMsg(message);
        } finally {
            setLoading(false);
        }
    };

    const fieldClass = 'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:text-sm';
    const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';
    const submitLabel = isLogin ? 'Sign in' : 'Create account';

    return (
        <main className="flex min-h-dvh flex-col bg-slate-50 px-4 py-6 text-slate-900 selection:bg-blue-100 selection:text-blue-950 sm:px-6 sm:py-10">
            <div className="mx-auto my-auto w-full max-w-md">
                <section aria-labelledby="auth-title" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-3">
                        <h1 id="auth-title" className="text-2xl font-semibold tracking-tight">
                            {isLogin ? 'Sign in' : 'Create your account'}
                        </h1>
                        <FileStackerIcon />
                    </div>

                    {errorMsg && (
                        <div role="alert" className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <span className="min-w-0 wrap-anywhere">{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} aria-busy={loading}>
                        <fieldset disabled={loading} className="min-w-0 space-y-4">
                            {!isLogin && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="min-w-0">
                                        <label htmlFor="auth-name" className={labelClass}>Full name</label>
                                        <input
                                            id="auth-name"
                                            name="user_name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={formData.user_name}
                                            onChange={e => setFormData({ ...formData, user_name: e.target.value })}
                                            className={fieldClass}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <label htmlFor="auth-organization" className={labelClass}>Organization name</label>
                                        <input
                                            id="auth-organization"
                                            name="org_name"
                                            type="text"
                                            autoComplete="organization"
                                            required
                                            value={formData.org_name}
                                            onChange={e => setFormData({ ...formData, org_name: e.target.value })}
                                            className={fieldClass}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="auth-email" className={labelClass}>Email address</label>
                                <input
                                    id="auth-email"
                                    name="email"
                                    type="email"
                                    autoComplete={isLogin ? 'username' : 'email'}
                                    required
                                    value={formData.user_email}
                                    onChange={e => setFormData({ ...formData, user_email: e.target.value })}
                                    className={fieldClass}
                                />
                            </div>

                            <div>
                                <label htmlFor="auth-password" className={labelClass}>Password</label>
                                <input
                                    id="auth-password"
                                    name="password"
                                    type="password"
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    required
                                    value={formData.u_password}
                                    onChange={e => setFormData({ ...formData, u_password: e.target.value })}
                                    className={fieldClass}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-1 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-wait disabled:opacity-60"
                            >
                                {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                                {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : submitLabel}
                            </button>
                        </fieldset>
                    </form>

                    <div className="mt-6 flex flex-wrap items-baseline justify-center gap-x-1.5 border-t border-slate-200 pt-4 text-center text-sm">
                        <span className="text-slate-600">{isLogin ? 'New to FileStacker?' : 'Already have an account?'}</span>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => { setErrorMsg(null); setIsLogin(!isLogin); }}
                            className="min-h-9 rounded-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </section>
                <p className="mt-4 text-center text-sm text-slate-600">Developer By Sudipta Sarkar</p>
            </div>
        </main>
    );
}
