import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
        <Card className="p-6 gap-0">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${iconBgClass}`}
                    >
                        <Icon className={`h-5 w-5 ${iconColorClass}`} />
                    </div>
                    <span className="text-[13px] font-medium text-muted-foreground">
                        {title}
                    </span>
                </div>
                <div>
                    <span className="text-[28px] font-bold tracking-tight text-foreground">
                        {value}
                    </span>
                </div>
            </div>
        </Card>
    );
}
