import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CustomerDialog from '@/components/CustomerDialog';
import CustomerTable from '@/components/CustomerTable';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types';

type Props = {
    customers: Customer[];
};

export default function CustomersIndex({ customers }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<
        Customer | undefined
    >(undefined);

    function handleAdd() {
        setEditingCustomer(undefined);
        setDialogOpen(true);
    }

    function handleEdit(customer: Customer) {
        setEditingCustomer(customer);
        setDialogOpen(true);
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open);

        if (!open) {
            setEditingCustomer(undefined);
        }
    }

    return (
        <>
            <Head title="Customers" />
            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-y-3">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                            Customers
                        </h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            Manage your pharmacy customers.
                        </p>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="gap-2 bg-brand hover:bg-brand-dark"
                    >
                        <Plus className="h-4 w-4" />
                        Add Customer
                    </Button>
                </div>

                <CustomerTable
                    customers={customers}
                    teamSlug={teamSlug}
                    onEdit={handleEdit}
                />
            </div>

            <CustomerDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                teamSlug={teamSlug}
                customer={editingCustomer}
            />
        </>
    );
}

CustomersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Customers',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/customers`
                : '/',
        },
    ],
});
