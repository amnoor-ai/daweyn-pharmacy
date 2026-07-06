<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller 
{ 
   public function index(Request $request, Team $currentTeam)
{
    $q = $request->query('q', '');
    $today = \Illuminate\Support\Carbon::today();

    $products = $currentTeam->products()
        ->with('category')
        ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
            $q2->where('name', 'like', "%{$q}%")
               ->orWhere('sku', 'like', "%{$q}%");
        }))
        ->orderBy('name')
        ->get()
        ->map(function ($product) use ($today) {
            $status = 'valid';
            if ($product->expiry_date) {
                $expiry = \Illuminate\Support\Carbon::parse($product->expiry_date)->startOfDay();
                if ($expiry->lessThan($today)) {
                    $status = 'expired';
                } elseif ($expiry->lessThanOrEqualTo($today->copy()->addDays(30))) {
                    $status = 'expiring_soon';
                }
            }
            $product->stock_status = $status;
            return $product;
        });

    $categories = $currentTeam->categories()
        ->orderBy('name')
        ->get();

    return Inertia::render('products/index', [
        'products' => $products,
        'categories' => $categories,
        'search' => $q,
    ]);
}


    public function store(Request $request, Team $currentTeam)
    {
        $validated = $request->validate([
            'category_id'     => ['required', 'exists:categories,id'],
            'sku'             => ['required', 'string', 'max:100'],
            'name'            => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'cost_price'      => ['required', 'numeric', 'min:0'],
            'selling_price'   => ['required', 'numeric', 'min:0'],
            'stock_quantity'  => ['required', 'integer', 'min:0'],
            'alert_threshold' => ['required', 'integer', 'min:0'],
            'expiry_date'     => ['nullable', 'date', 'after:today'],
            'image'           => ['nullable', 'image', 'max:2048'], // Max 2MB
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $currentTeam->products()->create([
            ...$validated,
            'image_path' => $imagePath,
        ]);

    return redirect()
        ->route('products.index', $currentTeam->slug)
        ->with('success', 'Product created successfully.');
}


    public function update(Request $request, Team $currentTeam, Product $product)
    {
        abort_unless($product->team_id === $currentTeam->id, 403);

        $validated = $request->validate([
            'category_id'     => ['required', 'exists:categories,id'],
            'sku'             => ['required', 'string', 'max:100'],
            'name'            => ['required', 'string', 'max:255'],
            'description'     => ['nullable', 'string'],
            'cost_price'      => ['required', 'numeric', 'min:0'],
            'selling_price'   => ['required', 'numeric', 'min:0'],
            'stock_quantity'  => ['required', 'integer', 'min:0'],
            'alert_threshold' => ['required', 'integer', 'min:0'],
            'expiry_date'     => ['nullable', 'date'],
            'image'           => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

    return redirect()
        ->route('products.index', $currentTeam->slug)
        ->with('success', 'Product updated successfully.');
}

public function destroy(Team $currentTeam, Product $product)
{
    abort_unless($product->team_id === $currentTeam->id, 403);

    $product->delete();

    return redirect()
        ->route('products.index', $currentTeam->slug)
        ->with('success', 'Product deleted successfully.');
}
}
