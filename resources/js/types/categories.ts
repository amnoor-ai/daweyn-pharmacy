export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    total_products?: number;
    created_at: string | null;
};
