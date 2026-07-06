import { router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types';

type Props = {
    customers: Customer[];
    teamSlug: string;
    onEdit: (customer: Customer) => void;
};

export default function CustomerTable({ customers, teamSlug, onEdit }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
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

            <div className="overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[550px] text-sm">
                        <thead>
                            <tr className="border-b border-divider">
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Name
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Phone
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Email
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Loyalty Points
                                </th>
                                <th className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, idx) => (
                                <tr
                                    key={customer.id}
                                    className={
                                        idx !== customers.length - 1
                                            ? 'border-b border-divider'
                                            : ''
                                    }
                                >
                                    <td className="px-6 py-4 font-medium text-text-primary">
                                        {customer.name}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {customer.phone}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {customer.email ?? (
                                            <span className="text-text-secondary italic">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-text-primary">
                                        {customer.loyalty_points}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(
                                                        `/${teamSlug}/customers/${customer.id}`,
                                                    )
                                                }
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">
                                                    View {customer.name}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(customer)}
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Edit {customer.name}
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteTarget(customer)}
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Delete {customer.name}
                                                </span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
