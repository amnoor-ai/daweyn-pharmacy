import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Category } from '@/types';


type Props = {
    categories: Category[];
    teamSlug: string;
    onEdit: (category: Category) => void;
    viewMode?: 'grid' | 'table';
};

export default function CategoryTable({ categories, teamSlug, onEdit, viewMode = 'grid' }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category, direction: 'asc' | 'desc' } | null>(null);

    const sortedCategories = useMemo(() => {
        let sortableItems = [...categories];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                
                if (valA === null) return 1;
                if (valB === null) return -1;
                
                if (valA! < valB!) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valA! > valB!) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [categories, sortConfig]);

    const requestSort = (key: keyof Category) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof Category }) => {
        if (sortConfig?.key !== columnKey) {
            return <ArrowUpDown className="ml-2 h-4 w-4 inline-block text-text-muted" />;
        }
        return sortConfig.direction === 'asc' ? 
            <ArrowUp className="ml-2 h-4 w-4 inline-block text-brand" /> : 
            <ArrowDown className="ml-2 h-4 w-4 inline-block text-brand" />;
    };

    function confirmDelete() {
        if (!deleteTarget) {
return;
}

        router.delete(`/${teamSlug}/categories/${deleteTarget.id}`, {
            preserveScroll: true,
        });
        setDeleteTarget(null);
    }

    if (categories.length === 0) {
        return (
            <div className="rounded-lg border border-border-soft bg-surface">
                <p className="p-8 text-center text-sm text-text-secondary">
                    No categories yet. Click &quot;Add Category&quot; to create
                    one.
                </p>
            </div>
        );
    }

    return (
        <>
            <DeleteConfirmDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                itemName={deleteTarget?.name ?? ''}
                onConfirm={confirmDelete}
            />

            {viewMode === 'table' ? (
                <div className="rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)] overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="border-b border-divider hover:bg-transparent">
                                <TableHead 
                                    className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase cursor-pointer select-none"
                                    onClick={() => requestSort('name')}
                                >
                                    Category Name <SortIcon columnKey="name" />
                                </TableHead>
                                <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase">Slug / URL</TableHead>
                                <TableHead className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase">Description</TableHead>
                                <TableHead 
                                    className="px-4 py-3.5 text-left text-sm font-medium text-text-secondary uppercase cursor-pointer select-none"
                                    onClick={() => requestSort('total_products')}
                                >
                                    Total Products <SortIcon columnKey="total_products" />
                                </TableHead>
                                <TableHead className="px-4 py-3.5 text-right text-sm font-medium text-text-secondary uppercase">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedCategories.map((category) => (
                                <TableRow key={category.id} className="border-b border-divider hover:bg-primary-50 transition-colors">
                                    <TableCell className="px-4 py-4 font-medium text-sm text-text-primary">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-sm font-mono text-text-muted">
                                        /{category.slug}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-sm text-text-secondary">
                                        <div className="line-clamp-1 max-w-[300px]">
                                            {category.description ?? (
                                                <span className="text-text-muted/60 italic">No description</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-sm text-text-primary">
                                        {category.total_products ?? 0} items
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(category)}
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-brand hover:bg-brand/10"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteTarget(category)}
                                                className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg hover:bg-danger/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedCategories.map((category) => (
                        <div
                            key={category.id}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-soft bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-text-primary text-base line-clamp-1">
                                        {category.name}
                                    </h3>
                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(category)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-brand hover:bg-brand/10"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit {category.name}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteTarget(category)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg hover:bg-danger/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete {category.name}</span>
                                        </Button>
                                    </div>
                                </div>
                                
                                <span className="font-mono text-xs text-text-muted truncate">
                                    /{category.slug}
                                </span>
                                
                                <p className="text-sm text-text-secondary mt-3 line-clamp-2 min-h-[2.5rem]">
                                    {category.description ?? (
                                        <span className="text-text-muted/60 italic">No description provided.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
