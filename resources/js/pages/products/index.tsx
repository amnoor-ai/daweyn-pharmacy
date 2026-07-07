import { Head, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductSheet from '@/components/ProductSheet';
import ProductTable from '@/components/ProductTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTableSearch } from '@/hooks/use-table-search';
import type { Product, Category } from '@/types';

type Props = {
    products: Product[];
    categories?: Category[];
};

const STOCK_STATUS_OPTIONS = [
    { value: '', label: 'All Status' },
    { value: 'valid', label: 'In Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'expiring_soon', label: 'Expiring Soon' },
    { value: 'expired', label: 'Expired' },
];

export default function ProductsIndex({ products, categories = [] }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';
    const { query, handleSearch } = useTableSearch();

    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    function handleAdd() {
        setEditingProduct(undefined);
        setSheetOpen(true);
    }

    function handleEdit(product: Product) {
        setEditingProduct(product);
        setSheetOpen(true);
    }

    function handleSheetChange(open: boolean) {
        setSheetOpen(open);

        if (!open) {
setEditingProduct(undefined);
}
    }

    // Client-side category & status filter (applied on top of server-side search)
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchCat =
                !categoryFilter ||
                String(p.category?.id ?? '') === categoryFilter;
            const matchStatus =
                !statusFilter ||
                (statusFilter === 'low'
                    ? p.stock_quantity <= (p.alert_threshold ?? 0) && p.stock_status !== 'expired'
                    : p.stock_status === statusFilter);

            return matchCat && matchStatus;
        });
    }, [products, categoryFilter, statusFilter]);

    return (
        <>
            <Head title="Products" />
            <div className="flex flex-col flex-1 gap-4">
                {/* Page Header */}
                <div className="flex items-center justify-between mt-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Products</h2>
                        <p className="text-sm text-text-muted mt-1">Manage your pharmacy products and monitor inventory.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleAdd}
                            className="gap-1.5 bg-brand hover:bg-brand-dark transition-all duration-200 shadow-sm px-4"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Add Product</span>
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 p-1">
                    {/* Search */}
                    <div className="relative min-w-[200px] flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search products…"
                            className="h-9 pl-9 text-sm bg-surface shadow-sm"
                        />
                    </div>

                    {/* Category filter */}
                    {categories.length > 0 && (
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="h-9 min-w-[140px] bg-surface shadow-sm">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Categories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Status filter */}
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="h-9 min-w-[130px] bg-surface shadow-sm">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {STOCK_STATUS_OPTIONS.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="flex-1 flex flex-col min-h-0">
                    <ProductTable
                        products={filteredProducts}
                        teamSlug={teamSlug}
                        onEdit={handleEdit}
                    />
                </div>
            </div>

            <ProductSheet
                open={sheetOpen}
                onOpenChange={handleSheetChange}
                teamSlug={teamSlug}
                categories={categories}
                product={editingProduct}
            />
        </>
    );
}

ProductsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Products',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/products`
                : '/',
        },
    ],
});
