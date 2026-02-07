import React, { useState } from 'react';
import { Mail, Lock, User, Building, Loader2, ArrowRight, FolderOpen } from 'lucide-react';
import { apiFetch } from '../api/client';

export interface UserData {
    user_id: string;
    user_name: string;
    org_id: string;
    org_name: string;
}

interface AuthProps {
    onLogin: (user: UserData) => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

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
                const res = await apiFetch<{ user: UserData }>('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.user_email,
                        password: formData.u_password
                    })
                });
                onLogin(res.user);
            } else {
                const res = await apiFetch<{ user: UserData }>('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: formData.user_email,
                        password: formData.u_password,
                        user_name: formData.user_name,
                        org_name: formData.org_name
                    })
                });
                onLogin(res.user);
            }

        } catch (error: any) {
            console.error('Auth Error:', error);
            setErrorMsg(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (fieldName: string) => `
        w-full pl-10 pr-3 py-2.5 bg-white border rounded-md outline-none transition-all duration-200
        ${focusedField === fieldName
            ? 'border-slate-400 shadow-sm'
            : 'border-slate-200 hover:border-slate-300'
        }
        placeholder:text-slate-400 text-slate-700 text-sm
    `;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Main card */}
                <div className="bg-white rounded-lg shadow-lg border border-slate-200">
                    <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center">
                                <FolderOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-slate-800">FileStacker</h1>
                                <p className="text-xs text-slate-500">
                                    {isLogin ? 'Sign in to continue' : 'Create your account'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        {/* Toggle tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-md mb-4">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 ${isLogin
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all duration-200 ${!isLogin
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Error message */}
                        {errorMsg && (
                            <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-md flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-rose-600 text-[10px] font-bold">!</span>
                                </div>
                                <p className="text-rose-600 text-xs leading-relaxed">{errorMsg}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Username field - Sign up only */}
                            {!isLogin && (
                                <div className="group">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'username' ? 'text-slate-700' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            className={inputClasses('username')}
                                            onFocus={() => setFocusedField('username')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e =>
                                                setFormData({ ...formData, user_name: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email field */}
                            <div className="group">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-slate-700' : 'text-slate-400'}`} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        className={inputClasses('email')}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e =>
                                            setFormData({ ...formData, user_email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="group">
                                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-slate-700' : 'text-slate-400'}`} />
                                    <input
                                        type="password"
                                        required
                                        placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                                        className={inputClasses('password')}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        onChange={e =>
                                            setFormData({ ...formData, u_password: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Organization field - Sign up only */}
                            {!isLogin && (
                                <div className="group">
                                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                                        Organization Name
                                    </label>
                                    <div className="relative">
                                        <Building className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === 'org' ? 'text-slate-700' : 'text-slate-400'}`} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Acme Corporation"
                                            className={inputClasses('org')}
                                            onFocus={() => setFocusedField('org')}
                                            onBlur={() => setFocusedField(null)}
                                            onChange={e =>
                                                setFormData({ ...formData, org_name: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white py-2.5 px-4 rounded-md font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group text-sm"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Footer */}
                        <div className="mt-5 pt-3 border-t border-slate-100">
                            <p className="text-center text-[11px] text-slate-500">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="font-semibold text-slate-800 hover:text-slate-600 underline underline-offset-4 decoration-2 decoration-slate-300 hover:decoration-slate-500 transition-all duration-200"
                                >
                                    {isLogin ? 'Sign up free' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
