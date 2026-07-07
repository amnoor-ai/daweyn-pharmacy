import { router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
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
            <div className="rounded-lg border border-border-soft bg-surface">
                <p className="p-8 text-center text-sm text-text-secondary">
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

            <div className="flex-1 overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="border-b border-divider hover:bg-transparent">
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Name</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Phone</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Email</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Loyalty Points</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Total Spent</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Last Visit</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow
                                key={customer.id}
                                className="border-b border-divider hover:bg-primary-50 transition-colors"
                            >
                                <TableCell className="px-6 py-4 font-medium text-text-primary">
                                    {customer.name}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-secondary text-left">
                                    {customer.phone}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-secondary text-left">
                                    {customer.email ?? (
                                        <span className="text-text-secondary/50 italic">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-primary text-left">
                                    {customer.loyalty_points}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-primary text-right font-medium">
                                    ${Number((customer as any).transactions_sum_total ?? 0).toFixed(2)}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-secondary text-right">
                                    {(customer as any).transactions_max_created_at ? new Date((customer as any).transactions_max_created_at).toLocaleDateString() : '—'}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.visit(`/${teamSlug}/customers/${customer.id}`)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">View {customer.name}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(customer)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit {customer.name}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteTarget(customer)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
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
            </div>
        </>
    );
}
