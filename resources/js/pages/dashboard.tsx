import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    DollarSign,
    Pill,
    Receipt,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import PaymentMethodDonut from '@/components/PaymentMethodDonut';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import RevenueLineChart from '@/components/RevenueLineChart';
import StatCard from '@/components/stat-card';
import StockAlertBadge from '@/components/StockAlertBadge';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { DashboardInvitation } from '@/types';

type DashboardStats = {
    totalRevenue: number;
    totalTransactions: number;
    activeCustomers: number;
    lowStockCount: number;
};

type LowStockProduct = {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    alert_threshold: number;
    category_name: string;
};

type RecentTransaction = {
    id: number;
    invoice_number: string;
    customer_name: string;
    cashier_name: string;
    total: number;
    payment_method: string;
    created_at: string;
    items_count: number;
};

type RevenueByPaymentMethod = {
    payment_method: string;
    total: number;
};

type RevenueByDay = {
    date: string;
    total: number;
};

type ExpiringProduct = {
    id: number;
    name: string;
    sku: string;
    expiry_date: string;
    days_remaining: number;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    stats: DashboardStats;
    lowStockProducts: LowStockProduct[];
    recentTransactions: RecentTransaction[];
    revenueByPaymentMethod: RevenueByPaymentMethod[];
    revenueByDay: RevenueByDay[];
    expiringProducts?: ExpiringProduct[];
};

