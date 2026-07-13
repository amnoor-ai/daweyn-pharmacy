import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Search, ShoppingCart, ArrowUp, ArrowDown, ChevronsUpDown, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import TablePagination from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
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
import type { Transaction } from '@/types';

type Props = {
    transactions: Transaction[];
};

const paymentBadge: Record<string, string> = {
    cash: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10/80 border-none shadow-none',
    zaad: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10/80 border-none shadow-none',
    evc: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10/80 border-none shadow-none',
    jeeb: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10/80 border-none shadow-none',
    card: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10/80 border-none shadow-none',
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const sortedTx = useMemo(() => {
        const sortableItems = [...filteredTx];

        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Nested sorts
                if (sortConfig.key === 'customer') {
                    aValue = a.customer?.name || '';
                    bValue = b.customer?.name || '';
                } else if (sortConfig.key === 'cashier') {
                    aValue = a.cashier?.name || '';
                    bValue = b.cashier?.name || '';
                } else if (sortConfig.key === 'items') {
                    aValue = a.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                    bValue = b.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
                }
                
                if (aValue === null) {
                    return 1;
                }
                if (bValue === null) {
                    return -1;
                }
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }

                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }

                return 0;
            });
        }

        return sortableItems;
    }, [filteredTx, sortConfig]);

    const totalPages = Math.ceil(sortedTx.length / itemsPerPage);
    const paginatedTx = useMemo(() => {
        return sortedTx.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [sortedTx, currentPage]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig?.key !== columnKey) {
            return <ChevronsUpDown className="ml-2 h-4 w-4 inline-block text-gray-400" />;
        }

        return sortConfig.direction === 'asc' ? 
            <ArrowUp className="ml-2 h-4 w-4 inline-block text-primary" /> : 
            <ArrowDown className="ml-2 h-4 w-4 inline-block text-primary" />;
    };

    function exportTransactionsCSV() {
        const headers = ['Invoice', 'Customer', 'Cashier', 'Items', 'Payment Method', 'Total', 'Date'];
        const rows = sortedTx.map((tx: any) => [
            `"${tx.invoice_number || ''}"`,
            `"${tx.customer?.name || 'Walk-in'}"`,
            `"${tx.cashier?.name || ''}"`,
            tx.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0,
            tx.payment_method?.toUpperCase() || '',
            Number(tx.total).toFixed(2),
            tx.created_at ? new Date(tx.created_at).toLocaleString('en-GB') : '',
        ]);
        const csv = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <Head title="Transactions" />
            <div className="flex flex-col flex-1 gap-4">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <Heading
                        title="Transactions"
                        description="View and manage all sales transactions."
                    />
                </div>
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search transactions…"
                            className="h-9 pl-9 text-sm shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 justify-end">

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

                    {/* Export */}
                    <Button variant="outline" size="sm" onClick={exportTransactionsCSV} className="h-9 gap-2 bg-secondary hover:bg-secondary/80 text-white border-transparent">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    </div>
                </div>

                {/* Table */}
                {filteredTx.length === 0 ? (
                    <div className="flex-1 rounded-lg border border-border bg-card">
                        <p className="p-8 text-center text-sm text-muted-foreground">
                            No transactions yet. Use the POS to record your first sale.
                        </p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('invoice_number')}>Invoice <SortIcon columnKey="invoice_number" /></TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('customer')}>Customer <SortIcon columnKey="customer" /></TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('cashier')}>Cashier <SortIcon columnKey="cashier" /></TableHead>
                                    <TableHead className="text-right cursor-pointer select-none" onClick={() => requestSort('items')}>Items <SortIcon columnKey="items" /></TableHead>
                                    <TableHead className="cursor-pointer select-none" onClick={() => requestSort('payment_method')}>Payment <SortIcon columnKey="payment_method" /></TableHead>
                                    <TableHead className="text-right cursor-pointer select-none" onClick={() => requestSort('total')}>Total <SortIcon columnKey="total" /></TableHead>
                                    <TableHead className="text-right cursor-pointer select-none" onClick={() => requestSort('created_at')}>Date <SortIcon columnKey="created_at" /></TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedTx.map((tx) => (
                                    <TableRow
                                        key={tx.id}
                                    >
                                        <TableCell className="px-6 py-4 font-mono text-xs font-bold text-foreground">
                                            {tx.invoice_number}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-foreground">
                                            {tx.customer ? tx.customer.name : (
                                                <span className="text-muted-foreground">Walk-in Customer</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-muted-foreground">
                                            {tx.cashier?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-muted-foreground text-right">
                                            {tx.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0}
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <Badge
                                                variant="secondary"
                                                className={`${paymentBadge[tx.payment_method]}`}
                                            >
                                                {tx.payment_method.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-medium text-foreground text-right">
                                            ${Number(tx.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-muted-foreground text-right">
                                            {tx.created_at
                                                ? new Date(
                                                      tx.created_at,
                                                  ).toLocaleString(
                                                      'en-GB',
                                                      {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      },
                                                  )
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(
                                                        `/${teamSlug}/transactions/${tx.id}`,
                                                    )
                                                }
                                                className="h-8 gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={sortedTx.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

TransactionsIndex.layoutConfig = (props: {
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
