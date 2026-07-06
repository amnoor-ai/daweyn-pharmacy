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
import type { Product } from '@/types';

type Category = { id: number; name: string };

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
    const [query, setQuery] = useState('');

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
        if (!open) setEditingProduct(undefined);
    }

    // Client-side category & status filter (applied on top of server-side q= search)
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchQuery =
                !query ||
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                (p.sku && p.sku.toLowerCase().includes(query.toLowerCase()));
            const matchCat =
                !categoryFilter ||
                String(p.category?.id ?? '') === categoryFilter;
            const matchStatus =
                !statusFilter ||
                (statusFilter === 'low'
                    ? p.stock_quantity <= (p.alert_threshold ?? 0) && p.stock_status !== 'expired'
                    : p.stock_status === statusFilter);
            return matchQuery && matchCat && matchStatus;
        });
    }, [products, query, categoryFilter, statusFilter]);

    return (
        <>
            <Head title="Products" />
            <div className="flex flex-col flex-1 gap-4">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative min-w-[200px] flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products…"
                            className="h-9 pl-9 text-sm"
                        />
                    </div>

                    {/* Category filter */}
                    {categories.length > 0 && (
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="h-9 min-w-[140px]">
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
                        <SelectTrigger className="h-9 min-w-[130px]">
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

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Primary action */}
                    <Button
                        onClick={handleAdd}
                        className="gap-1.5 bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5 px-3"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Product</span>
                    </Button>
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
