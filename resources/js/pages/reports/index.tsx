import { Head, usePage, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useState } from 'react';

// For this implementation, we will build a basic UI. 
// You can later add Recharts or another charting library for the `sales_trend` and `payment_methods` data.

export default function ReportsIndex() {
    const { metrics, sales_trend, top_products, payment_methods, filters, currentTeam } = usePage<any>().props;

    const [start, setStart] = useState(filters.start.split(' ')[0]);
    const [end, setEnd] = useState(filters.end.split(' ')[0]);

    const handleFilter = () => {
        router.get(`/${currentTeam.slug}/reports`, {
            start: start ? `${start} 00:00:00` : '',
            end: end ? `${end} 23:59:59` : '',
        }, { preserveState: true });
    };

    const breadcrumbs = [
        {
            title: 'Reports & Analytics',
            href: `/${currentTeam.slug}/reports`,
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports & Analytics" />
            <div className="flex flex-col flex-1 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Heading
                        title="Reports & Analytics"
                        description="View sales trends, profits, and top products."
                    />
                    
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="start" className="sr-only">Start Date</Label>
                            <Input type="date" id="start" value={start} onChange={(e) => setStart(e.target.value)} className="w-auto h-9 text-sm" />
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="end" className="sr-only">End Date</Label>
                            <Input type="date" id="end" value={end} onChange={(e) => setEnd(e.target.value)} className="w-auto h-9 text-sm" />
                        </div>
                        <Button size="sm" onClick={handleFilter}>Filter</Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
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
                            <div className="text-2xl font-bold text-success-fg">${metrics.total_profit.toFixed(2)}</div>
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

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Top Products */}
                    <Card className="col-span-1 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {top_products.length > 0 ? (
                                <div className="space-y-4">
                                    {top_products.map((product: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.quantity_sold} sold
                                                </p>
                                            </div>
                                            <div className="font-medium">${Number(product.total_revenue).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">No sales data for this period.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {payment_methods.length > 0 ? (
                                <div className="space-y-4">
                                    {payment_methods.map((method: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none capitalize">{method.payment_method}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {method.count} transactions
                                                </p>
                                            </div>
                                            <div className="font-medium">${Number(method.total).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">No sales data for this period.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
