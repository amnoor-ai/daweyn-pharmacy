import { router } from '@inertiajs/react';
import { Pencil, Trash2, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import ProductAvatar from '@/components/ProductAvatar';
import TablePagination from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Product } from '@/types';


type Props = {
    products: Product[];
    teamSlug: string;
    onEdit: (product: Product) => void;
};

export default function ProductTable({ products, teamSlug, onEdit }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const sortedProducts = useMemo(() => {
        const sortableItems = [...products];

        if (sortConfig !== null) {
            sortableItems.sort((a: any, b: any) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Nested category name sort
                if (sortConfig.key === 'category') {
                    aValue = a.category?.name;
                    bValue = b.category?.name;
                }
                
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
    }, [products, sortConfig]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        return sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [sortedProducts, currentPage]);

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

        router.delete(`/${teamSlug}/products/${deleteTarget.id}`, {
            preserveScroll: true,
        });
        setDeleteTarget(null);
    }

    if (products.length === 0) {
        return (
            <div className="rounded-lg border border-border bg-card">
                <p className="p-8 text-center text-sm text-muted-foreground">
                    No products yet. Click &quot;Add Product&quot; to create
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
                            <TableHead className="w-[200px] max-w-[200px] cursor-pointer select-none" onClick={() => requestSort('name')}>Product <SortIcon columnKey="name" /></TableHead>
                            <TableHead className="w-[140px] cursor-pointer select-none" onClick={() => requestSort('category')}>Category <SortIcon columnKey="category" /></TableHead>
                            <TableHead className="w-[130px] cursor-pointer select-none" onClick={() => requestSort('sku')}>SKU <SortIcon columnKey="sku" /></TableHead>
                            <TableHead className="text-right w-[90px] cursor-pointer select-none" onClick={() => requestSort('cost_price')}>Cost <SortIcon columnKey="cost_price" /></TableHead>
                            <TableHead className="text-right w-[90px] cursor-pointer select-none" onClick={() => requestSort('selling_price')}>Price <SortIcon columnKey="selling_price" /></TableHead>
                            <TableHead className="text-right w-[170px] cursor-pointer select-none" onClick={() => requestSort('stock')}>Stock / Status <SortIcon columnKey="stock" /></TableHead>
                            <TableHead className="w-[110px] cursor-pointer select-none" onClick={() => requestSort('expiry_date')}>Expiry <SortIcon columnKey="expiry_date" /></TableHead>
                            <TableHead className="text-right w-[90px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts.map((product) => (
                            <TableRow
                                key={product.id}
                            >
                                <TableCell className="px-6 py-4 flex  gap-2 items-center  ont-medium text-foreground max-w-[200px]">
                                    <ProductAvatar src={product.image_url} alt={product.name} />
                                    <span className="line-clamp-2">{product.name}</span>
                                </TableCell>
                                <TableCell className="px-4 py-4 text-muted-foreground">
                                    {product.category?.name ?? '—'}
                                </TableCell>
                                <TableCell className="px-4 py-4 font-mono text-xs text-foreground">
                                    {product.sku}
                                </TableCell>
                                <TableCell className="px-4 py-4 text-muted-foreground text-right tabular-nums">
                                    ${Number(product.cost_price).toFixed(2)}
                                </TableCell>
                                <TableCell className="px-4 py-4 text-foreground text-right font-medium tabular-nums">
                                    ${Number(product.selling_price).toFixed(2)}
                                </TableCell>
                                <TableCell className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="text-foreground tabular-nums font-medium shrink-0">
                                            {product.stock_quantity}
                                        </span>
                                        {(() => {
                                            if (product.stock_status === 'expired') {
                                                return <Badge variant="secondary" className="rounded-full bg-destructive/10 text-destructive border-none shadow-none">Expired</Badge>;
                                            }

                                            if (product.stock_status === 'expiring_soon') {
                                                return <Badge variant="secondary" className="rounded-full bg-amber-500/10 text-amber-500 border-none shadow-none">Exp. Soon</Badge>;
                                            }

                                            if (product.stock_quantity === 0) {
                                                return <Badge variant="secondary" className="rounded-full bg-destructive/10 text-destructive border-none shadow-none">Out of Stock</Badge>;
                                            }

                                            if (product.stock_quantity <= (product.alert_threshold ?? 0)) {
                                                return <Badge variant="secondary" className="rounded-full bg-amber-500/10 text-amber-500 border-none shadow-none">Low Stock</Badge>;
                                            }

                                            return <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-500 border-none shadow-none">In Stock</Badge>;
                                        })()}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-4 text-muted-foreground text-left">
                                    {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '—'}
                                </TableCell>
                                <TableCell className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(product)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">
                                                Edit {product.name}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteTarget(product)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete {product.name}
                                            </span>
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
                    totalItems={sortedProducts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    );
}
