<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request, Team $currentTeam)
    {
        $q = $request->query('q', '');
        $status = $request->query('status', 'all');
        $minSpend = $request->query('min_spend');
        $maxSpend = $request->query('max_spend');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $customersQuery = $currentTeam->customers()
            ->withSum('transactions', 'total')
            ->withMax('transactions', 'created_at')
            ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                   ->orWhere('phone', 'like', "%{$q}%")
                   ->orWhere('email', 'like', "%{$q}%");
            }))
            ->when($status === 'active', fn ($query) => $query->whereHas('transactions', fn ($q) => $q->where('created_at', '>=', now()->subDays(30))))
            ->when($status === 'inactive', fn ($query) => $query->whereDoesntHave('transactions', fn ($q) => $q->where('created_at', '>=', now()->subDays(30))))
            ->when($startDate, fn ($query) => $query->whereHas('transactions', fn ($q) => $q->where('created_at', '>=', $startDate . ' 00:00:00')))
            ->when($endDate, fn ($query) => $query->whereHas('transactions', fn ($q) => $q->where('created_at', '<=', $endDate . ' 23:59:59')));

        $customers = $customersQuery->orderBy('name')->get();

        if ($minSpend !== null || $maxSpend !== null) {
            $customers = $customers->filter(function ($customer) use ($minSpend, $maxSpend) {
                $spent = $customer->transactions_sum_total ?? 0;
                if ($minSpend !== null && $spent < $minSpend) return false;
                if ($maxSpend !== null && $spent > $maxSpend) return false;
                return true;
            })->values();
        }

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'filters' => [
                'q' => $q,
                'status' => $status,
                'min_spend' => $minSpend,
                'max_spend' => $maxSpend,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function search(Request $request, Team $currentTeam)
    {
        $q = $request->query('q', '');

        $customers = $currentTeam->customers()
            ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                   ->orWhere('phone', 'like', "%{$q}%")
                   ->orWhere('email', 'like', "%{$q}%");
            }))
            ->limit(50)
            ->get();

        return response()->json($customers);
    }

    public function show(Team $currentTeam, Customer $customer)
    {
        abort_unless($customer->team_id === $currentTeam->id, 403);

        $customer->load(['transactions.items.product']);

        return Inertia::render('customers/show', [
            'customer' => $customer,
        ]);
    }

    public function store(Request $request, Team $currentTeam)
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['nullable', 'email', 'max:255'],
            'phone'          => ['required', 'string', 'max:50'],
            'address'        => ['nullable', 'string', 'max:500'],
            'loyalty_points' => ['integer', 'min:0'],
            'avatar'         => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = Storage::url($request->file('avatar')->store('avatars', 'public'));
        }

        $currentTeam->customers()->create($validated);

        return redirect()
            ->route('customers.index', $currentTeam->slug)
            ->with('success', 'Customer created successfully.');
    }

    public function update(Request $request, Team $currentTeam, Customer $customer)
    {
        abort_unless($customer->team_id === $currentTeam->id, 403);

        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'email'          => ['nullable', 'email', 'max:255'],
            'phone'          => ['required', 'string', 'max:50'],
            'address'        => ['nullable', 'string', 'max:500'],
            'loyalty_points' => ['integer', 'min:0'],
            'avatar'         => ['nullable', 'image', 'max:2048'],
        ]);

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($customer->avatar) {
                $oldPath = str_replace('/storage/', '', $customer->avatar);
                Storage::disk('public')->delete($oldPath);
            }
            $validated['avatar'] = Storage::url($request->file('avatar')->store('avatars', 'public'));
        }

        $customer->update($validated);

        return redirect()
            ->route('customers.index', $currentTeam->slug)
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Team $currentTeam, Customer $customer)
    {
        abort_unless($customer->team_id === $currentTeam->id, 403);

        $customer->delete();

        return redirect()
            ->route('customers.index', $currentTeam->slug)
            ->with('success', 'Customer deleted successfully.');
    }
}