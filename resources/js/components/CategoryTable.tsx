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
            <div className="rounded-xl border border-[#ECEEF5] bg-white">
                <p className="p-8 text-center text-sm text-[#8A8FA6]">
                    No categories yet. Click &quot;Add Category&quot; to create
                    one.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#ECEEF5] bg-white shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
            <table className="w-full text-sm">
                {/* Header */}
                <thead>
                    <tr className="border-b border-[#F1F2F7]">
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-[#8A8FA6]">
                            Name
                        </th>
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-[#8A8FA6]">
                            Slug
                        </th>
                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-[#8A8FA6]">
                            Description
                        </th>
                        <th className="px-6 py-3.5 text-right text-[13px] font-medium text-[#8A8FA6]">
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
                                    ? 'border-b border-[#F1F2F7]'
                                    : ''
                            }
                        >
                            <td className="px-6 py-4 font-medium text-[#161A30]">
                                {category.name}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-[#8A8FA6]">
                                {category.slug}
                            </td>
                            <td className="max-w-xs px-6 py-4 text-[#8A8FA6]">
                                {category.description ?? (
                                    <span className="italic text-[#B0B4C4]">
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
                                        className="h-8 w-8 p-0 text-[#8A8FA6] hover:text-[#1B2559]"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">
                                            Edit {category.name}
                                        </span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(category)}
                                        className="h-8 w-8 p-0 text-[#8A8FA6] hover:text-red-600"
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
    );
}
