import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Customer, Product } from '@/types';

type Props = {
    products: Product[];
    customers: Customer[];
};

type CartItem = {
    product: Product;
    quantity: number;
};

type FormData = {
    customer_id: string;
    payment_method: string;
    discount: string;
    tax: string;
    items: { product_id: number; quantity: number }[];
};

export default function TransactionCreate({ products, customers }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');

    const { data, setData, processing, errors } = useForm<FormData>({
        customer_id: '',
        payment_method: 'cash',
        discount: '0',
        tax: '0',
        items: [],
    });

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase()),
    );

    function addToCart(product: Product) {
        setCart((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);

            if (existing) {
                return prev.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                );
            }

            return [...prev, { product, quantity: 1 }];
        });
    }

    function updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            removeFromCart(productId);

            return;
        }

        setCart((prev) =>
            prev.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i,
            ),
        );
    }

    function removeFromCart(productId: number) {
        setCart((prev) => prev.filter((i) => i.product.id !== productId));
    }

    const subtotal = cart.reduce(
        (sum, i) => sum + i.product.selling_price * i.quantity,
        0,
    );
    const tax = parseFloat(data.tax) || 0;
    const discount = parseFloat(data.discount) || 0;
    const total = subtotal + tax - discount;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const items = cart.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
        }));

        router.post(`/${teamSlug}/transactions`, {
            customer_id: data.customer_id,
            payment_method: data.payment_method,
            discount: data.discount,
            tax: data.tax,
            items,
        });
    }

    return (
        <>
            <Head title="New Sale" />
            <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
                {/* Left — Product search */}
                <div className="flex flex-1 flex-col gap-4">
                    <h2 className="text-lg font-semibold text-text-primary">
                        Products
                    </h2>
                    <Input
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-border-soft"
                    />
                    <div className="grid grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="flex flex-col gap-1 rounded-xl border border-border-soft bg-surface p-4 text-left transition-all hover:border-brand hover:shadow-sm"
                            >
                                <span className="text-sm font-medium text-text-primary">
                                    {product.name}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {product.sku}
                                </span>
                                <span className="mt-1 text-sm font-semibold text-brand">
                                    ${Number(product.selling_price).toFixed(2)}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    Stock: {product.stock_quantity}
                                </span>
                            </button>
                        ))}
                        {filteredProducts.length === 0 && (
                            <p className="col-span-2 py-8 text-center text-sm text-text-secondary">
                                No products found.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right — Cart */}
                <div className="flex w-full flex-col gap-4 rounded-xl border border-border-soft bg-surface p-5 lg:w-80">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-brand" />
                        <h2 className="text-lg font-semibold text-text-primary">
                            Cart
                        </h2>
                    </div>

                    {/* Cart items */}
                    <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
                        {cart.length === 0 && (
                            <p className="py-8 text-center text-sm text-text-secondary">
                                No items added yet.
                            </p>
                        )}
                        {cart.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex items-center gap-2 rounded-lg border border-border-soft p-2"
                            >
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-text-primary">
                                        {item.product.name}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        $
                                        {Number(
                                            item.product.selling_price,
                                        ).toFixed(2)}{' '}
                                        each
                                    </p>
                                </div>
                                <Input
                                    type="number"
                                    min="1"
                                    max={item.product.stock_quantity}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateQuantity(
                                            item.product.id,
                                            parseInt(e.target.value),
                                        )
                                    }
                                    className="w-16 border-border-soft text-center text-xs"
                                />
                                <button
                                    onClick={() =>
                                        removeFromCart(item.product.id)
                                    }
                                    className="text-text-secondary hover:text-danger-fg"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="flex flex-col gap-2 border-t border-border-soft pt-3 text-sm">
                        <div className="flex justify-between text-text-secondary">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-text-secondary">
                            <span>Discount</span>
                            <Input
                                type="number"
                                min="0"
                                value={data.discount}
                                onChange={(e) =>
                                    setData('discount', e.target.value)
                                }
                                className="w-20 border-border-soft text-right text-xs"
                            />
                        </div>
                        <div className="flex items-center justify-between text-text-secondary">
                            <span>Tax</span>
                            <Input
                                type="number"
                                min="0"
                                value={data.tax}
                                onChange={(e) => setData('tax', e.target.value)}
                                className="w-20 border-border-soft text-right text-xs"
                            />
                        </div>
                        <div className="flex justify-between font-semibold text-text-primary">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Customer & Payment */}
                    <div className="flex flex-col gap-3 border-t border-border-soft pt-3">
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-text-secondary">
                                Customer (optional)
                            </Label>
                            <select
                                value={data.customer_id}
                                onChange={(e) =>
                                    setData('customer_id', e.target.value)
                                }
                                className="w-full rounded-md border border-border-soft bg-white px-3 py-2 text-xs text-text-primary focus:border-brand focus:outline-none"
                            >
                                <option value="">Walk-in customer</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-text-secondary">
                                Payment Method
                            </Label>
                            <select
                                value={data.payment_method}
                                onChange={(e) =>
                                    setData('payment_method', e.target.value)
                                }
                                className="w-full rounded-md border border-border-soft bg-white px-3 py-2 text-xs text-text-primary focus:border-brand focus:outline-none"
                            >
                                <option value="cash">Cash</option>
                                <option value="zaad">Zaad</option>
                                <option value="evc">EVC</option>
                                <option value="jeeb">Jeeb</option>
                                <option value="card">Card</option>
                            </select>
                        </div>
                        <InputError message={errors.items} />
                    </div>

                    {/* Submit */}
                    <Button
                        onClick={handleSubmit}
                        disabled={processing || cart.length === 0}
                        className="w-full bg-brand hover:bg-brand-dark"
                    >
                        {processing
                            ? 'Processing...'
                            : `Complete Sale • $${total.toFixed(2)}`}
                    </Button>
                </div>
            </div>
        </>
    );
}

TransactionCreate.layout = (props: {
    currentTeam?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: 'Transactions',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/transactions`
                : '/',
        },
        {
            title: 'New Sale',
            href: '/',
        },
    ],
});
