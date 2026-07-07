import { Head, usePage, router } from '@inertiajs/react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductAvatar from '@/components/ProductAvatar';
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
    SheetTrigger,
} from '@/components/ui/sheet';
import type { Customer, Product } from '@/types';

type CartItem = {
    product: Product;
    quantity: number;
};

export default function PosIndex() {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discount, setDiscount] = useState('0');
    const [tax, setTax] = useState('0');
    const [mobileCartOpen, setMobileCartOpen] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Fetch initial customers (they don't change often)
    useEffect(() => {
        if (!teamSlug) return;
        fetch(`/${teamSlug}/api/customers/search`)
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error("Failed to fetch customers", err));
    }, [teamSlug]);

    // Fetch products based on search (debounced)
    useEffect(() => {
        if (!teamSlug) return;
        
        setIsLoadingProducts(true);
        const timer = setTimeout(() => {
            fetch(`/${teamSlug}/api/products/search?q=${encodeURIComponent(search)}`)
                .then(res => res.json())
                .then(data => {
                    setProducts(data);
                    setIsLoadingProducts(false);
                })
                .catch(err => {
                    console.error("Failed to fetch products", err);
                    setIsLoadingProducts(false);
                });
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [search, teamSlug]);

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
        if (cart.length === 0) {
            return;
        }

        router.post(`/${teamSlug}/transactions`, {
            customer_id: customerId || null,
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
                setMobileCartOpen(false);
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:overflow-y-auto pb-24 lg:pb-4 pr-1 lg:pr-3">
                        {isLoadingProducts ? (
                            <p className="col-span-2 text-center text-sm text-text-secondary py-8">
                                Loading products...
                            </p>
                        ) : (
                            <>
                                {products.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="flex flex-row items-center gap-3 rounded-lg border border-border-soft bg-surface p-3 text-left hover:border-brand hover:shadow-sm transition-all"
                                    >
                                        <ProductAvatar src={product.image_url} alt={product.name} className="h-12 w-12 shrink-0" />
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
                                {products.length === 0 && (
                                    <p className="col-span-2 text-center text-sm text-text-secondary py-8">
                                        No products found.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Cart */}
                <div className="hidden lg:flex w-80 flex-col gap-4 border-l border-border-soft bg-surface p-5 lg:overflow-y-auto">
                    {renderCart()}
                </div>
            </div>

            {/* Mobile Cart Trigger & Sheet */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border-soft flex items-center justify-between z-40">
                <div className="flex flex-col">
                    <span className="font-semibold text-text-primary text-sm">{cart.length} Item(s)</span>
                    <span className="font-bold text-brand text-lg">${total.toFixed(2)}</span>
                </div>
                <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
                    <SheetTrigger asChild>
                        <Button className="bg-brand text-white shadow-sm">View Cart</Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">
                        {renderCart(true)}
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );

    function renderCart(isMobile = false) {
        return (
            <div className={`flex flex-col h-full gap-4 ${isMobile ? 'p-6 overflow-y-auto' : ''}`}>
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
                            <ProductAvatar src={item.product.image_url} alt={item.product.name} className="h-8 w-8 shrink-0" />
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
                <div className="flex flex-col gap-4 border-t border-border-soft pt-3">
                    <div className="flex flex-col gap-2">
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
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs text-text-secondary">Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {['cash', 'zaad', 'evc', 'jeeb', 'card'].map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setPaymentMethod(method)}
                                    className={`py-2 px-1 text-xs font-medium rounded-md border transition-all ${
                                        paymentMethod === method
                                            ? 'bg-brand/10 border-brand text-brand'
                                            : 'bg-surface border-border-soft text-text-secondary hover:border-brand/50'
                                    }`}
                                >
                                    {method.charAt(0).toUpperCase() + method.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={isMobile ? 'pt-4 pb-8' : 'pt-2'}>
                    <Button
                        onClick={handleSubmit}
                        disabled={cart.length === 0}
                        className="w-full bg-brand hover:bg-brand-dark transition-all duration-200 shadow-sm py-5 text-sm"
                    >
                        Complete Sale • ${total.toFixed(2)}
                    </Button>
                </div>
            </div>
        );
    }
}

PosIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'POS',
            href: props.currentTeam ? `/${props.currentTeam.slug}/pos` : '/',
        },
    ],
});