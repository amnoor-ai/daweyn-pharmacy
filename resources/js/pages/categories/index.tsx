import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CategoryDialog from '@/components/CategoryDialog';
import CategoryTable from '@/components/CategoryTable';
import type { Category } from '@/types';

type Props = {
    categories: Category[];
};

export default function CategoriesIndex({ categories }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';

    // null = dialog closed, undefined = create mode, Category = edit mode
    const [editingCategory, setEditingCategory] = useState<
        Category | undefined
    >(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);

    function openCreate() {
        setEditingCategory(undefined);
        setDialogOpen(true);
    }

    function openEdit(category: Category) {
        setEditingCategory(category);
        setDialogOpen(true);
    }

    function handleDialogChange(open: boolean) {
        setDialogOpen(open);

        if (!open) {
            setEditingCategory(undefined);
        }
    }

    return (
        <>
            <Head title="Categories" />

            <div className="flex flex-col gap-6">
                {/* Table */}
                <CategoryTable
                    categories={categories}
                    teamSlug={teamSlug}
                    onEdit={openEdit}
                    onAdd={openCreate}
                />
            </div>

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={handleDialogChange}
                teamSlug={teamSlug}
                category={editingCategory}
            />
        </>
    );
}

CategoriesIndex.layout = (props: {
    currentTeam?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: 'Categories',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/categories`
                : '/',
        },
    ],
});
