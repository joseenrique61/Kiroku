<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            OrganizationPolicySeeder::class,
            OrganizationSeeder::class,
            PermissionSeeder::class,
            UserSeeder::class,
            DeviceStatusSeeder::class,
            DeviceBrandSeeder::class,
            DeviceCategorySeeder::class,
            DeviceModelSeeder::class,
            FailureTypeSeeder::class,
            MaintenanceSeeder::class
        ]);
    }
}
