<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller 
{ 
    public function index(Team $team)
    {
        $products = $team->products()
        ->with('category')
        ->orderBy('name')
        ->get();

        $categories = $team->categories()
        ->orderBy('name')
        ->get();

        return Inertia::render('products/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create(Team $team)
    {
        $categories = $team->categories()->orderBy('name')->get();

        return Inertia::render('products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request, Team $team)
    {
      $validated = $request->validate([
        'category_id' => ['required', 'exists:categories,id'],
        'sku' => ['required', 'string', 'max:100'],
        'name' => ['required', 'string', 'max:255'],
        'description' => ['nullable', 'string'],
        'cost_price' => ['required', 'numeric', 'min:0'],
        'selling_price' => ['required', 'numeric', 'min:0'],
        'stock_quantity' => ['required', 'integer', 'min:0'],
        'alert_threshold' => ['required', 'integer', 'min:0']
      ]);

      $team->products()->create($validated);

      return redirect()
      ->route('products.index', $team->slug)
      ->with('success', 'Product created successfully');
    }

    public function edit(Team $team, Product $product)
    {
        abort_unless($product->team_id === $team->id, 403);

        $categories = $team->categories()
        ->orderBy('name')
        ->get();

        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Team $team, Product $product)
    {
        abort_unless($product->team_id === $team->id, 403);

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'cost_price' => ['required', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'alert_threshold' => ['required', 'integer', 'min:0'],
        ]);

        $product->update($validated);

        return redirect()
            ->route('products.index', $team->slug)
            ->with('success', 'Product updated successfully');
    }

    public function destroy(Team $team, Product $product)
    {
        abort_unless($product->team_id === $team->id, 403);

        $product->delete();

        return redirect()
            ->route('products.index', $team->slug)
            ->with('success', 'Product deleted successfully');
    }
    
}
