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

    $products = $currentTeam->products()
        ->with('category')
        ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
            $q2->where('name', 'like', "%{$q}%")
               ->orWhere('sku', 'like', "%{$q}%");
        }))
        ->orderBy('name')
        ->get();

    $categories = $currentTeam->categories()
        ->orderBy('name')
        ->get();

    return Inertia::render('products/index', [
        'products' => $products,
        'categories' => $categories,
        'search' => $q,
    ]);
}

public function create(Team $currentTeam)
{
    $categories = $currentTeam->categories()->orderBy('name')->get();

    return Inertia::render('products/create', [
        'categories' => $categories,
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
    ]);

    $currentTeam->products()->create($validated);

    return redirect()
        ->route('products.index', $currentTeam->slug)
        ->with('success', 'Product created successfully.');
}

public function edit(Team $currentTeam, Product $product)
{
    abort_unless($product->team_id === $currentTeam->id, 403);

    $categories = $currentTeam->categories()->orderBy('name')->get();

    return Inertia::render('products/edit', [
        'product'    => $product,
        'categories' => $categories,
    ]);
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
    ]);

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
