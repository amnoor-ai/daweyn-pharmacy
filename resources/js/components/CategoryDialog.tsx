import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Category } from '@/types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamSlug: string;
    category?: Category; // undefined = create mode, defined = edit mode
};

type FormData = {
    name: string;
    slug: string; // sent implicitly by the backend; present in errors if invalid
    description: string;
};

/** Convert a string to a URL-friendly slug (mirrors Laravel's Str::slug) */
function toSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export default function CategoryDialog({
    open,
    onOpenChange,
    teamSlug,
    category,
}: Props) {
    const isEditing = category !== undefined;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            name: category?.name ?? '',
            slug: category?.slug ?? '',
            description: category?.description ?? '',
        });

    // When the dialog opens for a different category (or switches create ↔ edit),
    // reset the form to the correct initial values.
    useEffect(() => {
        if (open) {
            reset();
            clearErrors();
            setData({
                name: category?.name ?? '',
                slug: category?.slug ?? '',
                description: category?.description ?? '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, category?.id]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        };

        if (isEditing) {
            put(`/${teamSlug}/categories/${category.id}`, options);
        } else {
            post(`/${teamSlug}/categories`, options);
        }
    }

    // Derived slug preview shown below the name field
    const slugPreview = toSlug(data.name);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {isEditing ? 'Edit Category' : 'Add Category'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="category-name"
                            className="text-foreground"
                        >
                            Name{' '}
                            <span className="text-red-500" aria-hidden>
                                *
                            </span>
                        </Label>
                        <Input
                            id="category-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Antibiotics"
                            autoFocus
                            className="border-border"
                        />
                        {/* Live slug preview */}
                        {data.name && (
                            <p className="text-xs text-muted-foreground">
                                Slug:{' '}
                                <span className="font-mono text-accent-indigo">
                                    {slugPreview}
                                </span>
                            </p>
                        )}
                        <InputError message={errors.name} />
                        <InputError message={errors.slug} />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="category-description"
                            className="text-foreground"
                        >
                            Description{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Textarea
                            id="category-description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="Short description of this category…"
                            rows={3}
                            className="border-border"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="border-border"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? 'Saving…'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
