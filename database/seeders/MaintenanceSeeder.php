<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\Failure;
use App\Models\FailureType;
use App\Models\Maintenance;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have devices and failure types to associate
        if (Device::count() === 0) {
            Device::factory(10)->create();
        }
        if (FailureType::count() === 0) {
            FailureType::factory(5)->create();
        }

        $devices = Device::all();
        $failureTypes = FailureType::all();

        // Create 5 preventive maintenances (no failure)
        Maintenance::factory(5)->create([
            'is_preventive' => true,
            'device_id' => fn () => $devices->random()->id,
        ]);

        // Create 5 non-preventive (corrective) maintenances with failures
        Maintenance::factory(5)
            ->create([
                'is_preventive' => false,
                'device_id' => fn () => $devices->random()->id,
            ])
            ->each(function ($maintenance) use ($failureTypes) {
                Failure::factory()->create([
                    'maintenance_id' => $maintenance->id,
                    'failure_type_id' => $failureTypes->random()->id,
                ]);
            });
    }
}
