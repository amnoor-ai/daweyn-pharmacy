type Props = {
    quantity: number;
    threshold: number;
};

export default function StockAlertBadge({ quantity, threshold }: Props) {
    if (quantity === 0) {
        return (
            <span className="inline-flex items-center rounded-full bg-[#FCE8E8] px-2.5 py-0.5 text-xs font-medium text-[#E5484D]">
                Out of Stock
            </span>
        );
    }

    if (quantity <= threshold) {
        return (
            <span className="inline-flex items-center rounded-full bg-[#FEF6DA] px-2.5 py-0.5 text-xs font-medium text-[#C68A0A]">
                Low Stock
            </span>
        );
    }

    return (
        <span className="inline-flex items-center rounded-full bg-[#E1F7F0] px-2.5 py-0.5 text-xs font-medium text-[#1FAE8E]">
            In Stock
        </span>
    );
}