export default function Dashboard({
    pendingInvitations = [],
    stats,
    lowStockProducts = [],
    recentTransactions = [],
    revenueByPaymentMethod = [],
    revenueByDay = [],
    expiringProducts = [],
}: Props) {
    const { props: pageProps } = usePage();
    const currentTeam = pageProps.currentTeam as {
        slug: string;
        name: string;
    } | null;
    const teamSlug = currentTeam?.slug ?? '';

    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );
    const [activeAlertTab, setActiveAlertTab] = useState<'stock' | 'expiry'>('stock');

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="flex flex-col gap-6">
                {/* 4 StatCards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            },
                        )}`}
                        icon={DollarSign}
                        iconBgClass="bg-emerald-500/10"
                        iconColorClass="text-emerald-500"
                    />
                    <StatCard
                        title="Orders"
                        value={stats.totalTransactions.toLocaleString()}
                        icon={Receipt}
                        iconBgClass="bg-chip-pink"
                        iconColorClass="text-destructive"
                    />
                    <StatCard
                        title="Active Customers"
                        value={stats.activeCustomers.toLocaleString()}
                        icon={Users}
                        iconBgClass="bg-chip-blue"
                        iconColorClass="text-primary"
                    />
                    <StatCard
                        title="Low Stock"
                        value={stats.lowStockCount.toLocaleString()}
                        icon={Pill}
                        iconBgClass="bg-chip-orange"
                        iconColorClass="text-amber-500"
                    />
                </div>

                {/* Charts Row: Revenue Line (2/3) + Payment Donut (1/3) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Revenue Line Chart */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    Daily Revenue
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Last 30 days of sales totals.
                                </p>
                            </div>
                        </div>
                        <Card className="flex flex-col gap-3 p-5">
                            <RevenueLineChart data={revenueByDay} />
                        </Card>
                    </div>

                    {/* Payment Method Donut */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-foreground">
                                Payment Methods
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Revenue split by payment type.
                            </p>
                        </div>
                        <Card className="flex flex-col gap-3 p-5 h-full">
                            <PaymentMethodDonut data={revenueByPaymentMethod} />
                        </Card>
                    </div>
                </div>

                {/* Main Content Grid: 2/3 Recent Transactions, 1/3 Low Stock Alerts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Transactions Table */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">
                                    Recent Transactions
                                </h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Latest checkout sales at your pharmacy.
                                </p>
                            </div>
                            <Link
                                href={`/${teamSlug}/transactions`}
                                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                            >
                                View all
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-12 text-center">
                                <Receipt className="mb-3 h-8 w-8 text-muted-foreground opacity-60" />
                                <p className="text-sm font-medium text-foreground">
                                    No transactions yet
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Start scanning products to generate checkout
                                    sales.
                                </p>
                            </div>
                        ) : (
                            <Card className="overflow-hidden p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions.map((tx) => (
                                            <TableRow
                                                key={tx.id}
                                            >
                                                <TableCell className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                                                    {tx.invoice_number}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {tx.customer_name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        by {tx.cashier_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 font-medium text-foreground">
                                                    ${tx.total.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-muted-foreground">
                                                    {tx.created_at
                                                        ? new Date(
                                                              tx.created_at,
                                                          ).toLocaleDateString(
                                                              'en-GB',
                                                              {
                                                                  day: 'numeric',
                                                                  month: 'short',
                                                                  year: 'numeric',
                                                              },
                                                          )
                                                        : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                    </div>

                    {/* Alerts Column */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-foreground">
                                        Inventory Alerts
                                    </h2>

                                    <div className="flex rounded-lg bg-muted/30 p-0.5 border border-border shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlertTab('stock')}
                                            className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-all ${activeAlertTab === 'stock'
                                                    ? 'bg-card text-primary shadow-[0_1px_3px_rgba(20,28,64,0.08)]'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            Low Stock ({lowStockProducts.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlertTab('expiry')}
                                            className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-all ${activeAlertTab === 'expiry'
                                                    ? 'bg-card text-primary shadow-[0_1px_3px_rgba(20,28,64,0.08)]'
                                                    : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            Expiring ({expiringProducts.length})
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {activeAlertTab === 'stock'
                                        ? 'Items at or below warning levels.'
                                        : 'Products expiring within 30 days.'}
                                </p>
                            </div>

                            {activeAlertTab === 'stock' ? (
                                lowStockProducts.length === 0 ? (
                                    <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-8 text-center">
                                        <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
                                        <p className="text-sm font-medium text-foreground">
                                            Inventory fully stocked
                                        </p>
                                        <p className="mx-auto mt-1 max-w-[200px] text-xs text-muted-foreground">
                                            All items are currently above their warning thresholds.
                                        </p>
                                    </div>
                                ) : (
                                    <Card className="flex max-h-[400px] flex-col gap-4 overflow-y-auto p-4">
                                        {lowStockProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30/50"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="line-clamp-1 text-sm font-semibold text-foreground">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {p.category_name}
                                                    </span>
                                                    <span className="mt-1 text-xs text-muted-foreground">
                                                        Stock:{' '}
                                                        <span className="font-bold text-foreground">
                                                            {p.stock_quantity}
                                                        </span>{' '}
                                                        (Alert: {p.alert_threshold})
                                                    </span>
                                                </div>
                                                <StockAlertBadge
                                                    quantity={p.stock_quantity}
                                                    threshold={p.alert_threshold}
                                                />
                                            </div>
                                        ))}
                                    </Card>
                                )
                            ) : (
                                expiringProducts.length === 0 ? (
                                    <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-8 text-center">
                                        <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
                                        <p className="text-sm font-medium text-foreground">
                                            No expiring products
                                        </p>
                                        <p className="mx-auto mt-1 max-w-[200px] text-xs text-muted-foreground">
                                            All products have a valid expiry status.
                                        </p>
                                    </div>
                                ) : (
                                    <Card className="flex max-h-[400px] flex-col gap-4 overflow-y-auto p-4">
                                        {expiringProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30/50"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="line-clamp-1 text-sm font-semibold text-foreground">
                                                        {p.name}
                                                    </span>
                                                    <span className="mt-1 text-xs text-muted-foreground">
                                                        Expiry:{' '}
                                                        <span className="font-bold text-foreground">
                                                            {p.expiry_date
                                                                ? new Date(
                                                                    p.expiry_date,
                                                                ).toLocaleDateString(
                                                                    'en-GB',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    },
                                                                )
                                                                : '—'}
                                                        </span>
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className={`rounded-full ${p.days_remaining === 0
                                                            ? 'bg-destructive/10 text-destructive hover:bg-destructive/10/80 border-transparent shadow-none'
                                                            : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10/80 border-transparent shadow-none'
                                                        }`}
                                                >
                                                    {p.days_remaining === 0
                                                        ? 'Expires today'
                                                        : p.days_remaining === 1
                                                            ? '1 day left'
                                                            : `${p.days_remaining} days left`}
                                                </Badge>
                                            </div>
                                        ))}
                                    </Card>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/dashboard`
                : '/',
        },
    ],
});
