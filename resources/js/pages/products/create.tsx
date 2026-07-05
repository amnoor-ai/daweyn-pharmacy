import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

type Props = {
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
    expiry_date: string;
};

export default function ProductCreate({ categories }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const { data, setData, post, processing, errors } = useForm<FormData>({
        category_id: '',
        sku: '',
        name: '',
        description: '',
        cost_price: '',
        selling_price: '',
        stock_quantity: '',
        alert_threshold: '10',
        expiry_date: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/${teamSlug}/products`);
    }

    return (
        <>
            <Head title="Add Product" />
            <div className="flex max-w-2xl flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                        Add Product
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Add a new product to your pharmacy catalog.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="category_id"
                            className="text-text-primary"
                        >
                            Category <span className="text-danger-fg">*</span>
                        </Label>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) =>
                                setData('category_id', String(e.target.value))
                            }
                            className="w-full rounded-md border border-border-soft bg-white px-3 py-2 text-sm text-text-primary focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
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
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Amoxicillin 500mg"
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
                            placeholder="e.g. AMX-500"
                            className="border-border-soft"
                        />
                        <InputError message={errors.sku} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="description"
                            className="text-text-primary"
                        >
                            Description{' '}
                            <span className="text-xs font-normal text-text-secondary">
                                (optional)
                            </span>
                        </Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Short description..."
                            rows={3}
                            className="w-full rounded-md border border-border-soft bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
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
                                placeholder="0.00"
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
                                placeholder="0.00"
                                className="border-border-soft"
                            />
                            <InputError message={errors.selling_price} />
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="grid grid-cols-2 gap-4">
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
                                placeholder="0"
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
                                placeholder="10"
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
                            {processing ? 'Saving...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ProductCreate.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Products',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/products`
                : '/',
        },
        {
            title: 'Add Product',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/products/create`
                : '/',
        },
    ],
});
