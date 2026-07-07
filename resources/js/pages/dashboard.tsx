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
    totalCustomers: number;
    totalProducts: number;
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
                        iconBgClass="bg-success-bg"
                        iconColorClass="text-success-fg"
                    />
                    <StatCard
                        title="Transactions"
                        value={stats.totalTransactions.toLocaleString()}
                        icon={Receipt}
                        iconBgClass="bg-chip-pink"
                        iconColorClass="text-danger-fg"
                    />
                    <StatCard
                        title="Customers"
                        value={stats.totalCustomers.toLocaleString()}
                        icon={Users}
                        iconBgClass="bg-chip-blue"
                        iconColorClass="text-accent-indigo"
                    />
                    <StatCard
                        title="Products"
                        value={stats.totalProducts.toLocaleString()}
                        icon={Pill}
                        iconBgClass="bg-chip-orange"
                        iconColorClass="text-warning-fg"
                    />
                </div>

                {/* Charts Row: Revenue Line (2/3) + Payment Donut (1/3) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Revenue Line Chart */}
                    <Card className="flex flex-col gap-3 p-5 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-text-primary">
                                    Daily Revenue
                                </h2>
                                <p className="mt-0.5 text-xs text-text-secondary">
                                    Last 30 days of sales totals.
                                </p>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-bg">
                                <TrendingUp className="h-4 w-4 text-info-fg" />
                            </div>
                        </div>
                        <RevenueLineChart data={revenueByDay} />
                    </Card>

                    {/* Payment Method Donut */}
                    <Card className="flex flex-col gap-3 p-5">
                        <div>
                            <h2 className="text-base font-bold text-text-primary">
                                Payment Methods
                            </h2>
                            <p className="mt-0.5 text-xs text-text-secondary">
                                Revenue split by payment type.
                            </p>
                        </div>
                        <PaymentMethodDonut data={revenueByPaymentMethod} />
                    </Card>
                </div>

                {/* Main Content Grid: 2/3 Recent Transactions, 1/3 Low Stock Alerts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent Transactions Table */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-text-primary">
                                    Recent Transactions
                                </h2>
                                <p className="mt-0.5 text-xs text-text-secondary">
                                    Latest checkout sales at your pharmacy.
                                </p>
                            </div>
                            <Link
                                href={`/${teamSlug}/transactions`}
                                className="flex items-center gap-1 text-xs font-semibold text-accent-indigo hover:underline"
                            >
                                View all
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-border-soft bg-surface py-12 text-center">
                                <Receipt className="mb-3 h-8 w-8 text-text-secondary opacity-60" />
                                <p className="text-sm font-medium text-text-primary">
                                    No transactions yet
                                </p>
                                <p className="mt-1 text-xs text-text-secondary">
                                    Start scanning products to generate checkout
                                    sales.
                                </p>
                            </div>
                        ) : (
                            <Card className="overflow-hidden p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-border-soft hover:bg-transparent">
                                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Invoice #</TableHead>
                                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Customer</TableHead>
                                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Total</TableHead>
                                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentTransactions.map((tx) => (
                                            <TableRow
                                                key={tx.id}
                                                className="border-b border-border-soft hover:bg-primary-50 transition-colors"
                                            >
                                                <TableCell className="px-6 py-4 font-mono text-xs font-semibold text-text-primary">
                                                    {tx.invoice_number}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="text-sm font-medium text-text-primary">
                                                        {tx.customer_name}
                                                    </div>
                                                    <div className="text-xs text-text-secondary">
                                                        by {tx.cashier_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 font-medium text-text-primary">
                                                    ${tx.total.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-text-secondary">
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
                                    <h2 className="text-lg font-bold text-text-primary">
                                        Inventory Alerts
                                    </h2>

                                    <div className="flex rounded-lg bg-canvas p-0.5 border border-border-soft shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlertTab('stock')}
                                            className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-all ${activeAlertTab === 'stock'
                                                    ? 'bg-surface text-brand shadow-[0_1px_3px_rgba(20,28,64,0.08)]'
                                                    : 'text-text-secondary hover:text-text-primary'
                                                }`}
                                        >
                                            Low Stock ({lowStockProducts.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveAlertTab('expiry')}
                                            className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-all ${activeAlertTab === 'expiry'
                                                    ? 'bg-surface text-brand shadow-[0_1px_3px_rgba(20,28,64,0.08)]'
                                                    : 'text-text-secondary hover:text-text-primary'
                                                }`}
                                        >
                                            Expiring ({expiringProducts.length})
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary">
                                    {activeAlertTab === 'stock'
                                        ? 'Items at or below warning levels.'
                                        : 'Products expiring within 30 days.'}
                                </p>
                            </div>

                            {activeAlertTab === 'stock' ? (
                                lowStockProducts.length === 0 ? (
                                    <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-border-soft bg-surface px-4 py-8 text-center">
                                        <CheckCircle2 className="mb-3 h-10 w-10 text-success-fg" />
                                        <p className="text-sm font-medium text-text-primary">
                                            Inventory fully stocked
                                        </p>
                                        <p className="mx-auto mt-1 max-w-[200px] text-xs text-text-secondary">
                                            All items are currently above their warning thresholds.
                                        </p>
                                    </div>
                                ) : (
                                    <Card className="flex max-h-[400px] flex-col gap-4 overflow-y-auto p-4">
                                        {lowStockProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex items-start justify-between gap-3 rounded-lg border border-border-soft p-3 transition-colors hover:bg-canvas/50"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="line-clamp-1 text-sm font-semibold text-text-primary">
                                                        {p.name}
                                                    </span>
                                                    <span className="text-[11px] text-text-secondary">
                                                        {p.category_name}
                                                    </span>
                                                    <span className="mt-1 text-xs text-text-secondary">
                                                        Stock:{' '}
                                                        <span className="font-bold text-text-primary">
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
                                    <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-border-soft bg-surface px-4 py-8 text-center">
                                        <CheckCircle2 className="mb-3 h-10 w-10 text-success-fg" />
                                        <p className="text-sm font-medium text-text-primary">
                                            No expiring products
                                        </p>
                                        <p className="mx-auto mt-1 max-w-[200px] text-xs text-text-secondary">
                                            All products have a valid expiry status.
                                        </p>
                                    </div>
                                ) : (
                                    <Card className="flex max-h-[400px] flex-col gap-4 overflow-y-auto p-4">
                                        {expiringProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex items-start justify-between gap-3 rounded-lg border border-border-soft p-3 transition-colors hover:bg-canvas/50"
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="line-clamp-1 text-sm font-semibold text-text-primary">
                                                        {p.name}
                                                    </span>
                                                    <span className="mt-1 text-xs text-text-secondary">
                                                        Expiry:{' '}
                                                        <span className="font-bold text-text-primary">
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
                                                            ? 'bg-danger-bg text-danger-fg hover:bg-danger-bg/80 border-transparent shadow-none'
                                                            : 'bg-warning-bg text-warning-fg hover:bg-warning-bg/80 border-transparent shadow-none'
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

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/dashboard`
                : '/',
        },
    ],
});
