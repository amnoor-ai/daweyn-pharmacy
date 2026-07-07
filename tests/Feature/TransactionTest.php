<?php

use App\Enums\TeamRole;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Team;
use App\Models\User;

test('a transaction correctly deducts stock and awards loyalty points', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $category = Category::create([
        'team_id' => $team->id,
        'name' => 'Medicine',
        'slug' => 'medicine',
    ]);

    $product = Product::create([
        'team_id' => $team->id,
        'category_id' => $category->id,
        'name' => 'Paracetamol',
        'sku' => 'MED-123',
        'cost_price' => 1.00,
        'selling_price' => 5.00,
        'stock_quantity' => 10,
        'alert_threshold' => 5,
    ]);

    $customer = Customer::create([
        'team_id' => $team->id,
        'name' => 'John Doe',
        'phone' => '1234567890',
        'loyalty_points' => 0,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('transactions.store', ['current_team' => $team->slug]), [
            'customer_id' => $customer->id,
            'payment_method' => 'cash',
            'tax' => 0,
            'discount' => 0,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                ],
            ],
        ]);

    $response->assertRedirect(route('pos.index', $team->slug));

    // Verify stock deduction
    $this->assertEquals(8, $product->fresh()->stock_quantity);

    // Verify loyalty points (total is 5 * 2 = 10, so 10 points)
    $this->assertEquals(10, $customer->fresh()->loyalty_points);

    // Verify transaction exists
    $this->assertDatabaseHas('transactions', [
        'team_id' => $team->id,
        'customer_id' => $customer->id,
        'subtotal' => 10,
        'total' => 10,
        'payment_method' => 'cash',
    ]);

    // Verify transaction item exists
    $this->assertDatabaseHas('transaction_items', [
        'product_id' => $product->id,
        'quantity' => 2,
        'total' => 10,
    ]);
});

test('a transaction fails if there is insufficient stock', function () {
    $user = User::factory()->create();
    $team = Team::factory()->create();
    $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
    $user->update(['current_team_id' => $team->id]);

    $category = Category::create([
        'team_id' => $team->id,
        'name' => 'Medicine',
        'slug' => 'medicine',
    ]);

    $product = Product::create([
        'team_id' => $team->id,
        'category_id' => $category->id,
        'name' => 'Paracetamol',
        'sku' => 'MED-123',
        'cost_price' => 1.00,
        'selling_price' => 5.00,
        'stock_quantity' => 10,
        'alert_threshold' => 5,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('transactions.store', ['current_team' => $team->slug]), [
            'customer_id' => null,
            'payment_method' => 'cash',
            'tax' => 0,
            'discount' => 0,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 15, // Requested more than stock
                ],
            ],
        ]);

    // Expect a 422 Unprocessable Entity due to the abort_if() check
    $response->assertStatus(422);

    // Verify stock is not deducted
    $this->assertEquals(10, $product->fresh()->stock_quantity);

    // Verify no transaction was created
    $this->assertDatabaseCount('transactions', 0);
});
