import { PieChart as PieIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppearance } from '@/hooks/use-appearance';

type DataPoint = {
    payment_method: string;
    payment_method_label?: string;
    total: number;
};

type Props = {
    data: DataPoint[];
};

// Reads a CSS custom property value from :root at call time.
function cssVar(name: string): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
}



const CustomTooltip = ({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { name: string; value: number; payload?: any }[];
}) => {
    if (!active || !payload?.length) {
return null;
}

    return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
            <p className="font-medium text-muted-foreground">
                {payload[0].payload?.label ?? payload[0].name}
            </p>
            <p className="font-bold text-foreground">
                ${payload[0].value.toFixed(2)}
            </p>
        </div>
    );
};

export default function PaymentMethodDonut({ data }: Props) {
    // Subscribe to the app's theme store so this component re-renders
    // whenever the user toggles dark/light mode. Without this, getComputedStyle()
    // is only called once at mount and the SVG fill colors stay frozen at the
    // theme that was active when the page first loaded.
    const { resolvedAppearance } = useAppearance();
    void resolvedAppearance; // used only as a re-render trigger

    // Fixed per-method colors keyed by payment method name.
    // All five CSS variables have the SAME hex value in both light and dark
    // mode (verified in app.css), so they're always high-contrast and
    // visually distinct regardless of theme.
    const METHOD_COLORS: Record<string, string> = {
        cash: cssVar('--chart-1'),
        zaad: cssVar('--chart-2'),
        evc: cssVar('--chart-3'),
        jeeb: cssVar('--chart-4'),
        card: cssVar('--chart-5'),
    };
    const fallbackColor = cssVar('--text-muted');
    const getColor = (method: string) => METHOD_COLORS[method] ?? fallbackColor;

    if (data.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card text-center px-4 py-8">
                <PieIcon className="mb-2 h-8 w-8 text-muted-foreground opacity-60" />
                <p className="text-sm font-medium text-foreground">No payment data</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Payment breakdown will appear here.
                </p>
            </div>
        );
    }

    const grandTotal = data.reduce((sum, d) => sum + d.total, 0);

    const chartData = data.map((d) => ({
        name:  d.payment_method,
        label: d.payment_method_label ?? d.payment_method,
        value: d.total,
    }));

    return (
        <div className="flex flex-col gap-4">
            {/* Donut chart */}
            <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="58%"
                            outerRadius="82%"
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={entry.name}
                                    fill={getColor(entry.name)}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2">
                {data.map((d) => {
                    const pct = grandTotal > 0
                        ? ((d.total / grandTotal) * 100).toFixed(1)
                        : '0';

                    return (
                        <div key={d.payment_method} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className="h-3 w-3 shrink-0 rounded-full"
                                    style={{ backgroundColor: getColor(d.payment_method) }}
                                />
                                <span className="truncate text-sm text-foreground">
                                    {d.payment_method_label ?? d.payment_method}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-semibold text-foreground">
                                    ${d.total.toFixed(0)}
                                </span>
                                <span className="text-xs tabular-nums text-muted-foreground">
                                    {pct}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}