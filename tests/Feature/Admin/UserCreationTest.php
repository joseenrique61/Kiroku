<?php

use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(RoleSeeder::class);

    $this->user = User::factory()->create()->syncRoles("Administrator");
    $this->actingAs($this->user);
});

test('creation user screen can be rendered', function () {
    $this->get(route('users.create'))->assertOk();
});

test('new users can be registered', function () {
    
    $adminUser = User::factory()->create();

    $role = Role::firstOrCreate(['name' => 'Standard User'], 
        ['guard_name' => 'web'
    ]);

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'organization_id' => $this->user->organization_id,
        'role_id' => $role->id
    ];

    $response = $this->post(route('users.store'), $userData);

    $response->assertRedirect(route('users.index', absolute: false));
});