import { Head, usePage } from '@inertiajs/react';
import { Plus, Search, Filter, LayoutGrid, List, Download } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import CategoryDialog from '@/components/CategoryDialog';
import CategoryTable from '@/components/CategoryTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTableSearch } from '@/hooks/use-table-search';
import type { Category } from '@/types';

type Props = {
    categories: Category[];
};

export default function CategoriesIndex({ categories }: Props) {
    const { currentTeam } = usePage().props;
    const teamSlug = currentTeam?.slug ?? '';
    const { query, handleSearch } = useTableSearch();

    const [editingCategory, setEditingCategory] = useState<
        Category | undefined
    >(undefined);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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

            <div className="flex flex-col gap-4">
                {/* Page Header */}
                <div className="flex items-center justify-between mt-2">
                    <Heading 
                        title="Categories" 
                        description="Manage your product categories and organization." 
                        variant="default"
                    />
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search categories…"
                            className="h-9 pl-9 text-sm"
                        />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Toolbar Actions */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex text-text-secondary h-9 border-border-soft bg-surface">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-text-secondary h-9 border-border-soft bg-surface"
                            onClick={() => setViewMode(v => v === 'grid' ? 'table' : 'grid')}
                        >
                            {viewMode === 'grid' ? (
                                <><List className="mr-2 h-4 w-4" /> Table View</>
                            ) : (
                                <><LayoutGrid className="mr-2 h-4 w-4" /> Grid View</>
                            )}
                        </Button>
                        <Button variant="outline" size="sm" className="hidden sm:flex text-text-secondary h-9 border-border-soft bg-surface">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>

                    {/* Primary action */}
                    <Button
                        onClick={openCreate}
                        className="gap-2 bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
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
                    viewMode={viewMode}
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
