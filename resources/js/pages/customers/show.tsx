import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Search, Filter as FilterIcon, User } from 'lucide-react';
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

    // Flatten transactions → items
    const allItems = customer.transactions?.flatMap((t) =>
        (t.items || []).map((item: any) => ({ ...item, transaction: t }))
    ) ?? [];

    const filteredItems = allItems.filter((item) => {
        const q = query.toLowerCase();
        const productName = item.product?.name?.toLowerCase() ?? '';
        const invoice = item.transaction?.invoice_number?.toLowerCase() ?? '';
        return productName.includes(q) || invoice.includes(q);
    });

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
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2 text-muted-foreground"
                            >
                                <FilterIcon className="h-4 w-4" />
                                Filters
                            </Button>
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

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Items Bought</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-12 text-center text-sm text-muted-foreground"
                                        >
                                            No purchase history found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredItems.map((item, idx) => (
                                        <TableRow key={`${item.transaction_id}-${item.product_id}-${idx}`}>
                                            <TableCell>
                                                {new Date(item.transaction?.created_at)
                                                    .toISOString()
                                                    .split('T')[0]}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.transaction?.invoice_number || '—'}
                                            </TableCell>
                                            <TableCell>
                                                {item.product?.name || 'Unknown Product'}
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                                ${Number(item.unit_price).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${Number(item.total).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs"
                                                    >
                                                        View Order
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs"
                                                    >
                                                        Download Invoice
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
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