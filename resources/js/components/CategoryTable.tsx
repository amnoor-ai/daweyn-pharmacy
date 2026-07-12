import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import TablePagination from '@/components/TablePagination';
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortConfig, setSortConfig] = useState<{ key: keyof Category, direction: 'asc' | 'desc' } | null>(null);

    const sortedCategories = useMemo(() => {
        const sortableItems = [...categories];

        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                
                if (aValue === null || aValue === undefined) {
                    return 1;
                }

                if (bValue === null || bValue === undefined) {
                    return -1;
                }
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }

                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }

                return 0;
            });
        }

        return sortableItems;
    }, [categories, sortConfig]);

    const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
    const paginatedCategories = useMemo(() => {
        return sortedCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [sortedCategories, currentPage]);

    const requestSort = (key: keyof Category) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof Category }) => {
        if (sortConfig?.key !== columnKey) {
            return <ChevronsUpDown className="ml-2 h-4 w-4 inline-block text-gray-400" />;
        }

        return sortConfig.direction === 'asc' ? 
            <ArrowUp className="ml-2 h-4 w-4 inline-block text-primary" /> : 
            <ArrowDown className="ml-2 h-4 w-4 inline-block text-primary" />;
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
            <div className="rounded-lg border border-border bg-card">
                <p className="p-8 text-center text-sm text-muted-foreground">
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
                <div className="rounded-lg border border-border bg-card shadow-[0_2px_10px_rgba(20,28,64,0.05)] overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead 
                                    className="cursor-pointer select-none"
                                    onClick={() => requestSort('name')}
                                >
                                    Category Name <SortIcon columnKey="name" />
                                </TableHead>
                                <TableHead>Slug / URL</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead 
                                    className="cursor-pointer select-none"
                                    onClick={() => requestSort('total_products')}
                                >
                                    Total Products <SortIcon columnKey="total_products" />
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="px-4 py-4 font-medium text-sm text-foreground">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-sm font-mono text-muted-foreground">
                                        /{category.slug}
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                                        <div className="line-clamp-1 max-w-[300px]">
                                            {category.description ?? (
                                                <span className="text-muted-foreground/60 italic">No description</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-sm text-foreground">
                                        {category.total_products ?? 0} items
                                    </TableCell>
                                    <TableCell className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(category)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteTarget(category)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-danger/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedCategories.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedCategories.map((category) => (
                            <div
                                key={category.id}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-foreground text-base line-clamp-1">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(category)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">Edit {category.name}</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteTarget(category)}
                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-danger/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete {category.name}</span>
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
                                        {category.description ?? (
                                            <span className="text-muted-foreground/60 italic">No description provided.</span>
                                        )}
                                    </p>

                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {category.total_products ?? 0} products
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <TablePagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={sortedCategories.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </>
    );
}
