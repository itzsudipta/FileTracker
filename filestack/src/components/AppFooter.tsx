interface AppFooterProps {
    text?: string;
}

export default function AppFooter({ text = 'Developed by Sudipta Sarkar' }: AppFooterProps) {
    return (
        <footer className="border-t border-slate-200/60 bg-white/70 backdrop-blur-md">
            <div className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 flex items-center justify-center text-[11px] sm:text-xs text-slate-500">
                <span className="font-medium">{text}</span>
            </div>
        </footer>
    );
}
