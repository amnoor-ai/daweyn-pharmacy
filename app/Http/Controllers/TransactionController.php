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
        $products = $currentTeam->products()
        ->where('stock_quantity', '>', 0)
        ->orderBy('name')
        ->get();

        $customers = $currentTeam->customers()
        ->orderBy('name')
        ->get();

        return Inertia::render('pos/index', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request, Team $currentTeam)
    {
        $validated = $request->validate([
            'customer_id'               => ['nullable', 'exists:customers,id'],
            'payment_method'            => ['required', 'in:cash,zaad,evc,jeeb,card'],
            'discount'                  => ['numeric', 'min:0'],
            'tax'                       => ['numeric', 'min:0'],
            'items'                     => ['required', 'array', 'min:1'],
            'items.*.product_id'        => ['required', 'exists:products,id'],
            'items.*.quantity'          => ['required', 'integer', 'min:1'],
        ]);

        $transaction = DB::transaction(function () use ($validated, $currentTeam, $request) {
            // Calculate totals
            $subtotal = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = $currentTeam->products()->lockForUpdate()->findOrFail($item['product_id']);

                // Check stock
                abort_if($product->stock_quantity < $item['quantity'], 422, "Insufficient stock for {$product->name}");

                $lineTotal = $product->selling_price * $item['quantity'];
                $subtotal += $lineTotal;

                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $product->selling_price,
                    'total'      => $lineTotal,
                ];

                // Decrement stock
                $product->decrement('stock_quantity', $item['quantity']);
            }

            $tax      = $validated['tax'] ?? 0;
            $discount = $validated['discount'] ?? 0;
            $total    = $subtotal + $tax - $discount;

            // Generate invoice number
            $invoiceNumber = 'INV-' . str_pad(
                $currentTeam->transactions()->count() + 1,
                4, '0', STR_PAD_LEFT
            );

            // Create transaction
            $transaction = $currentTeam->transactions()->create([
                'customer_id'    => $validated['customer_id'] ?? null,
                'cashier_id'     => auth()->id(),
                'invoice_number' => $invoiceNumber,
                'subtotal'       => $subtotal,
                'tax'            => $tax,
                'discount'       => $discount,
                'total'          => $total,
                'payment_method' => $validated['payment_method'],
            ]);

            // Create transaction items
            $transaction->items()->createMany($itemsData);

            return $transaction;
        });

        if ($validated['customer_id'] ?? null) {
            $points = (int) floor($transaction->total);
            if ($points > 0) {
                \App\Models\Customer::find($validated['customer_id'])?->increment('loyalty_points', $points);
            }
        }

        return redirect()
            ->route('pos.index', $currentTeam->slug)
            ->with('success', 'Transaction recorded successfully.');
    }
}