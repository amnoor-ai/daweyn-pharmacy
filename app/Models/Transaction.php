<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $team_id
 * @property int|null $customer_id
 * @property int $cashier_id
 * @property string $invoice_number
 * @property float $subtotal
 * @property float $tax
 * @property float $discount
 * @property float $total
 * @property string $payment_method
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Team $team
 * @property-read Customer|null $customer
 * @property-read User $cashier
 * @property-read \Illuminate\Database\Eloquent\Collection<int, TransactionItem> $items
 */
#[Fillable([
    'team_id',
    'customer_id',
    'cashier_id',
    'invoice_number',
    'subtotal',
    'tax',
    'discount',
    'total',
    'payment_method',
])]
class Transaction extends Model
{
    use HasFactory;

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }
}