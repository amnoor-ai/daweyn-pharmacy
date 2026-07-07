import { Badge } from '@/components/ui/badge';

type Props = {
    quantity: number;
    threshold: number;
};

export default function StockAlertBadge({ quantity, threshold }: Props) {
    if (quantity === 0) {
        return (
            <Badge variant="secondary" className="rounded-full bg-danger-bg text-danger-fg hover:bg-danger-bg/80 border-transparent shadow-none">
                Out of Stock
            </Badge>
        );
    }

    if (quantity <= threshold) {
        return (
            <Badge variant="secondary" className="rounded-full bg-warning-bg text-warning-fg hover:bg-warning-bg/80 border-transparent shadow-none">
                Low Stock
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="rounded-full bg-success-bg text-success-fg hover:bg-success-bg/80 border-transparent shadow-none">
            In Stock
        </Badge>
    );
}
