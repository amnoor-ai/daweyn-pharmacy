import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Search, Filter as FilterIcon, X, Download } from 'lucide-react';
import { useState } from 'react';
import CustomerDialog from '@/components/CustomerDialog';
import CustomerTable from '@/components/CustomerTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Customer } from '@/types';

type Props = {
    customers: Customer[];
    filters: any;
};

export default function CustomersIndex({ customers, filters }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';
    const [query, setQuery] = useState(filters?.q ?? '');
    
    // Filter states
    const [status, setStatus] = useState(filters?.status ?? 'all');
    const [minSpend, setMinSpend] = useState(filters?.min_spend ?? '');
    const [maxSpend, setMaxSpend] = useState(filters?.max_spend ?? '');
    const [startDate, setStartDate] = useState(filters?.start_date ?? '');
    const [endDate, setEndDate] = useState(filters?.end_date ?? '');

    const applyFilters = () => {
        router.get(`/${teamSlug}/customers`, {
            q: query,
            status,
            min_spend: minSpend,
            max_spend: maxSpend,
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setQuery('');
        setStatus('all');
        setMinSpend('');
        setMaxSpend('');
        setStartDate('');
        setEndDate('');
        router.get(`/${teamSlug}/customers`, {}, { preserveState: true, preserveScroll: true });
    };

    const filteredCustomers = customers;

    function exportCustomersCSV() {
        const headers = ['Name', 'Phone', 'Email', 'Address', 'Total Spent'];
        const rows = filteredCustomers.map((c: any) => [
            `"${c.name || ''}"`,
            c.phone || '',
            c.email || '',
            `"${c.address || ''}"`,
            Number(c.transactions_sum_total ?? 0).toFixed(2),
        ]);
        const csv = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

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
            <div className="flex flex-col flex-1 gap-4">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <Heading 
                        title="Customers" 
                        description="Manage your customer relationships and view their history." 
                    />
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search customers…"
                                className="h-9 pl-9 text-sm"
                            />
                        </div>
                        <Button variant="secondary" size="sm" onClick={applyFilters} className="h-9 shrink-0">Search</Button>
                    </div>

                    {/* Filter Popover */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 border-border bg-card text-muted-foreground gap-2">
                                <FilterIcon className="h-4 w-4" /> Filters
                                {(status !== 'all' || minSpend || maxSpend || startDate || endDate) && (
                                    <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="start">
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Filter Customers</h4>
                                
                                <div className="space-y-2">
                                    <Label className="text-xs">Activity Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Customers</SelectItem>
                                            <SelectItem value="active">Active (30 days)</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Min Spend ($)</Label>
                                        <Input type="number" value={minSpend} onChange={e => setMinSpend(e.target.value)} className="h-8 text-sm" placeholder="0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Max Spend ($)</Label>
                                        <Input type="number" value={maxSpend} onChange={e => setMaxSpend(e.target.value)} className="h-8 text-sm" placeholder="1000" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label className="text-xs">From Date</Label>
                                        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">To Date</Label>
                                        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-8 text-sm" />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-2">
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8">Clear</Button>
                                    <Button size="sm" onClick={applyFilters} className="h-8">Apply Filters</Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Removed Spacer so buttons align nicely */}

                    {/* Export */}
                    <Button variant="outline" size="sm" onClick={exportCustomersCSV} className="h-9 gap-2 border-border bg-card text-muted-foreground">
                        <Download className="h-4 w-4" /> Export
                    </Button>

                    {/* Primary action */}
                    <Button
                        onClick={handleAdd}
                        className="gap-2"
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

CustomersIndex.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Customers',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/customers`
                : '/',
        },
    ],
});
