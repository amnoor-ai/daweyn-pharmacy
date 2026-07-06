import { Head, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import CustomerDialog from '@/components/CustomerDialog';
import CustomerTable from '@/components/CustomerTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTableSearch } from '@/hooks/use-table-search';
import type { Customer } from '@/types';

type Props = {
    customers: Customer[];
};

export default function CustomersIndex({ customers }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';
    const [query, setQuery] = useState('');

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone?.toLowerCase().includes(query.toLowerCase())
    );

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
        if (!open) setEditingCustomer(undefined);
    }

    return (
        <>
            <Head title="Customers" />
            <div className="flex flex-col flex-1 gap-4">
                {/* Toolbar */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search customers…"
                            className="h-9 pl-9 text-sm"
                        />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Primary action */}
                    <Button
                        onClick={handleAdd}
                        className="gap-2 bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4" />
                        Add Customer
                    </Button>
                </div>

                {/* Table */}
                <div className="flex-1 flex flex-col min-h-0">
                    <CustomerTable
                        customers={filteredCustomers}
                        teamSlug={teamSlug}
                        onEdit={handleEdit}
                    />
                </div>
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
