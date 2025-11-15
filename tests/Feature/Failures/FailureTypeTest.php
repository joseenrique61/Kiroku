<?php

use App\Models\FailureType;
use App\Models\User;

test("failure type index page can be rendered", function () {
    $request = $this->actingAs(User::factory()->create())->get(route("failureTypes.index"));
    $request->assertOk();
});

test("failure type show page can be rendered", function () {
    $failureType = FailureType::factory()->create();
    $request = $this->actingAs(User::factory()->create())->get(route("failureTypes.show", $failureType));
    $request->assertOk();
});

test("failure type create page can be rendered", function () {
    $request = $this->actingAs(User::factory()->create())->get(route("failureTypes.create"));
    $request->assertOk();
});

test("failure type edit page can be rendered", function () {
    $failureType = FailureType::factory()->create();
    $request = $this->actingAs(User::factory()->create())->get(route("failureTypes.edit", $failureType));
    $request->assertOk();
});

test("failure type can be created", function () {
    $request = $this->actingAs(User::factory()->create())->post(route("failureTypes.store"), [
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
    $request = $this->actingAs(User::factory()->create())->put(route("failureTypes.update", $failureType), [
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
    $request = $this->actingAs(User::factory()->create())->delete(route("failureTypes.destroy", $failureType));
    $request->assertRedirect(route("failureTypes.index"));
    $this->assertDatabaseMissing('failure_types', [
        'id' => $failureType->id,
    ]);
});
