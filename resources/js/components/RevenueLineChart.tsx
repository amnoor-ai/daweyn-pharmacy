import { TrendingUp } from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useAppearance } from '@/hooks/use-appearance';

type DataPoint = {
    date: string;
    total: number;
};

type Props = {
    data: DataPoint[];
};

// Reads a CSS custom property value from :root at call time.
// This means charts always pick up the active theme (light or dark).
function cssVar(name: string): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}) => {
    if (!active || !payload?.length) {
return null;
}

    const formattedDate = label
        ? new Date(label + 'T00:00:00').toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : '';

    return (
        <div
            className="rounded-lg border border-border bg-card px-3 py-2 shadow-md"
            style={{ fontSize: 12 }}
        >
            <p className="mb-1 font-medium text-muted-foreground">{formattedDate}</p>
            <p className="font-bold text-foreground">
                ${payload[0].value.toFixed(2)}
            </p>
        </div>
    );
};

export default function RevenueLineChart({ data }: Props) {
    // Subscribe to the theme store so this component re-renders on dark/light
    // toggle, which causes getComputedStyle() to re-run with the new theme.
    const { resolvedAppearance } = useAppearance();
    void resolvedAppearance;

    const strokeColor = cssVar('--primary');
    const gradientColor = cssVar('--primary');
    const tickColor     = cssVar('--muted-foreground');
    const gridColor     = cssVar('--border');

    if (data.length === 0) {
        return (
            <div className="flex h-[220px] flex-col items-center justify-center rounded-xl border border-border bg-card text-center">
                <TrendingUp className="mb-2 h-8 w-8 text-muted-foreground opacity-60" />
                <p className="text-sm font-medium text-foreground">No revenue data yet</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Revenue will appear here once transactions are recorded.
                </p>
            </div>
        );
    }

    const formatted = data.map((d) => ({
        ...d,
        label: new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
        }),
    }));

    return (
        <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={formatted}
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={gradientColor} stopOpacity={0.28} />
                            <stop offset="95%" stopColor={gradientColor} stopOpacity={0.03} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={gridColor}
                        vertical={false}
                    />

                    <XAxis
                        dataKey="label"
                        tick={{ fill: tickColor, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                    />

                    <YAxis
                        tick={{ fill: tickColor, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `$${v}`}
                        width={48}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                    />

                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill="url(#revenueGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
