import { Head, usePage } from '@inertiajs/react';
import { Plus, Search, Filter, LayoutGrid, List, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import CategoryDialog from '@/components/CategoryDialog';
import CategoryTable from '@/components/CategoryTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('categories_view_mode');
            if (saved === 'grid' || saved === 'table') return saved;
        }
        return 'grid';
    });

    useEffect(() => {
        localStorage.setItem('categories_view_mode', viewMode);
    }, [viewMode]);

    const [sortMode, setSortMode] = useState<'name-asc' | 'name-desc' | 'count-asc' | 'count-desc'>('name-asc');

    // Sort categories based on sortMode
    const sortedCategories = [...categories].sort((a, b) => {
        switch (sortMode) {
            case 'name-asc': return a.name.localeCompare(b.name);
            case 'name-desc': return b.name.localeCompare(a.name);
            case 'count-asc': return (a.total_products ?? 0) - (b.total_products ?? 0);
            case 'count-desc': return (b.total_products ?? 0) - (a.total_products ?? 0);
            default: return 0;
        }
    });

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
                <div className="flex items-center justify-between gap-4">
                    <Heading 
                        title="Categories" 
                        description="Manage your product categories and organization." 
                        variant="default"
                    />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-1">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search categories…"
                            className="h-9 pl-9 text-sm shadow-sm"
                        />
                    </div>

                    {/* Toolbar Actions */}
                    <div className="flex items-center gap-2">
                    {/* Filter dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="text-muted-foreground h-9 border-border bg-card">
                                <Filter className="mr-2 h-4 w-4" /> Filter <ChevronDown className="ml-1 h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSortMode('name-asc')} className={sortMode === 'name-asc' ? 'text-primary font-medium' : ''}>Name A → Z</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortMode('name-desc')} className={sortMode === 'name-desc' ? 'text-primary font-medium' : ''}>Name Z → A</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSortMode('count-desc')} className={sortMode === 'count-desc' ? 'text-primary font-medium' : ''}>Most Products</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortMode('count-asc')} className={sortMode === 'count-asc' ? 'text-primary font-medium' : ''}>Fewest Products</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                        <div className="flex bg-card border border-border rounded-lg overflow-hidden h-9">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`rounded-none h-full px-3 ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                                onClick={() => setViewMode('table')}
                                title="Table View"
                            >
                                <List className="h-4 w-4 mr-1.5" /> Table
                            </Button>
                            <div className="w-[1px] bg-border-soft h-full" />
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`rounded-none h-full px-3 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                <LayoutGrid className="h-4 w-4 mr-1.5" /> Grid
                            </Button>
                        </div>

                    {/* Primary action — inline with toolbar */}
                    <Button onClick={openCreate} className="gap-2 h-9" size="sm">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                    </div>
                </div>

                {/* Table */}
                <CategoryTable
                    categories={sortedCategories}
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


CategoriesIndex.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Categories',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/categories`
                : '/',
        },
    ],
});

