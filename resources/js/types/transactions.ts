import type { Customer } from './customers';
import type { Product } from './products';

export type PaymentMethod = 'cash' | 'zaad' | 'evc' | 'jeeb' | 'card';

export type TransactionItem = {
    id: number;
    transaction_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    total: number;
    product?: Product;
};

export type Transaction = {
    id: number;
    team_id: number;
    customer_id: number | null;
    cashier_id: number;
    invoice_number: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: PaymentMethod;
    created_at: string | null;
    customer?: Customer;
    cashier?: { id: number; name: string };
    items?: TransactionItem[];
};
