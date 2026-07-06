import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Search, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTableSearch } from '@/hooks/use-table-search';
import type { Transaction } from '@/types';

type Props = {
    transactions: Transaction[];
};

const paymentBadge: Record<string, string> = {
    cash: 'bg-success-bg text-success-fg',
    zaad: 'bg-info-bg text-info-fg',
    evc: 'bg-info-bg text-info-fg',
    jeeb: 'bg-info-bg text-info-fg',
    card: 'bg-warning-bg text-warning-fg',
};

const PAYMENT_OPTIONS = [
    { value: '', label: 'All Payment' },
    { value: 'cash', label: 'Cash' },
    { value: 'zaad', label: 'ZAAD' },
    { value: 'evc', label: 'EVC' },
    { value: 'jeeb', label: 'Jeeb' },
    { value: 'card', label: 'Card' },
];

export default function TransactionsIndex({ transactions }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';
    const [query, setQuery] = useState('');

    const [paymentFilter, setPaymentFilter] = useState('');

    // Client-side payment method filter (on top of search)
    const filteredTx = useMemo(() => {
        return transactions.filter((tx) => {
            const matchQuery = !query ||
                (tx.invoice_number ?? '').toLowerCase().includes(query.toLowerCase()) ||
                (tx.customer?.name ?? '').toLowerCase().includes(query.toLowerCase());
            const matchPayment = !paymentFilter || tx.payment_method === paymentFilter;
            return matchQuery && matchPayment;
        });
    }, [transactions, query, paymentFilter]);

    return (
        <>
            <Head title="Transactions" />
            <div className="flex flex-col flex-1 gap-4">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search transactions…"
                            className="h-9 pl-9 text-sm"
                        />
                    </div>

                    {/* Payment filter */}
                    <Select
                        value={paymentFilter}
                        onValueChange={setPaymentFilter}
                    >
                        <SelectTrigger className="h-9 min-w-[140px]">
                            <SelectValue placeholder="All Payment" />
                        </SelectTrigger>
                        <SelectContent>
                            {PAYMENT_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Primary action */}
                    <Button
                        onClick={() => router.visit(`/${teamSlug}/pos`)}
                        className="gap-2 bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Go to POS
                    </Button>
                </div>

                {/* Table */}
                {filteredTx.length === 0 ? (
                    <div className="flex-1 rounded-lg border border-border-soft bg-surface">
                        <p className="p-8 text-center text-sm text-text-secondary">
                            No transactions yet. Click &quot;Go to POS&quot; to
                            record one.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow className="border-b border-divider hover:bg-transparent">
                                    <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Invoice</TableHead>
                                    <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Customer</TableHead>
                                    <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Payment</TableHead>
                                    <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Total</TableHead>
                                    <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Date</TableHead>
                                    <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTx.map((tx) => (
                                    <TableRow
                                        key={tx.id}
                                        className="border-b border-divider hover:bg-primary-50 transition-colors"
                                    >
                                        <TableCell className="px-6 py-4 font-mono text-xs font-medium text-text-primary">
                                            {tx.invoice_number}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-text-secondary">
                                            {tx.customer?.name ?? (
                                                <span className="italic">Walk-in</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentBadge[tx.payment_method]}`}
                                            >
                                                {tx.payment_method.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-text-primary">
                                            ${Number(tx.total).toFixed(2)}
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
                                        <TableCell className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(
                                                        `/${teamSlug}/transactions/${tx.id}`,
                                                    )
                                                }
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">
                                                    View {tx.invoice_number}
                                                </span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

TransactionsIndex.layout = (props: {
    currentTeam?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: 'Transactions',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/transactions`
                : '/',
        },
    ],
});
