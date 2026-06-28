import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconBgClass: string;
    iconColorClass: string;
};

export default function StatCard({
    title,
    value,
    icon: Icon,
    iconBgClass,
    iconColorClass,
}: StatCardProps) {
    return (
        <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
            <div className="flex flex-col gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBgClass}`}>
                    <Icon className={`h-[22px] w-[22px] ${iconColorClass}`} />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[13px] font-medium text-text-secondary">
                        {title}
                    </span>
                    <span className="text-[28px] font-bold tracking-tight text-text-primary">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
}
