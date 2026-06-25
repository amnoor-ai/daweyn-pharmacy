import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StockAlertBadge from '@/components/StockAlertBadge';
import type { Product } from '@/types';

type Props = {
    products: Product[];
    teamSlug: string;
    onEdit: (product: Product) => void;
};

export default function ProductTable({ products, teamSlug, onEdit }: Props) {
    function handleDelete(product: Product) {
        if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            return;
        }

        router.delete(`/${teamSlug}/products/${product.id}`, {
            preserveScroll: true,
        });
    }

    if (products.length === 0) {
        return (
            <div className="rounded-xl border border-border-soft bg-surface">
                <p className="p-8 text-center text-sm text-text-secondary">
                    No products yet. Click &quot;Add Product&quot; to create one.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border-soft">
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Product</th>
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Category</th>
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">SKU</th>
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Price</th>
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">Stock</th>
                        <th className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, idx) => (
                        <tr
                            key={product.id}
                            className={idx !== products.length - 1 ? 'border-b border-border-soft' : ''}
                        >
                            <td className="px-6 py-4 font-medium text-text-primary">
                                {product.name}
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
                                    <span className="text-text-primary">{product.stock_quantity}</span>
                                    <StockAlertBadge
                                        quantity={product.stock_quantity}
                                        threshold={product.alert_threshold}
                                    />
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
                                        <span className="sr-only">Edit {product.name}</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(product)}
                                        className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete {product.name}</span>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}