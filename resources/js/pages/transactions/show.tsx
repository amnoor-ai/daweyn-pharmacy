import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

const paymentBadge: Record<string, string> = {
    cash: 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10/80 border-transparent shadow-none',
    zaad: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10/80 border-transparent shadow-none',
    evc: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10/80 border-transparent shadow-none',
    jeeb: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/10/80 border-transparent shadow-none',
    card: 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/10/80 border-transparent shadow-none',
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
                    className="w-fit gap-2 text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Transactions
                </Button>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {transaction.invoice_number}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
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
                    <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10/80 border-transparent shadow-none">
                        Completed
                    </Badge>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Customer
                            </span>
                            <span className="text-foreground">
                                {transaction.customer?.name ?? 'Walk-in'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Cashier
                            </span>
                            <span className="text-foreground">
                                {transaction.cashier?.name ?? '—'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Payment
                            </span>
                            <span className="text-foreground">
                                <Badge variant="secondary" className={`rounded-full ${paymentBadge[transaction.payment_method]}`}>
                                    {paymentLabel[transaction.payment_method]}
                                </Badge>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border hover:bg-transparent">
                                <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-muted-foreground uppercase">Product</TableHead>
                                <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-muted-foreground uppercase">Qty</TableHead>
                                <TableHead className="px-6 py-3.5 text-left text-[13px] font-medium text-muted-foreground uppercase">Unit Price</TableHead>
                                <TableHead className="px-6 py-3.5 text-right text-[13px] font-medium text-muted-foreground uppercase">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transaction.items?.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="border-b border-border hover:bg-primary/10 transition-colors"
                                >
                                    <TableCell className="px-6 py-4 text-foreground">
                                        {item.product?.name ?? '—'}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-muted-foreground">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-muted-foreground">
                                        ${Number(item.unit_price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-6 py-4 text-right font-medium text-foreground">
                                        ${Number(item.total).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Totals */}
                <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>
                                ${Number(transaction.subtotal).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Discount</span>
                            <span>
                                -${Number(transaction.discount).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax</span>
                            <span>${Number(transaction.tax).toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex justify-between border-t border-border pt-2 font-semibold text-foreground">
                            <span>Total</span>
                            <span>${Number(transaction.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {transaction.customer && (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex justify-between items-center text-sm font-medium text-emerald-500">
                            <span>Points earned</span>
                            <span>+{Math.floor(Number(transaction.total))} pts</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

TransactionShow.layoutConfig = (props: {
    currentTeam?: { slug: string } | null;
    transaction?: Transaction;
}) => ({
    breadcrumbs: [
        {
            title: 'Transactions',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/transactions`
                : '/',
        },
        {
            title: props.transaction?.invoice_number || 'Receipt',
            href: props.currentTeam && props.transaction
                ? `/${props.currentTeam.slug}/transactions/${props.transaction.id}`
                : '/',
        },
    ],
});
