import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CategoryDialog from '@/components/CategoryDialog';
import CategoryTable from '@/components/CategoryTable';
import { Button } from '@/components/ui/button';
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

            <div className="flex flex-col gap-6 p-6">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#161A30]">
                            Categories
                        </h1>
                        <p className="mt-1 text-sm text-[#8A8FA6]">
                            Manage your pharmacy product categories.
                        </p>
                    </div>

                    <Button
                        onClick={openCreate}
                        className="gap-2 bg-[#1B2559] hover:bg-[#141C45]"
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                {/* Table */}
                <CategoryTable
                    categories={categories}
                    teamSlug={teamSlug}
                    onEdit={openEdit}
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
