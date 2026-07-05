import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CustomerDialog from '@/components/CustomerDialog';
import CustomerTable from '@/components/CustomerTable';
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
            <div className="flex flex-col gap-6">
                <CustomerTable
                    customers={customers}
                    teamSlug={teamSlug}
                    onEdit={handleEdit}
                    onAdd={handleAdd}
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
