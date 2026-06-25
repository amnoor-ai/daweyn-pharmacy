type Props = {
    quantity: number;
    threshold: number;
};

export default function StockAlertBadge({ quantity, threshold }: Props) {
    if (quantity === 0) {
        return (
            <span className="inline-flex items-center rounded-full bg-danger-bg px-2.5 py-0.5 text-xs font-medium text-danger-fg">
                Out of Stock
            </span>
        );
    }

    if (quantity <= threshold) {
        return (
            <span className="inline-flex items-center rounded-full bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning-fg">
                Low Stock
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-fg">
            In Stock
        </span>
    );
}