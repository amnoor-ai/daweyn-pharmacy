<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function search(Request $request, Team $currentTeam)
    {
        $q = $request->query('q', '');

        if (empty(trim($q))) {
            return response()->json([
                'pages' => [],
                'products' => [],
                'customers' => [],
                'transactions' => [],
            ]);
        }

        $allPages = [
            ['name' => 'Dashboard', 'url' => "/{$currentTeam->slug}/dashboard", 'icon' => 'LayoutDashboard'],
            ['name' => 'Point of Sale (POS)', 'url' => "/{$currentTeam->slug}/pos", 'icon' => 'Calculator'],
            ['name' => 'Products', 'url' => "/{$currentTeam->slug}/products", 'icon' => 'Package'],
            ['name' => 'Categories', 'url' => "/{$currentTeam->slug}/categories", 'icon' => 'Tags'],
            ['name' => 'Transactions', 'url' => "/{$currentTeam->slug}/transactions", 'icon' => 'ReceiptText'],
            ['name' => 'Customers', 'url' => "/{$currentTeam->slug}/customers", 'icon' => 'Users'],
            ['name' => 'Reports', 'url' => "/{$currentTeam->slug}/reports", 'icon' => 'BarChart3'],
            ['name' => 'Settings', 'url' => "/{$currentTeam->slug}/settings", 'icon' => 'Settings'],
            ['name' => 'Staff & Users', 'url' => "/{$currentTeam->slug}/users", 'icon' => 'UserCog'],
        ];

        $pages = collect($allPages)
            ->filter(fn($page) => stripos($page['name'], $q) !== false)
            ->take(5)
            ->values();

        $products = $currentTeam->products()
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('sku', 'like', "%{$q}%");
            })
            ->limit(5)
            ->get(['id', 'name', 'sku', 'selling_price', 'image_path']);

        $products->each->append('image_url');

        $customers = $currentTeam->customers()
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('phone', 'like', "%{$q}%")
                      ->orWhere('email', 'like', "%{$q}%");
            })
            ->limit(5)
            ->get(['id', 'name', 'phone', 'email']);

        $transactions = $currentTeam->transactions()
            ->with(['customer:id,name'])
            ->where('invoice_number', 'like', "%{$q}%")
            ->limit(5)
            ->get(['id', 'invoice_number', 'total', 'customer_id', 'created_at']);

        return response()->json([
            'pages' => $pages,
            'products' => $products,
            'customers' => $customers,
            'transactions' => $transactions,
        ]);
    }
}
