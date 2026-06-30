import { Head, router, usePage } from '@inertiajs/react';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types';

type Props = {
    transactions: Transaction[];
};

const paymentBadge: Record<string, string> = {
    cash: 'bg-success-bg text-success-fg',
    zaad: 'bg-info-bg text-info-fg',
    evc: 'bg-info-bg text-info-fg',
    jeeb: 'bg-info-bg text-info-fg',
    card: 'bg-warning-bg text-warning-fg',
};

export default function TransactionsIndex({ transactions }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    return (
        <>
            <Head title="Transactions" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-y-3">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                            Transactions
                        </h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            Sales history and receipts.
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            router.visit(`/${teamSlug}/pos`)
                        }
                        className="gap-2 bg-brand hover:bg-brand-dark"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Go to POS
                    </Button>
                </div>

                {/* Table */}
                {transactions.length === 0 ? (
                    <div className="rounded-xl border border-border-soft bg-surface">
                        <p className="p-8 text-center text-sm text-text-secondary">
                            No transactions yet. Click &quot;New Sale&quot; to
                            record one.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border-soft bg-surface shadow-[0_2px_10px_rgba(20,28,64,0.05)]">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[620px] text-sm">
                                <thead>
                                    <tr className="border-b border-border-soft">
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Payment
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Total
                                        </th>
                                        <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                            Date
                                        </th>
                                        <th className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, idx) => (
                                        <tr
                                            key={tx.id}
                                            className={
                                                idx !== transactions.length - 1
                                                    ? 'border-b border-border-soft'
                                                    : ''
                                            }
                                        >
                                            <td className="px-6 py-4 font-mono text-xs font-medium text-text-primary">
                                                {tx.invoice_number}
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                {tx.customer?.name ?? (
                                                    <span className="italic">
                                                        Walk-in
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentBadge[tx.payment_method]}`}
                                                >
                                                    {tx.payment_method.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-text-primary">
                                                ${Number(tx.total).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                {tx.created_at
                                                    ? new Date(
                                                          tx.created_at,
                                                      ).toLocaleDateString(
                                                          'en-GB',
                                                          {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            `/${teamSlug}/transactions/${tx.id}`,
                                                        )
                                                    }
                                                    className="h-8 w-8 p-0 text-text-secondary hover:text-brand"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        View {tx.invoice_number}
                                                    </span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

TransactionsIndex.layout = (props: {
    currentTeam?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: 'Transactions',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/transactions`
                : '/',
        },
    ],
});
