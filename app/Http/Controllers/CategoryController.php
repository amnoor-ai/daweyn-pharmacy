<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the team's categories.
     */
    public function index(Request $request, Team $current_team): Response
    {
        $q = $request->query('q', '');

        $categories = Category::where('team_id', $current_team->id)
            ->withCount('products')
            ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                   ->orWhere('description', 'like', "%{$q}%");
            }))
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'total_products' => $category->products_count ?? 0,
                'created_at' => $category->created_at?->toISOString(),
            ]);

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'search' => $q,
        ]);
    }

    /**
     * Store a newly created category for the team.
     */
    public function store(Request $request, Team $current_team): RedirectResponse
    {
        $slug = Str::slug($request->input('slug') ?: $request->input('name'));

        $validated = $request->merge(['slug' => $slug])->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('categories')->where('team_id', $current_team->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $current_team->categories()->create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category created.')]);

        return to_route('categories.index', $current_team->slug);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Team $current_team, Category $category): RedirectResponse
    {
        abort_unless($category->team_id === $current_team->id, 403);

        $slug = Str::slug($request->input('slug') ?: $request->input('name'));

        $validated = $request->merge(['slug' => $slug])->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('categories')
                    ->where('team_id', $current_team->id)
                    ->ignore($category->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $category->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category updated.')]);

        return to_route('categories.index', $current_team->slug);
    }

    /**
     * Remove the specified category from the team.
     */
    public function destroy(Request $request, Team $current_team, Category $category): RedirectResponse
    {
        abort_unless($category->team_id === $current_team->id, 403);

        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Category deleted.')]);

        return to_route('categories.index', $current_team->slug);
    }
}
