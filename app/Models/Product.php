<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $team_id
 * @property int $category_id
 * @property string $sku
 * @property string|null $image_path
 * @property string $name
 * @property string|null $description
 * @property float $cost_price
 * @property float $selling_price
 * @property int $stock_quantity
 * @property int $alert_threshold
 * @property string|null $expiry_date
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $image_url
 * @property-read Team $team
 * @property-read Category $category
 */

#[Fillable([
    'team_id',
    'category_id',
    'sku',
    'image_path',
    'name',
    'description',
    'cost_price',
    'selling_price',
    'stock_quantity',
    'alert_threshold',
    'expiry_date',
])]


class Product extends Model {
    use HasFactory, SoftDeletes;    

    protected $appends = [
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    /**
     * Get the URL for the product's image.
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->image_path) {
                    return Storage::disk('public')->url($this->image_path);
                }

                // Placeholder using the product name initials
                $name = urlencode($this->name);
                return "https://ui-avatars.com/api/?name={$name}&color=7F9CF5&background=EBF4FF";
            },
        );
    }

    public function team(): BelongsTo {
        return $this->belongsTo(Team::class);
    }

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }
}
