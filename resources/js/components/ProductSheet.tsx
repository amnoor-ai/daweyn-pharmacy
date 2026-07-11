import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { Category, Product } from '@/types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamSlug: string;
    categories: Category[];
    product?: Product;
};

export default function ProductSheet({ open, onOpenChange, teamSlug, categories, product }: Props) {
    const isEditing = product !== undefined;

    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
        category_id: '',
        sku: '',
        name: '',
        description: '',
        cost_price: '',
        selling_price: '',
        stock_quantity: '',
        alert_threshold: '10',
        expiry_date: '',
        image: null as File | null,
    });

    useEffect(() => {
        if (open) {
            reset();
            clearErrors();
            setData({
                category_id: product?.category_id ? String(product.category_id) : '',
                sku: product?.sku ?? '',
                name: product?.name ?? '',
                description: product?.description ?? '',
                cost_price: product?.cost_price ? String(product.cost_price) : '',
                selling_price: product?.selling_price ? String(product.selling_price) : '',
                stock_quantity: product?.stock_quantity ? String(product.stock_quantity) : '',
                alert_threshold: product?.alert_threshold ? String(product.alert_threshold) : '10',
                expiry_date: product?.expiry_date ?? '',
                image: null,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, product?.id]);

    transform((data) => {
        if (isEditing) {
            return {
                ...data,
                _method: 'put',
            };
        }

        return data;
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        };

        if (isEditing) {
            post(`/${teamSlug}/products/${product.id}`, options);
        } else {
            post(`/${teamSlug}/products`, options);
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>{isEditing ? 'Edit Product' : 'Add Product'}</SheetTitle>
                    <SheetDescription>
                        {isEditing ? 'Update product details.' : 'Add a new product to your catalog.'}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="category_id" className="text-foreground">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(val) => setData('category_id', val)}
                        >
                            <SelectTrigger id="category_id" className="w-full border-border">
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
                        <Label htmlFor="image" className="text-foreground">
                            Product Image <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                        </Label>
                        <div className="flex items-center gap-4">
                            {isEditing && product?.image_url && (
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    className="h-12 w-12 rounded-md object-cover border border-border"
                                />
                            )}
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                className="border-border flex-1"
                            />
                        </div>
                        <InputError message={errors.image as string} />
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name" className="text-foreground">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Amoxicillin 500mg"
                            className="border-border"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* SKU */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sku" className="text-foreground">
                            SKU <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="sku"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                            placeholder="e.g. AMX-500"
                            className="border-border"
                        />
                        <InputError message={errors.sku} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="description" className="text-foreground">
                            Description <span className="text-xs font-normal">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Short description..."
                            rows={3}
                            className="border-border"
                        />
                        <InputError message={errors.description} />
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="cost_price" className="text-foreground">
                                Cost Price <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="cost_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.cost_price}
                                onChange={(e) => setData('cost_price', e.target.value)}
                                placeholder="0.00"
                                className="border-border"
                            />
                            <InputError message={errors.cost_price} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="selling_price" className="text-foreground">
                                Selling Price <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="selling_price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.selling_price}
                                onChange={(e) => setData('selling_price', e.target.value)}
                                placeholder="0.00"
                                className="border-border"
                            />
                            <InputError message={errors.selling_price} />
                        </div>
                    </div>

                    {/* Calculations Display */}
                    {(parseFloat(data.cost_price) > 0 || parseFloat(data.selling_price) > 0) && (
                        <div className="flex gap-4 p-3 rounded-lg bg-card-muted border border-border text-sm">
                            <div className="flex-1">
                                <span className="text-muted-foreground">Profit:</span>{' '}
                                <span className={parseFloat(data.selling_price || '0') - parseFloat(data.cost_price || '0') > 0 ? 'text-emerald-500 font-medium' : 'text-destructive font-medium'}>
                                    ${(parseFloat(data.selling_price || '0') - parseFloat(data.cost_price || '0')).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="text-muted-foreground">Margin:</span>{' '}
                                <span className="font-medium text-foreground">
                                    {parseFloat(data.selling_price || '0') > 0 
                                        ? (((parseFloat(data.selling_price || '0') - parseFloat(data.cost_price || '0')) / parseFloat(data.selling_price || '0')) * 100).toFixed(1) 
                                        : '0.0'}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="stock_quantity" className="text-foreground">
                                Stock Quantity <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="stock_quantity"
                                type="number"
                                min="0"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', e.target.value)}
                                placeholder="0"
                                className="border-border"
                            />
                            <InputError message={errors.stock_quantity} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="alert_threshold" className="text-foreground">
                                Alert Threshold <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="alert_threshold"
                                type="number"
                                min="0"
                                value={data.alert_threshold}
                                onChange={(e) => setData('alert_threshold', e.target.value)}
                                placeholder="10"
                                className="border-border"
                            />
                            <InputError message={errors.alert_threshold} />
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="expiry_date" className="text-foreground">
                            Expiry Date <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                        </Label>
                        <Input
                            id="expiry_date"
                            type="date"
                            value={data.expiry_date}
                            onChange={(e) => setData('expiry_date', e.target.value)}
                            className="border-border"
                        />
                        <InputError message={errors.expiry_date} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 pb-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="border-border flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex-1"
                        >
                            {processing ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Product')}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
