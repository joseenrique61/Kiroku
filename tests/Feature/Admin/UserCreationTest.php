<?php

use App\Models\Organization;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('creation user screen can be rendered', function () {
    $this->actingAs($user = User::factory()->create());

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
        'organization_id' => $adminUser->organization_id,
        'role_id' => $role->id
    ];

    $response = $this->actingAs($adminUser)->post(route('users.store'), $userData);

    $response->assertRedirect(route('users.index', absolute: false));
});