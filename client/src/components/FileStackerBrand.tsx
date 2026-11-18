import { Layers } from 'lucide-react';

export function FileStackerIcon() {
    return (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-600 text-white" aria-hidden="true">
            <Layers className="size-5" />
        </span>
    );
}

export default function FileStackerBrand() {
    return (
        <div className="flex items-center gap-2.5">
            <FileStackerIcon />
            <span className="text-base font-semibold tracking-tight text-slate-900">FileStacker</span>
        </div>
    );
}
