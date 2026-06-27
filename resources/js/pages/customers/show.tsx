import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types';

type Props = {
    customer: Customer;
};

export default function CustomerShow({ customer }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    return (
        <>
            <Head title={customer.name} />
            <div className="flex flex-col gap-6 p-6 max-w-2xl">
                {/* Back button */}
                <Button
                    variant="ghost"
                    onClick={() => router.visit(`/${teamSlug}/customers`)}
                    className="w-fit gap-2 text-text-secondary hover:text-brand"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Button>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                        {customer.name}
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Customer profile
                    </p>
                </div>

                {/* Details */}
                <div className="rounded-xl border border-border-soft bg-surface p-6">
                    <dl className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">Phone</dt>
                            <dd className="text-sm text-text-primary">{customer.phone}</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">Email</dt>
                            <dd className="text-sm text-text-primary">{customer.email ?? '—'}</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">Address</dt>
                            <dd className="text-sm text-text-primary">{customer.address ?? '—'}</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">Loyalty Points</dt>
                            <dd className="text-sm font-medium text-brand">{customer.loyalty_points}</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium uppercase tracking-wide text-text-secondary">Customer Since</dt>
                            <dd className="text-sm text-text-primary">
                                {customer.created_at
                                    ? new Date(customer.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : '—'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
}

CustomerShow.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Customers',
            href: props.currentTeam ? `/${props.currentTeam.slug}/customers` : '/',
        },
        {
            title: 'Profile',
            href: '/',
        },
    ],
});