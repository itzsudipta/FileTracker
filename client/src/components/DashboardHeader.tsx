import { useEffect, useRef, useState } from 'react';
import { LogOut, UserRound } from 'lucide-react';
import type { UserData } from './Auth';
import FileStackerBrand from './FileStackerBrand';

interface DashboardHeaderProps {
    user: UserData;
    onLogout: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!menuOpen) return;

        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setMenuOpen(false);
            profileRef.current?.focus();
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [menuOpen]);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <nav aria-label="Main navigation" className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <FileStackerBrand />

                <div ref={menuRef} className="relative">
                    <button
                        ref={profileRef}
                        type="button"
                        onClick={() => setMenuOpen(open => !open)}
                        className="grid size-11 place-items-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        aria-label="Profile"
                        aria-expanded={menuOpen}
                    >
                        <UserRound className="size-5" aria-hidden="true" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                            <div className="border-b border-slate-100 px-3 py-2">
                                <p className="truncate text-sm font-semibold text-slate-900" title={user.user_name}>{user.user_name}</p>
                                {user.org_name && (
                                    <p className="truncate text-xs text-slate-600" title={user.org_name}>{user.org_name}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={onLogout}
                                className="mt-1 flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
                            >
                                <LogOut className="size-4" aria-hidden="true" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
