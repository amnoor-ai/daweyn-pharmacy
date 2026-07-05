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
};

export default function CustomerDialog({
    open,
    onOpenChange,
    teamSlug,
    customer,
}: Props) {
    const isEditing = customer !== undefined;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<FormData>({
            name: customer?.name ?? '',
            email: customer?.email ?? '',
            phone: customer?.phone ?? '',
            address: customer?.address ?? '',
            loyalty_points: String(customer?.loyalty_points ?? 0),
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
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, customer?.id]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const options = {
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
                    <DialogTitle className="text-text-primary">
                        {isEditing ? 'Edit Customer' : 'Add Customer'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="customer-name"
                            className="text-text-primary"
                        >
                            Name <span className="text-danger-fg">*</span>
                        </Label>
                        <Input
                            id="customer-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Fatima Hassan"
                            autoFocus
                            className="border-border-soft"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="customer-phone"
                            className="text-text-primary"
                        >
                            Phone <span className="text-danger-fg">*</span>
                        </Label>
                        <Input
                            id="customer-phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="e.g. +252 61 234 5678"
                            className="border-border-soft"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="customer-email"
                            className="text-text-primary"
                        >
                            Email{' '}
                            <span className="text-xs font-normal text-text-secondary">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="customer-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="e.g. fatima@example.com"
                            className="border-border-soft"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="customer-address"
                            className="text-text-primary"
                        >
                            Address{' '}
                            <span className="text-xs font-normal text-text-secondary">
                                (optional)
                            </span>
                        </Label>
                        <Input
                            id="customer-address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="e.g. Hodan District, Mogadishu"
                            className="border-border-soft"
                        />
                        <InputError message={errors.address} />
                    </div>

                    {/* Loyalty Points */}
                    <div className="flex flex-col gap-1.5">
                        <Label
                            htmlFor="customer-loyalty"
                            className="text-text-primary"
                        >
                            Loyalty Points
                        </Label>
                        <Input
                            id="customer-loyalty"
                            type="number"
                            min="0"
                            value={data.loyalty_points}
                            onChange={(e) =>
                                setData('loyalty_points', e.target.value)
                            }
                            className="border-border-soft"
                        />
                        <InputError message={errors.loyalty_points} />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="border-border-soft"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-brand hover:bg-brand-dark transition-all duration-200 hover:-translate-y-0.5"
                        >
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
