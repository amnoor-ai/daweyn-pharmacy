<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request, Team $currentTeam)
    {
        $startDate = $request->query('start', now()->subDays(30)->startOfDay()->toDateTimeString());
        $endDate = $request->query('end', now()->endOfDay()->toDateTimeString());

        // Basic metrics
        $transactionsQuery = $currentTeam->transactions()->whereBetween('created_at', [$startDate, $endDate]);
        
        $totalRevenue = $transactionsQuery->sum('total');
        $transactionCount = $transactionsQuery->count();

        // Calculate total profit
        // Profit = transaction_items.total - (transaction_items.quantity * products.cost_price)
        $profitData = DB::table('transactions')
            ->join('transaction_items', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->where('transactions.team_id', $currentTeam->id)
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->selectRaw('SUM(transaction_items.total - (transaction_items.quantity * products.cost_price)) as total_profit')
            ->first();
            
        $totalProfit = $profitData->total_profit ?? 0;

        // Sales over time (daily)
        $salesTrend = DB::table('transactions')
            ->where('team_id', $currentTeam->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(id) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Best selling products
        $topProducts = DB::table('transactions')
            ->join('transaction_items', 'transactions.id', '=', 'transaction_items.transaction_id')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->where('transactions.team_id', $currentTeam->id)
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->selectRaw('products.name, SUM(transaction_items.quantity) as quantity_sold, SUM(transaction_items.total) as total_revenue')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('quantity_sold')
            ->limit(10)
            ->get();

        // Payment Methods
        $paymentMethods = DB::table('transactions')
            ->where('team_id', $currentTeam->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('payment_method, COUNT(id) as count, SUM(total) as total')
            ->groupBy('payment_method')
            ->get();

        return Inertia::render('reports/index', [
            'metrics' => [
                'total_revenue' => (float) $totalRevenue,
                'total_profit' => (float) $totalProfit,
                'transaction_count' => $transactionCount,
            ],
            'sales_trend' => $salesTrend,
            'top_products' => $topProducts,
            'payment_methods' => $paymentMethods,
            'filters' => [
                'start' => $startDate,
                'end' => $endDate,
            ]
        ]);
    }
}
