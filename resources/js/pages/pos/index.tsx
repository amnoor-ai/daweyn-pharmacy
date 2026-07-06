import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
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
import type { Customer, Product } from '@/types';

type Props = {
    products: Product[];
    customers: Customer[];
};

type CartItem = {
    product: Product;
    quantity: number;
};

export default function PosIndex({ products, customers }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState('0');
    const [tax, setTax] = useState('0');

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    function addToCart(product: Product) {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
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
        setCart(prev =>
            prev.map(i =>
                i.product.id === productId ? { ...i, quantity } : i
            )
        );
    }

    function removeFromCart(productId: number) {
        setCart(prev => prev.filter(i => i.product.id !== productId));
    }

    const subtotal = cart.reduce((sum, i) => sum + i.product.selling_price * i.quantity, 0);
    const taxAmount = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const total = subtotal + taxAmount - discountAmount;

    function handleSubmit() {
        if (cart.length === 0) return;

        router.post(`/${teamSlug}/transactions`, {
            customer_id: customerId,
            payment_method: paymentMethod,
            discount: discount,
            tax: tax,
            items: cart.map(i => ({
                product_id: i.product.id,
                quantity: i.quantity,
            })),
        }, {
            onSuccess: () => {
                setCart([]);
                setCustomerId('');
                setPaymentMethod('cash');
                setDiscount('0');
                setTax('0');
                setSearch('');
            }
        });
    }

    return (
        <>
            <Head title="POS" />
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] gap-0">

                {/* LEFT — Product search */}
                <div className="flex flex-1 flex-col gap-4 lg:overflow-hidden p-4 sm:p-6">
                    <Input
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border-border-soft"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:overflow-y-auto pb-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="flex flex-row items-center gap-3 rounded-lg border border-border-soft bg-surface p-3 text-left hover:border-brand hover:shadow-sm transition-all"
                            >
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-12 w-12 rounded-md object-cover border border-border-soft shrink-0"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-md bg-canvas border border-border-soft flex items-center justify-center shrink-0">
                                        <span className="text-[10px] text-text-secondary">No img</span>
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="font-medium text-text-primary text-sm truncate">{product.name}</span>
                                    <span className="text-xs text-text-secondary truncate">{product.sku}</span>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-brand">${Number(product.selling_price).toFixed(2)}</span>
                                        <span className="text-xs text-text-secondary">Stock: {product.stock_quantity}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {filteredProducts.length === 0 && (
                            <p className="col-span-2 text-center text-sm text-text-secondary py-8">
                                No products found.
                            </p>
                        )}
                    </div>
                </div>

                {/* RIGHT — Cart */}
                <div className="flex w-full lg:w-80 flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border-soft bg-surface p-4 sm:p-5 lg:overflow-y-auto">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-brand" />
                        <h2 className="text-lg font-semibold text-text-primary">Cart</h2>
                        {cart.length > 0 && (
                            <span className="ml-auto text-xs text-text-secondary">{cart.length} item(s)</span>
                        )}
                    </div>

                    {/* Cart items */}
                    <div className="flex flex-col gap-2 flex-1">
                        {cart.length === 0 && (
                            <p className="text-center text-sm text-text-secondary py-8">
                                No items added yet.
                            </p>
                        )}
                        {cart.map(item => (
                            <div key={item.product.id} className="flex items-center gap-2 rounded-lg border border-border-soft p-2">
                                {item.product.image_url ? (
                                    <img
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        className="h-8 w-8 rounded object-cover shrink-0 border border-border-soft"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded bg-canvas border border-border-soft flex items-center justify-center shrink-0">
                                        <span className="text-[8px] text-text-secondary">No img</span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-text-primary truncate">{item.product.name}</p>
                                    <p className="text-xs text-text-secondary">${Number(item.product.selling_price).toFixed(2)} each</p>
                                </div>
                                <Input
                                    type="number"
                                    min="1"
                                    max={item.product.stock_quantity}
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item.product.id, parseInt(e.target.value))}
                                    className="w-16 border-border-soft text-center text-xs"
                                />
                                <button
                                    onClick={() => removeFromCart(item.product.id)}
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
                                value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                className="w-20 border-border-soft text-right text-xs"
                            />
                        </div>
                        <div className="flex items-center justify-between text-text-secondary">
                            <span>Tax</span>
                            <Input
                                type="number"
                                min="0"
                                value={tax}
                                onChange={e => setTax(e.target.value)}
                                className="w-20 border-border-soft text-right text-xs"
                            />
                        </div>
                        <div className="flex justify-between font-semibold text-text-primary border-t border-border-soft pt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Customer & Payment */}
                    <div className="flex flex-col gap-3 border-t border-border-soft pt-3">
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-text-secondary">Customer (optional)</Label>
                            <Select
                                value={customerId}
                                onValueChange={setCustomerId}
                            >
                                <SelectTrigger size="sm" className="w-full text-xs">
                                    <SelectValue placeholder="Walk-in customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Walk-in customer</SelectItem>
                                    {customers.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="text-xs text-text-secondary">Payment Method</Label>
                            <Select
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            >
                                <SelectTrigger size="sm" className="w-full text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="zaad">Zaad</SelectItem>
                                    <SelectItem value="evc">EVC</SelectItem>
                                    <SelectItem value="jeeb">Jeeb</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={cart.length === 0}
                        className="w-full bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
                    >
                        Complete Sale • ${total.toFixed(2)}
                    </Button>
                </div>
            </div>
        </>
    );
}

PosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'POS',
            href: props.currentTeam ? `/${props.currentTeam.slug}/pos` : '/',
        },
    ],
});