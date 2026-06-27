import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { createElement, Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomerTable from '@/components/CustomerTable';
import CustomerDialog from '@/components/CustomerDialog';
import type { Customer } from '@/types';

type Props = {
    customers: Customer[];
};

export default function CustomersIndex({ customers }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

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
        if (!open) setEditingCustomer(undefined);
    }

    return createElement(
        Fragment,
        null,
        createElement(Head, { title: 'Customers' }),
        createElement(
            'div',
            { className: 'flex flex-col gap-6 p-6' },
            createElement(
                'div',
                { className: 'flex items-center justify-between' },
                createElement(
                    'div',
                    null,
                    createElement(
                        'h1',
                        { className: 'text-2xl font-bold tracking-tight text-text-primary' },
                        'Customers'
                    ),
                    createElement(
                        'p',
                        { className: 'mt-1 text-sm text-text-secondary' },
                        'Manage your pharmacy customers.'
                    )
                ),
                createElement(
                    Button,
                    {
                        onClick: handleAdd,
                        className: 'gap-2 bg-brand hover:bg-brand-dark',
                    },
                    createElement(Plus, { className: 'h-4 w-4' }),
                    'Add Customer'
                )
            ),
            createElement(CustomerTable, {
                customers,
                teamSlug,
                onEdit: handleEdit,
            })
        ),
        createElement(CustomerDialog, {
            open: dialogOpen,
            onOpenChange: handleDialogChange,
            teamSlug,
            customer: editingCustomer,
        })
    );
}

CustomersIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Customers',
            href: props.currentTeam ? `/${props.currentTeam.slug}/customers` : '/',
        },
    ],
});