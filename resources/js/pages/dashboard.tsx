import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import StatCard from '@/components/stat-card';
import StockAlertBadge from '@/components/StockAlertBadge';
import { 
    DollarSign, 
    Receipt, 
    Users, 
    Pill, 
    AlertTriangle, 
    CheckCircle2, 
    ArrowRight 
} from 'lucide-react';
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

type Props = {
    pendingInvitations?: DashboardInvitation[];
    stats: DashboardStats;
    lowStockProducts: LowStockProduct[];
    recentTransactions: RecentTransaction[];
    revenueByPaymentMethod: RevenueByPaymentMethod[];
};

export default function Dashboard({
    pendingInvitations = [],
    stats,
    lowStockProducts = [],
    recentTransactions = [],
    revenueByPaymentMethod = [],
}: Props) {
    const { props: pageProps } = usePage();
    const currentTeam = pageProps.currentTeam as { slug: string; name: string } | null;
    const teamSlug = currentTeam?.slug ?? '';

    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    const formatPaymentMethod = (method: string) => {
        switch (method.toLowerCase()) {
            case 'zaad': return 'ZAAD';
            case 'evc': return 'EVC';
            case 'jeeb': return 'Jeeb';
            default: return method.charAt(0).toUpperCase() + method.slice(1);
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />
            
            <div className="flex flex-col gap-6 p-6">
                {/* 4 StatCards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                        icon={DollarSign}
                        iconBgClass="bg-success-bg"
                        iconColorClass="text-success-fg"
                    />
                    <StatCard
                        title="Transactions"
                        value={stats.totalTransactions.toLocaleString()}
                        icon={Receipt}
                        iconBgClass="bg-[#FCE9F4]"
                        iconColorClass="text-[#D13B93]"
                    />
                    <StatCard
                        title="Customers"
                        value={stats.totalCustomers.toLocaleString()}
                        icon={Users}
                        iconBgClass="bg-[#E9EAFC]"
                        iconColorClass="text-[#4C5FD5]"
                    />
                    <StatCard
                        title="Products"
                        value={stats.totalProducts.toLocaleString()}
                        icon={Pill}
                        iconBgClass="bg-[#FDEADB]"
                        iconColorClass="text-[#D97706]"
                    />
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
                                <p className="text-xs text-text-secondary mt-0.5">
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
                            <div className="rounded-xl border border-border-soft bg-surface py-12 flex flex-col items-center justify-center text-center">
                                <Receipt className="h-8 w-8 text-text-secondary mb-3 opacity-60" />
                                <p className="text-sm font-medium text-text-primary">No transactions yet</p>
                                <p className="text-xs text-text-secondary mt-1">Start scanning products to generate checkout sales.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border-soft">
                                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Invoice #</th>
                                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Customer</th>
                                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Payment</th>
                                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Total</th>
                                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentTransactions.map((tx, idx) => (
                                                <tr
                                                    key={tx.id}
                                                    className={idx !== recentTransactions.length - 1 ? 'border-b border-border-soft' : ''}
                                                >
                                                    <td className="px-6 py-4 font-mono text-xs font-semibold text-text-primary">
                                                        {tx.invoice_number}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-text-primary">{tx.customer_name}</div>
                                                        <div className="text-xs text-text-secondary">by {tx.cashier_name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary">
                                                        {formatPaymentMethod(tx.payment_method)}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-text-primary">
                                                        ${tx.total.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary">
                                                        {tx.created_at
                                                            ? new Date(tx.created_at).toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Low Stock Alerts Column */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-text-primary">
                                Low Stock Alert
                            </h2>
                            <p className="text-xs text-text-secondary mt-0.5">
                                Items at or below warning levels.
                            </p>
                        </div>

                        {lowStockProducts.length === 0 ? (
                            <div className="rounded-xl border border-border-soft bg-surface py-8 px-4 flex flex-col items-center justify-center text-center h-[280px]">
                                <CheckCircle2 className="h-10 w-10 text-success-fg mb-3" />
                                <p className="text-sm font-medium text-text-primary">Inventory fully stocked</p>
                                <p className="text-xs text-text-secondary mt-1 max-w-[200px] mx-auto">
                                    All items are currently above their warning thresholds.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)] p-4 flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                                {lowStockProducts.map((p) => (
                                    <div 
                                        key={p.id}
                                        className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border-soft hover:bg-canvas/50 transition-colors"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-text-primary line-clamp-1">
                                                {p.name}
                                            </span>
                                            <span className="text-[11px] text-text-secondary">
                                                SKU: <span className="font-mono">{p.sku}</span> · {p.category_name}
                                            </span>
                                            <span className="text-xs text-text-secondary mt-1">
                                                Stock: <span className="font-bold text-text-primary">{p.stock_quantity}</span> (Alert: {p.alert_threshold})
                                            </span>
                                        </div>
                                        <StockAlertBadge 
                                            quantity={p.stock_quantity}
                                            threshold={p.alert_threshold}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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
            href: props.currentTeam ? `/${props.currentTeam.slug}/dashboard` : '/',
        },
    ],
});
