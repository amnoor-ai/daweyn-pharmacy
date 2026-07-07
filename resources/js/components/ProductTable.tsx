import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import ProductAvatar from '@/components/ProductAvatar';
import StockAlertBadge from '@/components/StockAlertBadge';
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
            <div className="rounded-lg border border-border-soft bg-surface">
                <p className="p-8 text-center text-sm text-text-secondary">
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

            <div className="flex-1 overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="border-b border-divider hover:bg-transparent">
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Product</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Image</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Category</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">SKU</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Cost</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Price</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Stock</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Expiry</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow
                                key={product.id}
                                className="border-b border-divider hover:bg-primary-50 transition-colors"
                            >
                                <TableCell className="px-6 py-4 font-medium text-text-primary">
                                    {product.name}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <ProductAvatar src={product.image_url} alt={product.name} />
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-secondary">
                                    {product.category?.name ?? '—'}
                                </TableCell>
                                <TableCell className="px-6 py-4 font-mono text-xs text-text-secondary text-left">
                                    {product.sku}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-secondary text-right">
                                    ${product.cost_price}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-primary text-right font-medium">
                                    ${product.selling_price}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-text-primary">
                                            {product.stock_quantity}
                                        </span>
                                        <StockAlertBadge
                                            quantity={product.stock_quantity}
                                            threshold={product.alert_threshold}
                                        />
                                        {product.stock_status === 'expired' && (
                                            <Badge variant="secondary" className="rounded-full bg-danger-bg text-danger-fg hover:bg-danger-bg/80 border-transparent shadow-none">
                                                Expired
                                            </Badge>
                                        )}
                                        {product.stock_status === 'expiring_soon' && (
                                            <Badge variant="secondary" className="rounded-full bg-warning-bg text-warning-fg hover:bg-warning-bg/80 border-transparent shadow-none">
                                                Exp. Soon
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-text-secondary text-left">
                                    {product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : '—'}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(product)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
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
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
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
            </div>
        </>
    );
}
