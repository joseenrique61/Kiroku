<?php

namespace Database\Seeders;

use App\Models\DeviceStatus;
use Illuminate\Database\Seeder;

class DeviceStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'In service'],
            ['name' => 'In maintenance'],
            ['name' => 'Out of service'],
        ];

        foreach ($statuses as $status) {
            DeviceStatus::firstOrCreate($status);
        }
    }
}
