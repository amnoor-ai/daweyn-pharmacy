import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import type { Category, Product } from '@/types';

type Props = {
    product: Product;
    categories: Category[];
};

type FormData = {
    category_id: string;
    sku: string;
    name: string;
    description: string;
    cost_price: string;
    selling_price: string;
    stock_quantity: string;
    alert_threshold: string;
};

export default function ProductEdit({ product, categories }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const { data, setData, put, processing, errors } = useForm<FormData>({
        category_id: String(product.category_id),
        sku: product.sku,
        name: product.name,
        description: product.description ?? '',
        cost_price: String(product.cost_price),
        selling_price: String(product.selling_price),
        stock_quantity: String(product.stock_quantity),
        alert_threshold: String(product.alert_threshold),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/${teamSlug}/products/${product.id}`);
    }

    return (
        <>
            <Head title="Edit Product" />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                        Edit Product
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Update product details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="category_id" className="text-text-primary">
                            Category <span className="text-danger-fg">*</span>
                        </Label>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={e => setData('category_id', e.target.value)}
                            className="w-full rounded-md border border-border-soft bg-white px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} />
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name" className="text-text-primary">
                            Name <span className="text-danger-fg">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="border-border-soft"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* SKU */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sku" className="text-text-primary">
                            SKU <span className="text-danger-fg">*</span>
                        </Label>
                        <Input
                            id="sku"
                            value={data.sku}
                            onChange={e => setData('sku', e.target.value)}
                            className="border-border-soft"
                        />
                        <InputError message={errors.sku} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="description" className="text-text-primary">
                            Description{' '}
                            <span className="text-text-secondary text-xs font-normal">(optional)</span>
                        </Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-border-soft bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cost_price" className="text-text-primary">
                                Cost Price <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="cost_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.cost_price}
                                onChange={e => setData('cost_price', e.target.value)}
                                className="border-border-soft"
                            />
                            <InputError message={errors.cost_price} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="selling_price" className="text-text-primary">
                                Selling Price <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="selling_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.selling_price}
                                onChange={e => setData('selling_price', e.target.value)}
                                className="border-border-soft"
                            />
                            <InputError message={errors.selling_price} />
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="stock_quantity" className="text-text-primary">
                                Stock Quantity <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="stock_quantity"
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={e => setData('stock_quantity', e.target.value)}
                                className="border-border-soft"
                            />
                            <InputError message={errors.stock_quantity} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="alert_threshold" className="text-text-primary">
                                Alert Threshold <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="alert_threshold"
                                type="number"
                                min="0"
                                value={data.alert_threshold}
                                onChange={e => setData('alert_threshold', e.target.value)}
                                className="border-border-soft"
                            />
                            <InputError message={errors.alert_threshold} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={processing}
                            className="border-border-soft"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-brand hover:bg-brand-dark"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ProductEdit.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Products',
            href: props.currentTeam ? `/${props.currentTeam.slug}/products` : '/',
        },
        {
            title: 'Edit Product',
            href: '/',
        },
    ],
});