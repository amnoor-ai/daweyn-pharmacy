<?php

namespace App\Actions;

use App\Models\Team;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class CreatePosTransactionAction
{
    public function execute(array $data, Team $currentTeam): Transaction
    {
        $transaction = DB::transaction(function () use ($data, $currentTeam) {
            // Calculate totals
            $subtotal = 0;
            $itemsData = [];

            foreach ($data['items'] as $item) {
                $product = $currentTeam->products()->lockForUpdate()->findOrFail($item['product_id']);

                // Check stock
                abort_if($product->stock_quantity < $item['quantity'], 422, "Insufficient stock for {$product->name}");

                // Check expiry
                if ($product->expiry_date && \Illuminate\Support\Carbon::parse($product->expiry_date)->startOfDay()->isPast()) {
                    abort(422, "Product {$product->name} has expired and cannot be sold.");
                }

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

            $tax      = $data['tax'] ?? 0;
            $discount = $data['discount'] ?? 0;
            $total    = $subtotal + $tax - $discount;

            // Generate invoice number
            $invoiceNumber = 'INV-' . str_pad(
                $currentTeam->transactions()->count() + 1,
                4, '0', STR_PAD_LEFT
            );

            // Create transaction
            $transaction = $currentTeam->transactions()->create([
                'customer_id'    => $data['customer_id'] ?? null,
                'cashier_id'     => auth()->id(),
                'invoice_number' => $invoiceNumber,
                'subtotal'       => $subtotal,
                'tax'            => $tax,
                'discount'       => $discount,
                'total'          => $total,
                'payment_method' => $data['payment_method'],
            ]);

            // Create transaction items
            $transaction->items()->createMany($itemsData);

            return $transaction;
        });

        if ($data['customer_id'] ?? null) {
            $points = (int) floor($transaction->total);
            if ($points > 0) {
                \App\Models\Customer::find($data['customer_id'])?->increment('loyalty_points', $points);
            }
        }

        return $transaction;
    }
}
