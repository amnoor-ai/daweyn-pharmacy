<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Team;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PharmacyDemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Team 1 and User exist to satisfy foreign key constraints
        $team = Team::find(1);
        if (!$team) {
            $team = Team::create([
                'id' => 1,
                'name' => 'Daaweyn Pharmacy Somaliland',
                'slug' => 'daaweyn-pharmacy',
                'is_personal' => false,
            ]);
        }

        // Ensure standard users exist
        $admin = User::firstOrCreate(['email' => 'admin@daaweyn.com'], [
            'name' => 'Admin (Dr. Ahmed)',
            'password' => bcrypt('password'),
        ]);

        $pharmacist = User::firstOrCreate(['email' => 'pharmacist@daaweyn.com'], [
            'name' => 'Pharmacist (Dr. Ali)',
            'password' => bcrypt('password'),
        ]);

        $cashier = User::firstOrCreate(['email' => 'cashier@daaweyn.com'], [
            'name' => 'Cashier (Hassan)',
            'password' => bcrypt('password'),
        ]);

        $testUser = User::firstOrCreate(['email' => 'test@example.com'], [
            'name' => 'Test User',
            'password' => bcrypt('password'),
        ]);

        $users = [$admin, $pharmacist, $cashier, $testUser];

        foreach ($users as $u) {
            $hasMember = DB::table('team_members')
                ->where('team_id', $team->id)
                ->where('user_id', $u->id)
                ->exists();

            if (!$hasMember) {
                $role = 'cashier';
                if ($u->email === 'admin@daaweyn.com' || $u->email === 'test@example.com') {
                    $role = 'owner';
                } elseif ($u->email === 'pharmacist@daaweyn.com') {
                    $role = 'pharmacist';
                }

                $team->members()->attach($u->id, ['role' => $role]);
            }

            // Ensure their current team is set to the demo team
            if ($u->current_team_id !== $team->id) {
                $u->current_team_id = $team->id;
                $u->save();
            }
        }

        // For transactions, use the cashier user
        $user = $cashier;

        // 2. Seed 10 Categories
        $categoriesData = [
            ['name' => 'Antibiotics', 'desc' => 'Medicines used to treat bacterial infections.'],
            ['name' => 'Painkillers', 'desc' => 'Analgesics and pain relievers for various pain levels.'],
            ['name' => 'Vitamins & Supplements', 'desc' => 'Essential nutrients to support daily health and diet.'],
            ['name' => 'Antivirals', 'desc' => 'Medicines specifically used for treating viral infections.'],
            ['name' => 'Antihistamines', 'desc' => 'Allergy relief treatments and allergy blocking pills.'],
            ['name' => 'Cardiovascular', 'desc' => 'Medicines for blood pressure and heart care.'],
            ['name' => 'Diabetic Care', 'desc' => 'Treatments and supplies for glucose and diabetes control.'],
            ['name' => 'Dermatologicals', 'desc' => 'Topical creams and treatments for skin issues.'],
            ['name' => 'Gastrointestinal', 'desc' => 'Digestive relief, antacids, and stomach care remedies.'],
            ['name' => 'Respiratory', 'desc' => 'Inhalers, syrups, and relief for respiratory tracts.'],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $slug = Str::slug($cat['name']);
            // Avoid duplicate slugs under the same team
            $existing = Category::where('team_id', $team->id)->where('slug', $slug)->first();
            if ($existing) {
                $categories[] = $existing;
            } else {
                $categories[] = Category::create([
                    'team_id' => $team->id,
                    'name' => $cat['name'],
                    'slug' => $slug,
                    'description' => $cat['desc'],
                ]);
            }
        }

        // 3. Seed 30 Products
        $productsData = [
            // Antibiotics (Index 0)
            ['cat_idx' => 0, 'name' => 'Amoxicillin 500mg', 'sku' => 'ANT-AMX-500', 'cost' => 4.50, 'sell' => 9.99, 'stock' => 120, 'alert' => 15],
            ['cat_idx' => 0, 'name' => 'Azithromycin 250mg', 'sku' => 'ANT-AZI-250', 'cost' => 6.20, 'sell' => 14.50, 'stock' => 85, 'alert' => 10],
            ['cat_idx' => 0, 'name' => 'Ciprofloxacin 500mg', 'sku' => 'ANT-CPR-500', 'cost' => 3.80, 'sell' => 8.75, 'stock' => 150, 'alert' => 20],
            ['cat_idx' => 0, 'name' => 'Augmentin 625mg', 'sku' => 'ANT-AUG-625', 'cost' => 12.00, 'sell' => 24.99, 'stock' => 40, 'alert' => 8],
            
            // Painkillers (Index 1)
            ['cat_idx' => 1, 'name' => 'Paracetamol 500mg', 'sku' => 'PNK-PAR-500', 'cost' => 0.50, 'sell' => 2.00, 'stock' => 500, 'alert' => 50],
            ['cat_idx' => 1, 'name' => 'Ibuprofen 400mg', 'sku' => 'PNK-IBU-400', 'cost' => 1.20, 'sell' => 3.50, 'stock' => 300, 'alert' => 30],
            ['cat_idx' => 1, 'name' => 'Diclofenac Sodium 50mg', 'sku' => 'PNK-DIC-50', 'cost' => 2.10, 'sell' => 5.00, 'stock' => 180, 'alert' => 20],
            ['cat_idx' => 1, 'name' => 'Tramadol 50mg', 'sku' => 'PNK-TRA-50', 'cost' => 3.50, 'sell' => 9.00, 'stock' => 70, 'alert' => 10],
            
            // Vitamins & Supplements (Index 2)
            ['cat_idx' => 2, 'name' => 'Vitamin C 1000mg Effervescent', 'sku' => 'VIT-C-1000', 'cost' => 3.00, 'sell' => 7.99, 'stock' => 90, 'alert' => 12],
            ['cat_idx' => 2, 'name' => 'Vitamin D3 5000 IU', 'sku' => 'VIT-D3-5K', 'cost' => 5.50, 'sell' => 12.50, 'stock' => 110, 'alert' => 15],
            ['cat_idx' => 2, 'name' => 'Omega-3 Fish Oil 1000mg', 'sku' => 'VIT-OMG-3', 'cost' => 7.00, 'sell' => 16.99, 'stock' => 60, 'alert' => 10],
            ['cat_idx' => 2, 'name' => 'Zinc 50mg Tablets', 'sku' => 'VIT-ZNC-50', 'cost' => 2.00, 'sell' => 5.50, 'stock' => 140, 'alert' => 15],
            
            // Antivirals (Index 3)
            ['cat_idx' => 3, 'name' => 'Acyclovir 400mg', 'sku' => 'VIR-ACY-400', 'cost' => 5.00, 'sell' => 11.20, 'stock' => 80, 'alert' => 10],
            ['cat_idx' => 3, 'name' => 'Oseltamivir 75mg (Tamiflu)', 'sku' => 'VIR-TAM-75', 'cost' => 18.00, 'sell' => 39.99, 'stock' => 30, 'alert' => 5],
            
            // Antihistamines (Index 4)
            ['cat_idx' => 4, 'name' => 'Cetirizine 10mg', 'sku' => 'HIS-CET-10', 'cost' => 0.80, 'sell' => 3.00, 'stock' => 250, 'alert' => 25],
            ['cat_idx' => 4, 'name' => 'Loratadine 10mg', 'sku' => 'HIS-LOR-10', 'cost' => 1.00, 'sell' => 3.50, 'stock' => 220, 'alert' => 20],
            
            // Cardiovascular (Index 5)
            ['cat_idx' => 5, 'name' => 'Atorvastatin 20mg', 'sku' => 'CRD-ATR-20', 'cost' => 8.50, 'sell' => 19.99, 'stock' => 100, 'alert' => 15],
            ['cat_idx' => 5, 'name' => 'Amlodipine 5mg', 'sku' => 'CRD-AML-5', 'cost' => 2.00, 'sell' => 6.00, 'stock' => 160, 'alert' => 20],
            ['cat_idx' => 5, 'name' => 'Metoprolol Tartrate 50mg', 'sku' => 'CRD-MET-50', 'cost' => 4.20, 'sell' => 9.50, 'stock' => 95, 'alert' => 12],
            ['cat_idx' => 5, 'name' => 'Lisinopril 10mg', 'sku' => 'CRD-LIS-10', 'cost' => 3.00, 'sell' => 7.80, 'stock' => 130, 'alert' => 18],
            
            // Diabetic Care (Index 6)
            ['cat_idx' => 6, 'name' => 'Metformin 850mg', 'sku' => 'DIA-MET-850', 'cost' => 1.50, 'sell' => 5.00, 'stock' => 350, 'alert' => 40],
            ['cat_idx' => 6, 'name' => 'Gliclazide 80mg', 'sku' => 'DIA-GLI-80', 'cost' => 3.10, 'sell' => 8.50, 'stock' => 90, 'alert' => 15],
            ['cat_idx' => 6, 'name' => 'Novomix 30 Flexpen', 'sku' => 'DIA-NOV-30', 'cost' => 22.00, 'sell' => 45.00, 'stock' => 5, 'alert' => 10], // Trigger low stock warning
            
            // Dermatologicals (Index 7)
            ['cat_idx' => 7, 'name' => 'Hydrocortisone Cream 1%', 'sku' => 'DER-HYD-1', 'cost' => 1.80, 'sell' => 4.99, 'stock' => 110, 'alert' => 15],
            ['cat_idx' => 7, 'name' => 'Ketoconazole Cream 2%', 'sku' => 'DER-KET-2', 'cost' => 2.50, 'sell' => 6.80, 'stock' => 80, 'alert' => 10],
            
            // Gastrointestinal (Index 8)
            ['cat_idx' => 8, 'name' => 'Omeprazole 20mg', 'sku' => 'GAS-OME-20', 'cost' => 1.50, 'sell' => 4.50, 'stock' => 280, 'alert' => 30],
            ['cat_idx' => 8, 'name' => 'Loperamide 2mg', 'sku' => 'GAS-LOP-2', 'cost' => 0.60, 'sell' => 2.50, 'stock' => 200, 'alert' => 20],
            ['cat_idx' => 8, 'name' => 'Antacid Chewable Tablets', 'sku' => 'GAS-ANT-CHW', 'cost' => 1.10, 'sell' => 3.99, 'stock' => 170, 'alert' => 20],
            
            // Respiratory (Index 9)
            ['cat_idx' => 9, 'name' => 'Salbutamol Inhaler 100mcg', 'sku' => 'RES-SAL-100', 'cost' => 3.50, 'sell' => 8.00, 'stock' => 150, 'alert' => 20],
            ['cat_idx' => 9, 'name' => 'Fluticasone Nasal Spray', 'sku' => 'RES-FLT-NS', 'cost' => 7.20, 'sell' => 16.50, 'stock' => 3, 'alert' => 5], // Trigger low stock warning
        ];

        $products = [];
        foreach ($productsData as $prod) {
            $catId = $categories[$prod['cat_idx']]->id;
            
            $existing = Product::where('team_id', $team->id)->where('sku', $prod['sku'])->first();
            if ($existing) {
                $products[] = $existing;
            } else {
                $color = substr(md5($prod['name']), 0, 6);
                $initials = strtoupper(substr($prod['name'], 0, 2));
                
                $products[] = Product::create([
                    'team_id' => $team->id,
                    'category_id' => $catId,
                    'sku' => $prod['sku'],
                    'image_path' => null, // Let the accessor handle it using UI Avatars, no need to download files in seeder to keep it fast
                    'name' => $prod['name'],
                    'description' => 'Reliable pharmacy option for ' . $prod['name'] . '.',
                    'cost_price' => $prod['cost'],
                    'selling_price' => $prod['sell'],
                    'stock_quantity' => $prod['stock'],
                    'alert_threshold' => $prod['alert'],
                ]);
            }
        }

        // 4. Seed 10 Customers
        $customersData = [
            ['name' => 'Mohamoud Farah', 'phone' => '+252 63 4567890'],
            ['name' => 'Faduma Ibrahim', 'phone' => '+252 63 1234567'],
            ['name' => 'Abdirahman Ali', 'phone' => '+252 63 7788990'],
            ['name' => 'Hassan Omar', 'phone' => '+252 63 3334455'],
            ['name' => 'Khadra Ahmed', 'phone' => '+252 63 8889900'],
            ['name' => 'Yusuf Duale', 'phone' => '+252 63 2223344'],
            ['name' => 'Sahra Muse', 'phone' => '+252 63 5556677'],
            ['name' => 'Mustafe Warsame', 'phone' => '+252 63 9990011'],
            ['name' => 'Amina Egal', 'phone' => '+252 63 4445566'],
            ['name' => 'Guled Osman', 'phone' => '+252 63 6667788'],
        ];

        $customers = [];
        foreach ($customersData as $cust) {
            $existing = Customer::where('team_id', $team->id)->where('phone', $cust['phone'])->first();
            if ($existing) {
                $customers[] = $existing;
            } else {
                $emailSlug = Str::slug($cust['name']);
                $customers[] = Customer::create([
                    'team_id' => $team->id,
                    'name' => $cust['name'],
                    'email' => $emailSlug . '@daaweyn-test.com',
                    'phone' => $cust['phone'],
                    'address' => 'Hargeisa, Somaliland',
                    'loyalty_points' => rand(5, 120),
                ]);
            }
        }

        // 5. Seed 20 Transactions spread across the last 30 days
        $paymentMethods = ['cash', 'zaad', 'evc', 'jeeb'];
        
        for ($i = 1; $i <= 20; $i++) {
            // Pick a random customer or make it a walk-in (null customer_id)
            $customer = (rand(1, 10) > 3) ? $customers[array_rand($customers)] : null;
            $customerId = $customer ? $customer->id : null;
            
            // Random date in the last 30 days
            $createdAt = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 24))->subMinutes(rand(0, 59));
            
            // Pick 1 to 4 random unique products
            $txProducts = array_rand($products, rand(1, 4));
            if (!is_array($txProducts)) {
                $txProducts = [$txProducts];
            }
            
            $itemsData = [];
            $subtotal = 0.0;
            
            foreach ($txProducts as $pIdx) {
                $product = $products[$pIdx];
                $quantity = rand(1, 3);
                
                if ($product->stock_quantity < $quantity) {
                    $quantity = $product->stock_quantity;
                }
                
                if ($quantity <= 0) {
                    continue;
                }
                
                $totalPrice = $product->selling_price * $quantity;
                
                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->selling_price,
                    'total' => $totalPrice,
                ];
                
                $subtotal += $totalPrice;

                // Safely decrement inventory stock quantity in DB
                $product->decrement('stock_quantity', $quantity);
            }
            
            if (count($itemsData) === 0) {
                continue;
            }
            
            $tax = round($subtotal * 0.05, 2); // 5% tax
            $discount = (rand(1, 10) > 8) ? round($subtotal * 0.10, 2) : 0.00; // 10% discount 20% of the time
            $total = $subtotal + $tax - $discount;
            
            $invoiceNumber = 'INV-' . strtoupper(Str::random(3)) . rand(1000, 9999);
            
            $transaction = Transaction::create([
                'team_id' => $team->id,
                'customer_id' => $customerId,
                'cashier_id' => $user->id,
                'invoice_number' => $invoiceNumber,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Add transaction items
            foreach ($itemsData as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['total'],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
            }
        }
    }
}
