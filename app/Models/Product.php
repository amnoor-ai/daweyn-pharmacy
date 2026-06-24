<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $team_id
 * @property int $category_id
 * @property string $sku
 * @property string $name
 * @property string|null $description
 * @property float $cost_price
 * @property float $selling_price
 * @property int $stock_quantity
 * @property int $alert_threshold
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Team $team
 * @property-read Category $category
 */

#[Fillable([
    'team_id',
    'category_id',
    'sku',
    'name',
    'description',
    'cost_price',
    'selling_price',
    'stock_quantity',
    'alert_threshold',
])]

class Product extends Model {
    use HasFactory;    

    public function team(): BelongsTo {
        return $this->belongsTo(Team::class);
    }

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }
}
