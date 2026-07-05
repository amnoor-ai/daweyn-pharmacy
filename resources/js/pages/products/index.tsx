import { Head, usePage } from '@inertiajs/react';
import ProductTable from '@/components/ProductTable';
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
            <ProductTable
                products={products}
                teamSlug={teamSlug}
                onEdit={handleEdit}
                createUrl={`/${teamSlug}/products/create`}
            />
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
