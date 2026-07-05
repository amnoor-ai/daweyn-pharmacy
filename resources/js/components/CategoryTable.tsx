import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types';

type Props = {
    categories: Category[];
    teamSlug: string;
    onEdit: (category: Category) => void;
};

export default function CategoryTable({ categories, teamSlug, onEdit }: Props) {
    function handleDelete(category: Category) {
        if (!confirm(`Delete "${category.name}"? This cannot be undone.`)) {
            return;
        }

        router.delete(`/${teamSlug}/categories/${category.id}`, {
            preserveScroll: true,
        });
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
        <div className="overflow-hidden rounded-lg border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                    {/* Header */}
                    <thead>
                        <tr className="border-b border-divider">
                            <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                Name
                            </th>
                            <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                Slug
                            </th>
                            <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                Description
                            </th>
                            <th className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {categories.map((category, idx) => (
                            <tr
                                key={category.id}
                                className={
                                    idx !== categories.length - 1
                                        ? 'border-b border-divider'
                                        : ''
                                }
                            >
                                <td className="px-6 py-4 font-medium text-text-primary">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-text-secondary">
                                    {category.slug}
                                </td>
                                <td className="max-w-xs px-6 py-4 text-text-secondary">
                                    {category.description ?? (
                                        <span className="text-text-muted italic">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(category)}
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">
                                                Edit {category.name}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(category)
                                            }
                                            className="h-8 w-8 p-0 text-text-secondary hover:text-danger-fg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete {category.name}
                                            </span>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
