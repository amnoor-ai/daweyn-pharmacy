import type { Category } from './categories';

export type Product = {
    id: number;
    team_id: number;
    category_id: number;
    category?: Category;
    sku: string;
    image_path: string | null;
    image_url: string;
    name: string;
    description: string | null;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    alert_threshold: number;
    expiry_date: string | null;
    stock_status?: 'expired' | 'expiring_soon' | 'valid';
    created_at: string | null;
};
