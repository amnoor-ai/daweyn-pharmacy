import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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
            <div className="flex max-w-2xl flex-col gap-6 p-6">
                {/* Back button */}
                <Button
                    variant="ghost"
                    onClick={() => router.visit(`/${teamSlug}/customers`)}
                    className="w-fit gap-2 text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Button>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {customer.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Customer profile
                    </p>
                </div>

                {/* Details */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <dl className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Phone
                            </dt>
                            <dd className="text-sm text-foreground">
                                {customer.phone}
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Email
                            </dt>
                            <dd className="text-sm text-foreground">
                                {customer.email ?? '—'}
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Address
                            </dt>
                            <dd className="text-sm text-foreground">
                                {customer.address ?? '—'}
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Loyalty Points
                            </dt>
                            <dd className="text-sm font-medium text-primary">
                                {customer.loyalty_points}
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Customer Since
                            </dt>
                            <dd className="text-sm text-foreground">
                                {customer.created_at
                                    ? new Date(
                                          customer.created_at,
                                      ).toLocaleDateString('en-GB', {
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

CustomerShow.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Customers',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/customers`
                : '/',
        },
        {
            title: 'Profile',
            href: '/',
        },
    ],
});
