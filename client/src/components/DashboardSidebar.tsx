import { HardDrive } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardSidebarProps {
    usedBytes: number;
    limitBytes: number;
    formatBytes: (bytes: number) => string;
    uploadAction: ReactNode;
}

export default function DashboardSidebar({
    usedBytes,
    limitBytes,
    formatBytes,
    uploadAction
}: DashboardSidebarProps) {
    const safeLimit = Math.max(limitBytes, 1);
    const percentUsed = Math.min(100, Math.max(0, (usedBytes / safeLimit) * 100));

    return (
        <aside aria-label="File tools" className="row-start-2 min-w-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6 md:col-start-1 md:row-start-1 md:flex md:flex-col md:justify-between md:gap-6 md:border-t-0 md:border-r md:px-4 md:pt-6 md:pb-5 lg:pt-8">
            <div className="hidden md:block">{uploadAction}</div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 md:flex md:flex-col md:items-stretch">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <HardDrive className="size-4 text-blue-600" aria-hidden="true" />
                    Storage
                </h2>
                <div
                    role="meter"
                    aria-label="Storage used"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(percentUsed)}
                    aria-valuetext={`${formatBytes(usedBytes)} of ${formatBytes(limitBytes)} used`}
                    className="col-span-2 row-start-2 h-1.5 overflow-hidden rounded-full bg-slate-200 md:mt-1"
                >
                    <div className="h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${percentUsed}%` }} />
                </div>
                <p className="col-start-2 row-start-1 text-right text-xs tabular-nums text-slate-600 md:text-left">{formatBytes(usedBytes)} of {formatBytes(limitBytes)} used</p>
            </div>
        </aside>
    );
}
