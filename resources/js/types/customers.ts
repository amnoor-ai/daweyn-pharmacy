export type Customer = {
    id: number;
    team_id: number;
    name: string;
    email: string | null;
    phone: string;
    address: string | null;
    loyalty_points: number;
    created_at: string | null;
};