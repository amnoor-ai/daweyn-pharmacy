import { Head } from "@inertiajs/react";
import { Category, Product } from "@/types";


type Props = {
    categories: Category[];
    products: Product[];
};

export default function ProductIndex ({categories, products}: Props) {
    return (
        <>
            <Head title="Products" />
            <div className="flex flex-col gap-6 p-6">
                <p>Products Page</p>
            </div>
            </>
    );
}