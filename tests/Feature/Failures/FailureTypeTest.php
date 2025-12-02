<?php

use App\Models\FailureType;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(RoleSeeder::class);

    $this->user = User::factory()->create()->syncRoles("Technical Agent");
    $this->actingAs($this->user);
});

test("failure type index page can be rendered", function () {
    $request = $this->get(route("failureTypes.index"));
    $request->assertOk();
});

test("failure type show page can be rendered", function () {
    $failureType = FailureType::factory()->create();
    $request = $this->get(route("failureTypes.show", $failureType));
    $request->assertOk();
});

test("failure type create page can be rendered", function () {
    $request = $this->get(route("failureTypes.create"));
    $request->assertOk();
});

test("failure type edit page can be rendered", function () {
    $failureType = FailureType::factory()->create();
    $request = $this->get(route("failureTypes.edit", $failureType));
    $request->assertOk();
});

test("failure type can be created", function () {
    $request = $this->post(route("failureTypes.store"), [
        'name' => 'Test Failure Type',
        'severity' => 'High',
    ]);
    $request->assertRedirect(route("failureTypes.index"));
    $this->assertDatabaseHas('failure_types', [
        'name' => 'Test Failure Type',
        'severity' => 'High',
    ]);
});

test("failure type can be updated", function () {
    $failureType = FailureType::factory()->create();
    $request = $this->put(route("failureTypes.update", $failureType), [
        'name' => 'Updated Failure Type',
        'severity' => 'Low',
    ]);
    $request->assertRedirect(route("failureTypes.index"));
    $this->assertDatabaseHas('failure_types', [
        'id' => $failureType->id,
        'name' => 'Updated Failure Type',
        'severity' => 'Low',
    ]);
});

test("failure type can be deleted", function () {
    $failureType = FailureType::factory()->create();
    $request = $this->delete(route("failureTypes.destroy", $failureType));
    $request->assertRedirect(route("failureTypes.index"));
    $this->assertSoftDeleted($failureType);
});
