import { Badge } from '@/components/ui/badge';

type Props = {
    quantity: number;
    threshold: number;
};

export default function StockAlertBadge({ quantity, threshold }: Props) {
    if (quantity === 0) {
        return (
            <Badge variant="secondary" className="rounded-full bg-destructive/10 text-destructive hover:bg-destructive/10/80 border-transparent shadow-none">
                Out of Stock
            </Badge>
        );
    }

    if (quantity <= threshold) {
        return (
            <Badge variant="secondary" className="rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/10/80 border-transparent shadow-none">
                Low Stock
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10/80 border-transparent shadow-none">
            In Stock
        </Badge>
    );
}
