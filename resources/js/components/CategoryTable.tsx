import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    categories: Category[];
    teamSlug: string;
    onEdit: (category: Category) => void;
};

export default function CategoryTable({ categories, teamSlug, onEdit }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    function confirmDelete() {
        if (!deleteTarget) return;
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

            <div className="overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                <Table className="min-w-[500px]">
                    <TableHeader>
                        <TableRow className="border-b border-divider hover:bg-transparent">
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Name</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Slug</TableHead>
                            <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary uppercase">Description</TableHead>
                            <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary uppercase">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow
                                key={category.id}
                                className="border-b border-divider hover:bg-primary-50 transition-colors"
                            >
                                <TableCell className="px-6 py-4 font-medium text-text-primary">
                                    {category.name}
                                </TableCell>
                                <TableCell className="px-6 py-4 font-mono text-xs text-text-secondary">
                                    {category.slug}
                                </TableCell>
                                <TableCell className="max-w-xs px-6 py-4 text-text-secondary">
                                    {category.description ?? (
                                        <span className="text-text-muted italic">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(category)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit {category.name}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteTarget(category)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete {category.name}</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
