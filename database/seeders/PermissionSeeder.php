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

        Permission::create(['name' => 'ver-usuarios']);
        Permission::create(['name' => 'crear-usuarios']);
        Permission::create(['name' => 'actualizar-usuarios']);
        Permission::create(['name' => 'eliminar-usuarios']);

        Permission::create(['name' => 'ver-roles']);
        Permission::create(['name' => 'crear-roles']);
        Permission::create(['name' => 'actualizar-roles']);
        Permission::create(['name' => 'eliminar-roles']);

        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());      
    }
}
