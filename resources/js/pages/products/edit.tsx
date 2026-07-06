import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, Product } from '@/types';

type Props = {
    product: Product;
    categories: Category[];
};

type FormData = {
    _method: 'put';
    category_id: string;
    sku: string;
    name: string;
    description: string;
    cost_price: string;
    selling_price: string;
    stock_quantity: string;
    alert_threshold: string;
    expiry_date: string;
    image: File | null;
};

export default function ProductEdit({ product, categories }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const { data, setData, post, processing, errors } = useForm<FormData>({
        _method: 'put',
        category_id: String(product.category_id),
        sku: product.sku,
        name: product.name,
        description: product.description ?? '',
        cost_price: String(product.cost_price),
        selling_price: String(product.selling_price),
        stock_quantity: String(product.stock_quantity),
        alert_threshold: String(product.alert_threshold),
        expiry_date: product.expiry_date ?? '',
        image: null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/${teamSlug}/products/${product.id}`);
    }

    return (
        <>
            <Head title="Edit Product" />
            <div className="mx-auto max-w-2xl flex-col items-center bg-surface gap-6 p-6">
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
                        <Label htmlFor="category_id" className="text-foreground">
                            Category <span className="text-danger-fg">*</span>
                        </Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(val) => setData('category_id', val)}
                        >
                            <SelectTrigger id="category_id" className="w-full border-border-soft">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category_id} />
                    </div>

                    {/* Image */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="image" className="text-text-primary">
                            Product Image <span className="text-xs font-normal text-text-secondary">(optional)</span>
                        </Label>
                        
                        <div className="flex items-center gap-4">
                            {product.image_url && (
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    className="h-12 w-12 rounded-md object-cover border border-border-soft"
                                />
                            )}
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="border-border-soft flex-1"
                            />
                        </div>
                        <InputError message={errors.image as string} />
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name" className="text-text-primary">
                            Name <span className="text-danger-fg">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
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
                            onChange={(e) => setData('sku', e.target.value)}
                            className="border-border-soft"
                        />
                        <InputError message={errors.sku} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="description"
                            className="text-foreground"
                        >
                            Description{' '}
                            <span className="text-xs font-normal">
                                (optional)
                            </span>
                        </Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-md border border-border-soft px-3 py-2 text-sm text-foreground focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="cost_price"
                                className="text-text-primary"
                            >
                                Cost Price{' '}
                                <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="cost_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.cost_price}
                                onChange={(e) =>
                                    setData('cost_price', e.target.value)
                                }
                                className="border-border-soft"
                            />
                            <InputError message={errors.cost_price} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="selling_price"
                                className="text-text-primary"
                            >
                                Selling Price{' '}
                                <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="selling_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.selling_price}
                                onChange={(e) =>
                                    setData('selling_price', e.target.value)
                                }
                                className="border-border-soft"
                            />
                            <InputError message={errors.selling_price} />
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="stock_quantity"
                                className="text-text-primary"
                            >
                                Stock Quantity{' '}
                                <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="stock_quantity"
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={(e) =>
                                    setData('stock_quantity', e.target.value)
                                }
                                className="border-border-soft"
                            />
                            <InputError message={errors.stock_quantity} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="alert_threshold"
                                className="text-text-primary"
                            >
                                Alert Threshold{' '}
                                <span className="text-danger-fg">*</span>
                            </Label>
                            <Input
                                id="alert_threshold"
                                type="number"
                                min="0"
                                value={data.alert_threshold}
                                onChange={(e) =>
                                    setData('alert_threshold', e.target.value)
                                }
                                className="border-border-soft"
                            />
                            <InputError message={errors.alert_threshold} />
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="expiry_date" className="text-text-primary">
                            Expiry Date <span className="text-xs font-normal text-text-secondary">(optional)</span>
                        </Label>
                        <Input
                            id="expiry_date"
                            type="date"
                            value={data.expiry_date}
                            onChange={(e) => setData('expiry_date', e.target.value)}
                            className="border-border-soft"
                        />
                        <InputError message={errors.expiry_date} />
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
                            className="bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
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
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/products`
                : '/',
        },
        {
            title: 'Edit Product',
            href: '/',
        },
    ],
});
