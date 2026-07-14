import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Search, Filter as FilterIcon, ChevronDown, ChevronRight, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Customer } from '@/types';

type Props = {
    customer: Customer & {
        transactions?: any[];
    };
};

export default function CustomerShow({ customer }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';
    const [query, setQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const points = customer.loyalty_points ?? 0;
    const getTier = (pts: number) => {
        if (pts >= 4000) return 'Platinum';
        if (pts >= 2000) return 'Gold';
        if (pts >= 1000) return 'Silver';
        return 'Bronze';
    };
    const tier = getTier(points);
    const progressPercent = Math.min(100, (points / 4000) * 100);

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

    // All transactions sorted newest-first
    const allTransactions = [...(customer.transactions ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Filter by invoice number or product name within items, and date
    const filteredTransactions = allTransactions.filter((t) => {
        const q = query.toLowerCase();
        let matchesQuery = true;
        if (q) {
            const byInvoice = t.invoice_number?.toLowerCase().includes(q);
            const byProduct = (t.items ?? []).some((item: any) =>
                item.product?.name?.toLowerCase().includes(q)
            );
            matchesQuery = byInvoice || byProduct;
        }

        let matchesDate = true;
        if (dateFilter !== 'all') {
            const txDate = new Date(t.created_at);
            const now = new Date();
            const diffTime = now.getTime() - txDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (dateFilter === '7d' && diffDays > 7) matchesDate = false;
            if (dateFilter === '30d' && diffDays > 30) matchesDate = false;
            if (dateFilter === '90d' && diffDays > 90) matchesDate = false;
        }

        return matchesQuery && matchesDate;
    });

    function toggleExpand(id: number) {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <>
            <Head title={`Customer Profile - ${customer.name}`} />
            <div className="flex flex-col gap-6 w-full pb-8">

                {/* Page header + back button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.visit(`/${teamSlug}/customers`)}
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Customer Information
                    </h1>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1 – Profile */}
                    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                        {/* header */}
                        <div className="bg-foreground/[0.08] dark:bg-muted p-6 flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 bg-primary/15 border-2 border-border flex items-center justify-center">
                                {customer.avatar ? (
                                    <img
                                        src={customer.avatar}
                                        alt={customer.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg font-bold text-primary select-none">
                                        {getInitials(customer.name)}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/15 text-primary self-start mb-1">
                                    {tier} Member
                                </span>
                                <h2 className="text-lg font-semibold text-foreground tracking-tight truncate">
                                    {customer.name}
                                </h2>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4 flex-1">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Customer ID</p>
                                <p className="text-sm text-foreground font-medium">
                                    #C{customer.id.toString().padStart(5, '0')}
                                </p>
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Email</p>
                                <p
                                    className="text-sm text-foreground truncate"
                                    title={customer.email ?? undefined}
                                >
                                    {customer.email || '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 – Contact Details */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
                        <h3 className="text-base font-semibold text-foreground">Contact Details</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-sm text-foreground">{customer.phone || '—'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Address</p>
                                <p className="text-sm text-foreground">{customer.address || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 – Loyalty */}
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
                        <h3 className="text-base font-semibold text-foreground">Loyalty Program</h3>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Loyalty Points</p>
                            <div className="flex items-end justify-between">
                                <p className="text-3xl font-bold text-foreground">
                                    {points.toLocaleString()}{' '}
                                    <span className="text-base font-normal text-muted-foreground">pts</span>
                                </p>
                                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                                    {tier}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="bg-primary h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>Recent activity</span>
                                <span>+{points.toLocaleString()} pts</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Purchase History */}
                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
                    {/* Section header */}
                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border">
                        <h2 className="text-base font-semibold text-foreground">Recent Purchase History</h2>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger className="h-9 w-fit gap-2 border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium text-sm">
                                    <FilterIcon className="h-4 w-4" />
                                    <SelectValue placeholder="Filters" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="7d">Last 7 Days</SelectItem>
                                    <SelectItem value="30d">Last 30 Days</SelectItem>
                                    <SelectItem value="90d">Last 90 Days</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative w-full sm:w-56">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search"
                                    className="h-9 pl-9 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table — one row per transaction, expandable items */}
                    <div className="overflow-x-auto">
                        <Table className="min-w-[700px]">
                            <TableHeader>
                                <TableRow>
                                    {/* expand toggle column */}
                                    <TableHead className="w-10" />
                                    <TableHead>Date</TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center text-sm text-muted-foreground"
                                        >
                                            No purchase history found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTransactions.map((t) => {
                                        const isOpen = expandedIds.has(t.id);
                                        const itemCount = (t.items ?? []).length;
                                        return (
                                            <>
                                                {/* Main transaction row */}
                                                <TableRow
                                                    key={`tx-${t.id}`}
                                                    className="cursor-pointer"
                                                    onClick={() => itemCount > 0 && toggleExpand(t.id)}
                                                >
                                                    <TableCell className="text-muted-foreground">
                                                        {itemCount > 0 ? (
                                                            isOpen
                                                                ? <ChevronDown className="h-4 w-4" />
                                                                : <ChevronRight className="h-4 w-4" />
                                                        ) : null}
                                                    </TableCell>
                                                    <TableCell className="text-foreground">
                                                        {new Date(t.created_at).toISOString().split('T')[0]}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-foreground">
                                                        {t.invoice_number || '—'}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-foreground">
                                                        ${Number(t.total).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell
                                                        className="text-right"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 text-xs gap-1.5"
                                                                onClick={() =>
                                                                    router.visit(`/${teamSlug}/transactions/${t.id}`)
                                                                }
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View
                                                            </Button>
                                                            <a
                                                                href={`/${teamSlug}/transactions/${t.id}/download`}
                                                                download
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 text-xs gap-1.5"
                                                                    type="button"
                                                                >
                                                                    <Download className="h-3.5 w-3.5" />
                                                                    Download
                                                                </Button>
                                                            </a>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expandable items sub-table */}
                                                {isOpen && itemCount > 0 && (
                                                    <TableRow key={`tx-items-${t.id}`} className="bg-muted/40 hover:bg-muted/40">
                                                        <TableCell colSpan={6} className="p-0">
                                                            <div className="border-t border-border">
                                                                <table className="w-full text-sm">
                                                                    <thead>
                                                                        <tr className="border-b border-border bg-muted/60">
                                                                            <th className="px-10 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Qty</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unit Price</th>
                                                                            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider pr-6">Subtotal</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(t.items ?? []).map((item: any, idx: number) => (
                                                                            <tr
                                                                                key={`${t.id}-item-${item.id ?? idx}`}
                                                                                className="border-b border-border/50 last:border-0"
                                                                            >
                                                                                <td className="px-10 py-2.5 text-foreground">{item.product?.name || 'Unknown'}</td>
                                                                                <td className="px-4 py-2.5 text-muted-foreground">{item.quantity}</td>
                                                                                <td className="px-4 py-2.5 text-muted-foreground">${Number(item.unit_price).toFixed(2)}</td>
                                                                                <td className="px-4 py-2.5 text-right font-medium text-foreground pr-6">${Number(item.total).toFixed(2)}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </>
    );
}

CustomerShow.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Customer Management',
            href: props.currentTeam ? `/${props.currentTeam.slug}/customers` : '/',
        },
        {
            title: 'Customer Profile',
            href: '',
        },
    ],
});