<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\DeviceStatus;
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
        $in_maintenance_id = DeviceStatus::where('name', '=', 'In maintenance')->first()->id;

        $devices = [];
        // Ensure we have devices and failure types to associate
        if (Device::count() === 0) {
            $in_service_id = DeviceStatus::where('name', '=', 'In service')->first()->id;
            Device::factory(10)->create(['device_status_id' => $in_service_id]);

            $devices = Device::factory(10)->create(['device_status_id' => $in_maintenance_id]);
        } else {
            $devices = Device::where('device_status_id', '=', $in_maintenance_id)->get();
        }

        if (FailureType::count() === 0) {
            FailureType::factory(5)->create();
        }

        $failureTypes = FailureType::all();

        // Create 5 preventive maintenances (no failure)
        for ($i = 0; $i < 5; $i++) {
            Maintenance::factory()->create([
                'is_preventive' => true,
                'device_id' => $devices[$i]->id
            ]);
        }

        // Create 5 non-preventive (corrective) maintenances with failures
        for ($i = 5; $i < 10; $i++) {
            Maintenance::factory()
                ->create([
                    'is_preventive' => false,
                    'device_id' => $devices[$i]->id
                ])
                ->each(function ($maintenance) use ($failureTypes) {
                    Failure::factory()->create([
                        'maintenance_id' => $maintenance->id,
                        'failure_type_id' => $failureTypes->random()->id,
                    ]);
                });
        }
    }
}
