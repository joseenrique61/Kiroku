<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::create(['name' => 'Administrator']);
        $technicalRole = Role::create(['name' => 'Technical Agent']);
        $supervisorRole = Role::create(['name' => 'IT Supervisor']);
        $guestRole = Role::create(['name' => 'Guest']);

        // Synchronize permissions for the Administrator
        $adminRole->syncPermissions([
            'view-users',
            'create-users',
            'update-users',
            'delete-users',
            'manage-roles',
            'view-audit-logs',
        ]);

        // Synchronize permissions for the Technical Agent
        $technicalRole->syncPermissions([
            'view-devices',
            'create-devices',
            'update-devices',
            'delete-devices',
            'import-devices',
            'manage-device-categories',
            'manage-device-models',
            'manage-device-brands',
            'manage-device-acquisitions',
            'view-maintenances',
            'create-maintenances',
            'update-maintenances',
            'delete-maintenances',
            'view-failures',
            'create-failures',
            'update-failures',
            'delete-failures',
        ]);

        // Synchronize permissions for the IT Supervisor
        $supervisorRole->syncPermissions([
            'view-dashboard',
            'view-organization-policies',
            'manage-organization-policies',
        ]);
    }
}
