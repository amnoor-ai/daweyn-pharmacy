<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request, Team $currentTeam)
    {
        $q = $request->query('q', '');

        $transactions = $currentTeam->transactions()
            ->with(['customer', 'cashier', 'items.product'])
            ->when($q, fn ($query) => $query->where(function ($q2) use ($q) {
                $q2->where('invoice_number', 'like', "%{$q}%")
                   ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$q}%"));
            }))
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'search' => $q,
        ]);
    }

    public function show(Team $currentTeam, Transaction $transaction)
    {
        abort_unless($transaction->team_id === $currentTeam->id, 403);

        $transaction->load(['customer', 'cashier', 'items.product']);

        return Inertia::render('transactions/show', [
            'transaction' => $transaction,
        ]);
    }

    public function create(Team $currentTeam)
    {
        $products = $currentTeam->products()
            ->where('stock_quantity', '>', 0)
            ->orderBy('name')
            ->get();

        $customers = $currentTeam->customers()
            ->orderBy('name')
            ->get();

        return Inertia::render('transactions/create', [
            'products'  => $products,
            'customers' => $customers,
        ]);
    }

    public function pos(Team $currentTeam)
    {
        return Inertia::render('pos/index');
    }

    public function store(\App\Http\Requests\StoreTransactionRequest $request, Team $currentTeam, \App\Actions\CreatePosTransactionAction $action)
{
    $validated = $request->validated();

    $transaction = $action->execute($validated, $currentTeam);

    return redirect()
        ->route('pos.index', $currentTeam->slug)
        ->with('toast', [
            'type' => 'success',
            'message' => "Sale completed — {$transaction->invoice_number} · \${$transaction->total}",
        ]);
}
}