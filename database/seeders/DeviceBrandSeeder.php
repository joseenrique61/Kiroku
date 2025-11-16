<?php

namespace Database\Seeders;

use App\Models\DeviceBrand;
use Illuminate\Database\Seeder;

class DeviceBrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $brands = [
            ['name' => 'Apple'],
            ['name' => 'Dell'],
            ['name' => 'HP'],
            ['name' => 'Lenovo'],
            ['name' => 'Samsung'],
            ['name' => 'Asus'],
        ];

        foreach ($brands as $brand) {
            DeviceBrand::firstOrCreate($brand);
        }
    }
}
