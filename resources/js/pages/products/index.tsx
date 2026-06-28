import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import ProductTable from '@/components/ProductTable';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types';

type Props = {
    products: Product[];
};

export default function ProductsIndex({ products }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    function handleEdit(product: Product) {
        window.location.href = `/${teamSlug}/products/${product.id}/edit`;
    }

    return (
        <>
            <Head title="Products" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-y-3">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                            Products
                        </h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            Manage your pharmacy product catalog.
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            (window.location.href = `/${teamSlug}/products/create`)
                        }
                        className="gap-2 bg-brand hover:bg-brand-dark"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </div>

                {/* Table */}
                <ProductTable
                    products={products}
                    teamSlug={teamSlug}
                    onEdit={handleEdit}
                />
            </div>
        </>
    );
}

ProductsIndex.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Products',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/products`
                : '/',
        },
    ],
});
