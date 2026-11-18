interface AppFooterProps {
    text?: string;
}

export default function AppFooter({ text = 'FileStacker • Minimal & Secure File Management' }: AppFooterProps) {
    return (
        <footer className="border-t border-zinc-200/60 bg-white/50 backdrop-blur-xs py-3 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-[11px] text-zinc-400">
                <span>{text}</span>
            </div>
        </footer>
    );
}
