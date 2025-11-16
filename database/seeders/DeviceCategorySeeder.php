<?php

namespace Database\Seeders;

use App\Models\DeviceCategory;
use Illuminate\Database\Seeder;

class DeviceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Laptop'],
            ['name' => 'Desktop'],
            ['name' => 'Tablet'],
            ['name' => 'Phone'],
            ['name' => 'Printer'],
            ['name' => 'Monitor'],
        ];

        foreach ($categories as $category) {
            DeviceCategory::firstOrCreate(['name' => $category['name']], $category);
        }
    }
}
