import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';
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
import type { Customer } from '@/types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamSlug: string;
    customer?: Customer;
};

type FormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    loyalty_points: string;
    avatar: File | null;
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function CustomerDialog({
    open,
    onOpenChange,
    teamSlug,
    customer,
}: Props) {
    const isEditing = customer !== undefined;
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(customer?.avatar ?? null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            name: customer?.name ?? '',
            email: customer?.email ?? '',
            phone: customer?.phone ?? '',
            address: customer?.address ?? '',
            loyalty_points: String(customer?.loyalty_points ?? 0),
            avatar: null,
        });

    useEffect(() => {
        if (open) {
            reset();
            clearErrors();
            setData({
                name: customer?.name ?? '',
                email: customer?.email ?? '',
                phone: customer?.phone ?? '',
                address: customer?.address ?? '',
                loyalty_points: String(customer?.loyalty_points ?? 0),
                avatar: null,
            });
            setPreview(customer?.avatar ?? null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, customer?.id]);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('avatar', file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        };

        if (isEditing) {
            put(`/${teamSlug}/customers/${customer.id}`, options);
        } else {
            post(`/${teamSlug}/customers`, options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground">
                        {isEditing ? 'Edit Customer' : 'Add Customer'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="group relative h-20 w-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Avatar preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-muted-foreground select-none">
                                    {data.name ? getInitials(data.name) : <User className="h-8 w-8 text-muted-foreground" />}
                                </span>
                            )}
                            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-5 w-5 text-background" />
                            </div>
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <p className="text-xs text-muted-foreground">
                            Click to upload a photo (optional)
                        </p>
                        <InputError message={errors.avatar} />
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="customer-name" className="text-foreground">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="customer-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Fatima Hassan"
                            autoFocus
                            className="border-border"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="customer-phone" className="text-foreground">
                            Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="customer-phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="e.g. +252 61 234 5678"
                            className="border-border"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="customer-email" className="text-foreground">
                            Email{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="customer-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="e.g. fatima@example.com"
                            className="border-border"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="customer-address" className="text-foreground">
                            Address{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="customer-address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="e.g. Hodan District, Mogadishu"
                            className="border-border"
                        />
                        <InputError message={errors.address} />
                    </div>

                    {/* Loyalty Points */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="customer-loyalty" className="text-foreground">
                            Loyalty Points
                        </Label>
                        <Input
                            id="customer-loyalty"
                            type="number"
                            min="0"
                            value={data.loyalty_points}
                            onChange={(e) => setData('loyalty_points', e.target.value)}
                            className="border-border"
                        />
                        <InputError message={errors.loyalty_points} />
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
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving…'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Add Customer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
