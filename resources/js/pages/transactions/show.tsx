import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types';

type Props = {
    transaction: Transaction;
};

const paymentLabel: Record<string, string> = {
    cash: 'Cash',
    zaad: 'Zaad',
    evc: 'EVC',
    jeeb: 'Jeeb',
    card: 'Card',
};

export default function TransactionShow({ transaction }: Props) {
    const { props } = usePage();
    const teamSlug = (props.currentTeam as { slug: string } | null)?.slug ?? '';

    return (
        <>
            <Head title={transaction.invoice_number} />
            <div className="flex max-w-2xl flex-col gap-6 p-6">
                {/* Back */}
                <Button
                    variant="ghost"
                    onClick={() => router.visit(`/${teamSlug}/transactions`)}
                    className="w-fit gap-2 text-text-secondary hover:text-brand"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Transactions
                </Button>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                            {transaction.invoice_number}
                        </h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            {transaction.created_at
                                ? new Date(
                                      transaction.created_at,
                                  ).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  })
                                : '—'}
                        </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-success-bg px-3 py-1 text-xs font-medium text-success-fg">
                        Completed
                    </span>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4 rounded-xl border border-border-soft bg-surface p-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium tracking-wide text-text-secondary uppercase">
                                Customer
                            </span>
                            <span className="text-text-primary">
                                {transaction.customer?.name ?? 'Walk-in'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium tracking-wide text-text-secondary uppercase">
                                Cashier
                            </span>
                            <span className="text-text-primary">
                                {transaction.cashier?.name ?? '—'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium tracking-wide text-text-secondary uppercase">
                                Payment
                            </span>
                            <span className="text-text-primary">
                                {paymentLabel[transaction.payment_method]}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="overflow-hidden rounded-xl border border-border-soft bg-surface">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border-soft">
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Product
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Qty
                                </th>
                                <th className="px-6 py-3.5 text-left text-[13px] font-medium text-text-secondary">
                                    Unit Price
                                </th>
                                <th className="px-6 py-3.5 text-right text-[13px] font-medium text-text-secondary">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.items?.map((item, idx) => (
                                <tr
                                    key={item.id}
                                    className={
                                        idx !==
                                        (transaction.items?.length ?? 0) - 1
                                            ? 'border-b border-border-soft'
                                            : ''
                                    }
                                >
                                    <td className="px-6 py-4 text-text-primary">
                                        {item.product?.name ?? '—'}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        ${Number(item.unit_price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-text-primary">
                                        ${Number(item.total).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="rounded-xl border border-border-soft bg-surface p-6">
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-text-secondary">
                            <span>Subtotal</span>
                            <span>
                                ${Number(transaction.subtotal).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                            <span>Discount</span>
                            <span>
                                -${Number(transaction.discount).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                            <span>Tax</span>
                            <span>${Number(transaction.tax).toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex justify-between border-t border-border-soft pt-2 font-semibold text-text-primary">
                            <span>Total</span>
                            <span>${Number(transaction.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TransactionShow.layout = (props: {
    currentTeam?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: 'Transactions',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/transactions`
                : '/',
        },
        {
            title: 'Receipt',
            href: '/',
        },
    ],
});
