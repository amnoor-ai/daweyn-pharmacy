<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request, Team $currentTeam)
    {
        $q = $request->query('q', '');

        $customers = $currentTeam->customers()
            ->withSum('transactions', 'total')
            ->withMax('transactions', 'created_at')
            ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
                $q2->where('name', 'like', "%{$q}%")
                   ->orWhere('phone', 'like', "%{$q}%")
                   ->orWhere('email', 'like', "%{$q}%");
            }))
            ->orderBy('name')
            ->get();

        return Inertia::render('customers/index', [
            'customers' => $customers,
            'search' => $q,
        ]);
    }

    public function show(Team $currentTeam, Customer $customer)
    {
        abort_unless($customer->team_id === $currentTeam->id, 403);

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
        ]);

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
        ]);

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