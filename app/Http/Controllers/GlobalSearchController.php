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
                'products' => [],
                'customers' => [],
                'transactions' => [],
            ]);
        }

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
            'products' => $products,
            'customers' => $customers,
            'transactions' => $transactions,
        ]);
    }
}
