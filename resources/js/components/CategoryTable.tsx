import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
};

export default function CategoryTable({ categories, teamSlug, onEdit }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((category) => (
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
        </>
    );
}
