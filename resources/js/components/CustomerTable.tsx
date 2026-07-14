import { router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TablePagination from '@/components/TablePagination';
import { Button } from '@/components/ui/button';
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
    customers: Customer[];
    teamSlug: string;
    onEdit: (customer: Customer) => void;
};

export default function CustomerTable({ customers, teamSlug, onEdit }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const sortedCustomers = useMemo(() => {
        const sortableItems = [...customers];

        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
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
    }, [customers, sortConfig]);

    const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
    const paginatedCustomers = useMemo(() => {
        return sortedCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [sortedCustomers, currentPage]);

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

    function confirmDelete() {
        if (!deleteTarget) {
return;
}

        router.delete(`/${teamSlug}/customers/${deleteTarget.id}`, {
            preserveScroll: true,
        });
        setDeleteTarget(null);
    }

    if (customers.length === 0) {
        return (
            <div className="rounded-lg border border-border bg-card">
                <p className="p-8 text-center text-sm text-muted-foreground">
                    No customers yet. Click &quot;Add Customer&quot; to create
                    one.
                </p>
            </div>
        );
    }

    return (
        <>
            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                itemName={deleteTarget?.name ?? ''}
                onConfirm={confirmDelete}
            />

            <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer select-none" onClick={() => requestSort('name')}>
                                Name <SortIcon columnKey="name" />
                            </TableHead>
                            <TableHead className="cursor-pointer select-none" onClick={() => requestSort('phone')}>
                                Phone <SortIcon columnKey="phone" />
                            </TableHead>
                            <TableHead className="cursor-pointer select-none" onClick={() => requestSort('email')}>
                                Email <SortIcon columnKey="email" />
                            </TableHead>
                            <TableHead className="cursor-pointer select-none" onClick={() => requestSort('loyalty_points')}>
                                Loyalty Points <SortIcon columnKey="loyalty_points" />
                            </TableHead>
                            <TableHead className="text-right cursor-pointer select-none" onClick={() => requestSort('transactions_sum_total')}>
                                Total Spent <SortIcon columnKey="transactions_sum_total" />
                            </TableHead>
                            <TableHead className="text-right cursor-pointer select-none" onClick={() => requestSort('transactions_max_created_at')}>
                                Last Visit <SortIcon columnKey="transactions_max_created_at" />
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCustomers.map((customer) => (
                            <TableRow
                                key={customer.id}
                            >
                                <TableCell className="px-6 py-4 font-medium text-foreground">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full shrink-0 bg-primary/10 border border-border flex items-center justify-center overflow-hidden">
                                            {customer.avatar ? (
                                                <img src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-bold text-primary select-none">
                                                    {customer.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        {customer.name}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-muted-foreground text-left">
                                    {customer.phone}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-muted-foreground text-left">
                                    {customer.email ?? (
                                        <span className="text-muted-foreground/50 italic">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-foreground text-left">
                                    {customer.loyalty_points}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-foreground text-right font-medium">
                                    ${Number((customer as any).transactions_sum_total ?? 0).toFixed(2)}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-muted-foreground text-right">
                                    {(customer as any).transactions_max_created_at ? new Date((customer as any).transactions_max_created_at).toLocaleDateString() : '—'}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.visit(`/${teamSlug}/customers/${customer.id}`)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View {customer.name}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(customer)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit {customer.name}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteTarget(customer)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete {customer.name}</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedCustomers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
}
