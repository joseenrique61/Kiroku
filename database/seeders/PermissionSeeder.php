<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /** 
     * Run the database seeds. 
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /** Administrator permissions */
        Permission::create(['name' => 'view-users']);
        Permission::create(['name' => 'create-users']);
        Permission::create(['name' => 'update-users']);
        Permission::create(['name' => 'delete-users']);
        Permission::create(['name' => 'manage-roles']);
        Permission::create(['name' => 'view-audit-logs']);

        /** Technical Agent Role */
        Permission::create(['name' => 'view-devices']);
        Permission::create(['name' => 'create-devices']);
        Permission::create(['name' => 'update-devices']);
        Permission::create(['name' => 'delete-devices']);
        Permission::create(['name' => 'import-devices']);
        Permission::create(['name' => 'manage-device-categories']);
        Permission::create(['name' => 'manage-device-models']);
        Permission::create(['name' => 'manage-device-brands']);
        Permission::create(['name' => 'manage-device-acquisitions']);
        
        Permission::create(['name' => 'view-maintenances']);
        Permission::create(['name' => 'create-maintenances']);
        Permission::create(['name' => 'update-maintenances']);
        Permission::create(['name' => 'delete-maintenances']);
        
        Permission::create(['name' => 'view-failures']);
        Permission::create(['name' => 'create-failures']);
        Permission::create(['name' => 'update-failures']);
        Permission::create(['name' => 'delete-failures']);
        
        /** IT Supervisor Role*/
        Permission::create(['name' => 'view-dashboard']);
        Permission::create(['name' => 'view-organization-policies']);
        Permission::create(['name' => 'manage-organization-policies']);
    }
}
