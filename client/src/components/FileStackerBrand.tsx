export function FileStackerIcon({ alt = 'FileStacker logo' }: { alt?: string }) {
    return (
        <img
            src={`${import.meta.env.BASE_URL}FileStacker.png`}
            alt={alt}
            width={54}
            height={36}
            className="h-9 w-[54px] shrink-0 rounded-md object-contain"
        />
    );
}

export default function FileStackerBrand() {
    return (
        <div className="flex items-center gap-2.5">
            <FileStackerIcon alt="" />
            <span className="text-base font-semibold tracking-tight text-slate-900">FileStacker</span>
        </div>
    );
}
