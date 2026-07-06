import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import StockAlertBadge from '@/components/StockAlertBadge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

type Props = {
    products: Product[];
    teamSlug: string;
    onEdit: (product: Product) => void;
};

export default function ProductTable({ products, teamSlug, onEdit }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
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

            <div className="overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                        <thead>
                            <tr className="border-b border-divider">
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Product
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Image
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Category
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    SKU
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Price
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Stock
                                </th>
                                <th className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, idx) => (
                                <tr
                                    key={product.id}
                                    className={
                                        idx !== products.length - 1
                                            ? 'border-b border-divider'
                                            : ''
                                    }
                                >
                                    <td className="px-6 py-4 font-medium text-text-primary">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-10 w-10 rounded-md object-cover border border-border-soft"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-canvas border border-border-soft flex items-center justify-center">
                                                <span className="text-xs text-text-secondary">No img</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {product.category?.name ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                                        {product.sku}
                                    </td>
                                    <td className="px-6 py-4 text-text-primary">
                                        ${product.selling_price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-text-primary">
                                                {product.stock_quantity}
                                            </span>
                                            <StockAlertBadge
                                                quantity={product.stock_quantity}
                                                threshold={product.alert_threshold}
                                            />
                                            {product.stock_status === 'expired' && (
                                                <span className="inline-flex items-center rounded-full bg-danger-bg px-2.5 py-0.5 text-xs font-medium text-danger-fg">
                                                    Expired
                                                </span>
                                            )}
                                            {product.stock_status === 'expiring_soon' && (
                                                <span className="inline-flex items-center rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning-fg">
                                                    Exp. Soon
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
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
