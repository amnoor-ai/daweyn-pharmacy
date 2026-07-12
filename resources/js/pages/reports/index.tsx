import { Head, usePage, router, Link } from '@inertiajs/react';
import { TrendingUp, DollarSign, Activity, Users, Package, Tags, ReceiptText, Download } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function ReportsIndex() {
    const { metrics, top_products, payment_methods, customers, filters, currentTeam } = usePage<any>().props;

    const [start, setStart] = useState(filters.start.split(' ')[0]);
    const [end, setEnd] = useState(filters.end.split(' ')[0]);

    // Show only top 10 — no pagination needed in the report summary view
    const topProducts = top_products?.slice(0, 10) || [];
    const topCustomers = customers?.slice(0, 10) || [];

    function exportReportsCSV() {
        const lines: string[] = [`Reports Export: ${start} to ${end}`, ''];
        lines.push('TOP SELLING PRODUCTS');
        lines.push('Rank,Product,Quantity Sold,Total Revenue');
        topProducts.forEach((p: any, i: number) => {
            lines.push(`${i + 1},"${p.name}",${p.quantity_sold},${Number(p.total_revenue).toFixed(2)}`);
        });
        lines.push('');
        lines.push('TOP CUSTOMERS');
        lines.push('Rank,Customer,Phone,Total Spent');
        topCustomers.forEach((c: any, i: number) => {
            lines.push(`${i + 1},"${c.name}",${c.phone || ''},${Number(c.transactions_sum_total).toFixed(2)}`);
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reports-${start}-to-${end}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const handleFilter = () => {
        router.get(`/${currentTeam.slug}/reports`, {
            start: start ? `${start} 00:00:00` : '',
            end: end ? `${end} 23:59:59` : '',
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Reports & Analytics" />
            <div className="flex flex-col flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Heading
                        title="Reports & Analytics"
                        description="View sales trends, profits, and top products."
                    />
                    
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <div className="flex flex-1 sm:flex-none items-center gap-2">
                            <Label htmlFor="start" className="sr-only">Start Date</Label>
                            <Input type="date" id="start" value={start} onChange={(e) => setStart(e.target.value)} className="min-w-[148px] h-9 text-sm" />
                        </div>
                        <span className="text-muted-foreground text-sm hidden sm:inline">→</span>
                        <div className="flex flex-1 sm:flex-none items-center gap-2">
                            <Label htmlFor="end" className="sr-only">End Date</Label>
                            <Input type="date" id="end" value={end} onChange={(e) => setEnd(e.target.value)} className="min-w-[148px] h-9 text-sm" />
                        </div>
                        <Button size="sm" onClick={handleFilter} className="h-9 sm:mt-0">Filter</Button>
                        <Button variant="outline" size="sm" onClick={exportReportsCSV} className="h-9 gap-2 border-border bg-card text-muted-foreground">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${metrics.total_revenue.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">${metrics.total_profit.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.transaction_count}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Top Products (Left Side) */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-foreground">Top Selling Products</h2>
                        <Card className="flex flex-col overflow-hidden">
                            <CardContent className="flex-1 flex flex-col justify-between p-0">
                                {top_products.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">#</TableHead>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead className="text-right">Quantity Sold</TableHead>
                                                    <TableHead className="text-right">Total Revenue</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {topProducts.map((product: any, idx: number) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium text-muted-foreground text-left w-8">{idx + 1}</TableCell>
                                                        <TableCell className="font-semibold text-foreground text-left">{product.name}</TableCell>
                                                        <TableCell className="text-right text-muted-foreground tabular-nums"><span className="font-medium text-foreground">{product.quantity_sold}</span><span className="ml-1 text-muted-foreground text-xs">sold</span></TableCell>
                                                        <TableCell className="font-bold text-foreground text-right tabular-nums">${Number(product.total_revenue).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground p-6">No sales data for this period.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment Methods + Quick Links */}
                    <div className="col-span-1 flex flex-col gap-4">
                        {/* Payment Methods */}
                        <h2 className="text-lg font-bold text-foreground">Payment Methods</h2>
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                {payment_methods.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Method</TableHead>
                                                    <TableHead className="text-right">Transactions</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {payment_methods.map((method: any, idx: number) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-semibold text-foreground text-left capitalize py-2.5">{method.payment_method}</TableCell>
                                                        <TableCell className="text-right text-muted-foreground tabular-nums py-2.5"><span className="font-medium text-foreground">{method.count}</span><span className="ml-1 text-muted-foreground text-xs">txn</span></TableCell>
                                                        <TableCell className="font-bold text-foreground text-right tabular-nums py-2.5">${Number(method.total).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground p-6">No sales data for this period.</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Navigation Cards pushed up under Payment Methods */}
                        <div className="mt-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Quick Navigation</h3>
                            <div className="grid gap-3 grid-cols-2">
                                <Link href={`/${currentTeam.slug}/customers`} className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:shadow-md transition-all group gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">Customers</span>
                                </Link>
                                <Link href={`/${currentTeam.slug}/products`} className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:shadow-md transition-all group gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">Products</span>
                                </Link>
                                <Link href={`/${currentTeam.slug}/categories`} className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:shadow-md transition-all group gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Tags className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">Categories</span>
                                </Link>
                                <Link href={`/${currentTeam.slug}/transactions`} className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card hover:shadow-md transition-all group gap-2 text-center">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <ReceiptText className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">Transactions</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Customers (Consistent with Top Products) */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-foreground">Top Customers</h2>
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                        {customers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">#</TableHead>
                                            <TableHead>Customer Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead className="text-right">Last Visit</TableHead>
                                            <TableHead className="text-right">Total Spent</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {topCustomers.map((customer: any, idx: number) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium text-muted-foreground text-left w-8">{idx + 1}</TableCell>
                                                <TableCell className="font-semibold text-foreground text-left">{customer.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-left">
                                                    <div className="flex flex-col">
                                                        <span>{customer.phone || '—'}</span>
                                                        {customer.email && <span className="text-xs text-muted-foreground">{customer.email}</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {customer.transactions_max_created_at ? new Date(customer.transactions_max_created_at).toLocaleDateString() : '—'}
                                                </TableCell>
                                                <TableCell className="font-bold text-foreground text-right tabular-nums">${Number(customer.transactions_sum_total).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground pt-0 p-6">No customers found for this period.</div>
                        )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layoutConfig = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Reports & Analytics',
            href: props.currentTeam
                ? `/${props.currentTeam.slug}/reports`
                : '/',
        },
    ],
});
