<?php

namespace Database\Seeders;


use App\Models\DeviceBrand;
use App\Models\DeviceModel;
use Illuminate\Database\Seeder;

class DeviceModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apple = DeviceBrand::where('name', 'Apple')->first();
        $dell = DeviceBrand::where('name', 'Dell')->first();

        if (!$apple || !$dell) {
            $this->command->warn('Please run DeviceBrandSeeder before running DeviceModelSeeder.');
            return;
        }

        $models = [
            [
                'name' => 'MacBook Pro 16',
                'device_brand_id' => $apple->id,
            ],
            [
                'name' => 'XPS 15',
                'device_brand_id' => $dell->id,
            ],
            [
                'name' => 'iPhone 15 Pro',
                'device_brand_id' => $apple->id,
            ],
        ];

        foreach ($models as $model) {
            DeviceModel::firstOrCreate(['name' => $model['name']], $model);
        }
    }
}