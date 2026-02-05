import React, { useState } from 'react';
import { Mail, Lock, User, Building, Loader2, ArrowRight, Shield, FolderOpen } from 'lucide-react';
import { supabase } from '../supabaseClient';

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

                // ======== LOGIN USING SUPABASE AUTH ========

                const { data: authData, error: authError } =
                    await supabase.auth.signInWithPassword({
                        email: formData.user_email,
                        password: formData.u_password,
                    });

                if (authError || !authData.user) {
                    throw new Error("Invalid email or password");
                }

                // ======== FETCH PROFILE FROM user_data ========

                const { data: userData, error: dbError } = await supabase
                    .from('user_data')
                    .select(`
                        user_id,
                        user_name,
                        org_id,
                        org:org_id (org_name)
                    `)
                    .eq('user_email', formData.user_email)
                    .single();

                if (dbError || !userData) {
                    throw new Error(
                        "User authenticated but no profile found in user_data table."
                    );
                }

                onLogin({
                    user_id: userData.user_id,
                    user_name: userData.user_name,
                    org_id: userData.org_id,
                    org_name: (userData.org as any)?.org_name || 'Unknown Org'
                });

            } else {

                // ======== SIGNUP FLOW ========

                // 1. Create user in Supabase Auth
                const { data: authData, error: authError } =
                    await supabase.auth.signUp({
                        email: formData.user_email,
                        password: formData.u_password,
                    });

                if (authError) throw authError;
                if (!authData.user) throw new Error("Signup failed");

                // 2. Create Organization
                const { data: orgData, error: orgError } = await supabase
                    .from('org')
                    .insert([{
                        org_name: formData.org_name,
                        domain_name: `@${formData.org_name.toLowerCase()}.com`,
                        storage_limit: "10GB"
                    }])
                    .select()
                    .single();

                if (orgError) throw orgError;

                // 3. Create profile in user_data
                const { data: newUserData, error: userError } = await supabase
                    .from('user_data')
                    .insert([{
                        user_id: authData.user.id,
                        user_name: formData.user_name,
                        user_email: formData.user_email,
                        org_id: orgData.org_id
                    }])
                    .select()
                    .single();

                if (userError) throw userError;

                onLogin({
                    user_id: newUserData.user_id,
                    user_name: newUserData.user_name,
                    org_id: orgData.org_id,
                    org_name: orgData.org_name
                });
            }

        } catch (error: any) {
            console.error('Auth Error:', error);
            setErrorMsg(error.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (fieldName: string) => `
        w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none transition-all duration-300
        ${focusedField === fieldName
            ? 'border-slate-400 shadow-lg shadow-slate-200/50'
            : 'border-slate-200 hover:border-slate-300'
        }
        placeholder:text-slate-400 text-slate-700
    `;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Main card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden">

                    {/* Header section with gradient */}
                    <div className="relative px-8 pt-8 pb-6 bg-gradient-to-b from-slate-50/50 to-transparent">
                        <div className="flex flex-col items-center">
                            {/* Logo icon */}
                            <div className="w-16 h-16 mb-4 bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl shadow-xl shadow-slate-300/50 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                                <FolderOpen className="w-8 h-8 text-white" />
                            </div>

                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                                FileStacker
                            </h1>

                            <p className="mt-2 text-slate-500 text-sm font-medium">
                                {isLogin ? 'Welcome back to your workspace' : 'Start your organization journey'}
                            </p>
                        </div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Toggle tabs */}
                        <div className="flex p-1 bg-slate-100/80 rounded-xl mb-6">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin
                                        ? 'bg-white text-slate-800 shadow-md shadow-slate-200/50'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin
                                        ? 'bg-white text-slate-800 shadow-md shadow-slate-200/50'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Error message */}
                        {errorMsg && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-rose-600 text-xs font-bold">!</span>
                                </div>
                                <p className="text-rose-600 text-sm leading-relaxed">{errorMsg}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Username field - Sign up only */}
                            {!isLogin && (
                                <div className="group">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'username' ? 'text-slate-700' : 'text-slate-400'}`} />
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
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-slate-700' : 'text-slate-400'}`} />
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
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-slate-700' : 'text-slate-400'}`} />
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
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                                        Organization Name
                                    </label>
                                    <div className="relative">
                                        <Building className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${focusedField === 'org' ? 'text-slate-700' : 'text-slate-400'}`} />
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
                                className="w-full mt-6 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white py-3.5 px-6 rounded-xl font-semibold shadow-lg shadow-slate-300/50 hover:shadow-xl hover:shadow-slate-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>{isLogin ? 'Sign In to Workspace' : 'Create Account'}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-center gap-2 text-slate-400 mb-4">
                                <Shield className="w-4 h-4" />
                                <span className="text-xs font-medium">Secure 256-bit encryption</span>
                            </div>

                            <p className="text-center text-slate-500 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="font-semibold text-slate-800 hover:text-slate-600 underline underline-offset-4 decoration-2 decoration-slate-300 hover:decoration-slate-500 transition-all duration-300"
                                >
                                    {isLogin ? 'Sign up free' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom text */}
                <p className="text-center mt-6 text-slate-400 text-xs font-medium">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}