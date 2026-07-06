<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, Team $current_team): Response
    {
        $email = strtolower($request->user()->email);

        // 1. Pending invitations (existing logic)
        $pendingInvitations = TeamInvitation::query()
            ->with(['inviter', 'team'])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->latest()
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);

        // 2. Metrics calculation
        $totalRevenue = (float) $current_team->transactions()->sum('total');
        $totalTransactions = $current_team->transactions()->count();
        $totalCustomers = $current_team->customers()->count();
        $totalProducts = $current_team->products()->count();

        // 3. Low stock products (stock_quantity <= alert_threshold)
        $lowStockProducts = $current_team->products()
            ->whereColumn('stock_quantity', '<=', 'alert_threshold')
            ->with('category')
            ->orderBy('stock_quantity', 'asc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'stock_quantity' => $p->stock_quantity,
                'alert_threshold' => $p->alert_threshold,
                'category_name' => $p->category?->name ?? '—',
            ]);

        // 4. Recent transactions (last 5, with customer and items)
        $recentTransactions = $current_team->transactions()
            ->with(['customer', 'cashier', 'items.product'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'invoice_number' => $t->invoice_number,
                'customer_name' => $t->customer?->name ?? 'Walk-in Customer',
                'cashier_name' => $t->cashier?->name ?? 'System',
                'total' => (float) $t->total,
                'payment_method' => $t->payment_method,
                'created_at' => $t->created_at?->toISOString(),
                'items_count' => $t->items->sum('quantity'),
            ]);

        // 5. Revenue by payment method
        $revenueByPaymentMethod = $current_team->transactions()
            ->groupBy('payment_method')
            ->selectRaw('payment_method, sum(total) as total')
            ->get()
            ->map(fn ($item) => [
                'payment_method' => $item->payment_method,
                'total' => (float) $item->total,
            ]);

        // 6. Expiring soon products (expiry_date between today and today + 30 days)
        $expiringProducts = $current_team->products()
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [\Illuminate\Support\Carbon::today(), \Illuminate\Support\Carbon::today()->addDays(30)])
            ->orderBy('expiry_date', 'asc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'expiry_date' => $p->expiry_date ? $p->expiry_date->toDateString() : null,
                'days_remaining' => $p->expiry_date ? (int) \Illuminate\Support\Carbon::today()->diffInDays($p->expiry_date, false) : 0,
            ]);

        // 7. Daily revenue for the last 30 days (for the line chart)
        $revenueByDay = $current_team->transactions()
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->where('created_at', '>=', Carbon::now()->subDays(29)->startOfDay())
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date'  => $item->date,
                'total' => (float) $item->total,
            ]);

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalTransactions' => $totalTransactions,
                'totalCustomers' => $totalCustomers,
                'totalProducts' => $totalProducts,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentTransactions' => $recentTransactions,
            'revenueByPaymentMethod' => $revenueByPaymentMethod,
            'expiringProducts' => $expiringProducts,
            'revenueByDay' => $revenueByDay,
        ]);
    }
}
