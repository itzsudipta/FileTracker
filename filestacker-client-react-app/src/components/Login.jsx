import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export const Login = ({ onLogin, darkMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple mock authentication
        if (email && password) {
            onLogin({ email, name: email.split('@')[0] });
        }
    };

    return (
        <div className={`${darkMode ? 'dark bg-slate-950' : 'bg-gradient-to-br from-blue-50 to-purple-50'} min-h-screen flex items-center justify-center p-4`}>
            <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white'} max-w-md w-full rounded-2xl shadow-2xl p-8 border`}>
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                        FileStacker
                    </h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isSignUp ? 'Create your account' : 'Welcome back'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 rounded-lg border ${darkMode
                                        ? 'bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-11 pr-12 py-3 rounded-lg border ${darkMode
                                        ? 'bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me and Forgot Password */}
                    {!isSignUp && (
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Remember me
                                </span>
                            </label>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <LogIn size={20} />
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                {/* Toggle Sign Up / Login */}
                <div className="mt-6 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isSignUp ? 'Log In' : 'Sign Up'}
                        </button>
                    </p>
                </div>

                {/* Demo Credentials */}
                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        Demo Credentials:
                    </p>
                    <p className={`text-sm font-mono ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email: demo@filestacker.com<br />
                        Password: demo123
                    </p>
                </div>
            </div>
        </div>
    );
};
