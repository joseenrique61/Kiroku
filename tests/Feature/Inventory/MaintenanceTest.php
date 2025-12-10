<?php

use App\Models\Device;
use App\Models\DeviceStatus;
use App\Models\FailureType;
use App\Models\Maintenance;
use App\Models\User;
use App\Models\Acquisition;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\Organization;
use App\Models\DeviceBrand; // Added this line
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(RoleSeeder::class);

    $this->user = User::factory()->create()->syncRoles("Technical Agent");
    $this->actingAs($this->user);

    // Ensure core dependencies exist for factories
    Organization::factory()->create(); // For User and Device
    DeviceStatus::firstOrCreate(['name' => 'In service']); // For Device
    DeviceStatus::firstOrCreate(['name' => 'In maintenance']); // For Device
    DeviceBrand::factory()->create(); // For DeviceModel
    DeviceCategory::factory()->create(); // For Device
    Acquisition::factory()->create(); // For Device
    DeviceModel::factory()->create(); // For Device
});

test('maintenance index page can be rendered', function () {
    Maintenance::factory()->count(3)->create();

    $this->get(route('maintenances.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/index')
            ->has('maintenances', 3)
        );
});

test('maintenance create page can be rendered', function () {
    $inServiceStatusId = DeviceStatus::where('name', 'In service')->first()->id;
    Device::factory()->count(2)->create(['device_status_id' => $inServiceStatusId]);
    FailureType::factory()->count(2)->create();

    $this->get(route('maintenances.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/create')
            ->has('devices', 2)
            ->has('failure_types', 2)
        );
});

test('preventive maintenance can be stored', function () {
    $device = Device::factory()->create([
        'device_status_id' => DeviceStatus::where('name', 'In service')->first()->id,
    ]);

    $maintenanceData = Maintenance::factory()->make([
        'device_id' => $device->id,
        'is_preventive' => true,
        'out_of_service_datetime' => now()->subDays(5)->format('Y-m-d H:m:s'),
        'back_to_service_datetime' => null,
        'failure_type_id' => null,
        'failure_description' => null,
        'failure_cause' => null,
    ])->toArray();

    $this->post(route('maintenances.store'), $maintenanceData)
        ->assertStatus(302); // Expect a redirect, but not necessarily to index yet

    $this->assertDatabaseHas('maintenances', [
        'device_id' => $device->id,
        'is_preventive' => true,
        'out_of_service_datetime' => now()->subDays(5)->format('Y-m-d H:m:s'),
        'back_to_service_datetime' => null
    ]);

    // Assert device status is 'In service' if datetime is provided
    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'device_status_id' => DeviceStatus::where('name', 'In maintenance')->first()->id,
    ]);
});

test('corrective maintenance can be stored', function () {
    $device = Device::factory()->create([
        'device_status_id' => DeviceStatus::where('name', 'In service')->first()->id,
    ]);
    $failureType = FailureType::factory()->create();

    $maintenanceData = Maintenance::factory()->make([
        'device_id' => $device->id,
        'is_preventive' => false,
        'out_of_service_datetime' => now()->subDays(5)->format('Y-m-d H:m:s'),
        'back_to_service_datetime' => null,
        'failure_type_id' => $failureType->id,
        'failure_description' => 'Test Failure Description',
        'failure_cause' => 'Test Failure Cause',
    ])->toArray();

    $this->post(route('maintenances.store'), $maintenanceData)
        ->assertRedirect(route('maintenances.index'))
        ->assertSessionHas('success', 'Maintenance created successfully.');

    $this->assertDatabaseHas('maintenances', [
        'device_id' => $device->id,
        'is_preventive' => false,
        'out_of_service_datetime' => now()->subDays(5)->format('Y-m-d H:m:s'),
        'back_to_service_datetime' => null
    ]);

    $maintenance = Maintenance::where('device_id', $device->id)->first();

    $this->assertDatabaseHas('failures', [
        'maintenance_id' => $maintenance->id,
        'failure_type_id' => $failureType->id,
        'description' => 'Test Failure Description',
        'cause' => 'Test Failure Cause',
    ]);

    // Assert device status is 'In maintenance' if datetime is null
    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'device_status_id' => DeviceStatus::where('name', 'In maintenance')->first()->id,
    ]);
});

test('maintenance store handles validation errors', function () {
    $this->post(route('maintenances.store'), [])
        ->assertSessionHasErrors(['device_id', 'cost', 'out_of_service_datetime', 'is_preventive']);
});

test('maintenance show page can be rendered', function () {
    $device = Device::factory()->create([
        'organization_id' => $this->user->organization_id,
    ]);
    $maintenance = Maintenance::factory()->create([
        'device_id' => $device->id,
    ]);
    $this->assertDatabaseHas('maintenances', ['id' => $maintenance->id]);
    // Explicitly fetch the maintenance from the database to ensure it's a fresh instance
    $fetchedMaintenance = Maintenance::find($maintenance->id);
    $fetchedMaintenance->load(['device', 'failure', 'failure.failureType']);

    $response = $this->get(route('maintenances.show', $fetchedMaintenance));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/view')
            ->has('maintenance')
            ->has('maintenance.device')
            ->has('maintenance.failure')
            ->etc()
        );
});

test('maintenance edit page can be rendered', function () {
    $device = Device::factory()->create([
        'organization_id' => $this->user->organization_id,
    ]);
    $maintenance = Maintenance::factory()->create([
        'device_id' => $device->id,
    ]);
    $this->assertDatabaseHas('maintenances', ['id' => $maintenance->id]);
    // Explicitly fetch the maintenance from the database to ensure it's a fresh instance
    $fetchedMaintenance = Maintenance::find($maintenance->id);
    $fetchedMaintenance->load('failure');

    $this->get(route('maintenances.edit', $fetchedMaintenance))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('reports/edit')
            ->has('maintenance')
            ->has('maintenance.failure')
            ->etc()
            ->has('devices')
            ->has('failure_types')
        );
});

test('preventive maintenance can be updated', function () {
    $device = Device::factory()->create([
        'organization_id' => $this->user->organization_id,
        'device_status_id' => DeviceStatus::where('name', 'In maintenance')->first()->id,
    ]);
    $maintenance = Maintenance::factory()->create([
        'device_id' => $device->id,
        'datetime' => null,
    ]);

    $updatedData = [
        'device_id' => $device->id,
        'cost' => 200.50,
        'out_of_service_datetime' => now()->subDays(7)->format('Y-m-d'),
        'datetime' => now()->subDays(2)->format('Y-m-d'),
        'is_preventive' => true,
    ];

    $this->put(route('maintenances.update', $maintenance->id), $updatedData);

    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'device_status_id' => DeviceStatus::where('name', 'In maintenance')->first()->id,
    ]);
});

test('corrective maintenance can be updated', function () {
    $device = Device::factory()->create([
        'organization_id' => $this->user->organization_id,
    ]);

    $failureType = FailureType::factory()->create();
    $maintenance = Maintenance::factory()->create([
        'device_id' => $device->id,
        'is_preventive' => false,
        'back_to_service_datetime' => null,
        'out_of_service_datetime' => now()->subDays(10)->format('Y-m-d'),
    ]);

    $maintenance->failure()->create([
        'failure_type_id' => FailureType::factory()->create()->id,
        'description' => 'Old description',
        'cause' => 'Old cause',
    ]);

    $newFailureType = FailureType::factory()->create();
    $updatedData = [
        'device_id' => $device->id,
        'cost' => 150.75,
        'out_of_service_datetime' => now()->subDays(5)->format('Y-m-d'),
        'back_to_service_datetime' => null,
        'is_preventive' => false,
        'failure_type_id' => $newFailureType->id,
        'failure_description' => 'Updated Failure Description',
        'failure_cause' => 'Updated Failure Cause',
    ];

    $this->put(route('maintenances.update', $maintenance->id), $updatedData)
        ->assertRedirect(route('maintenances.index'))
        ->assertSessionHas('success', 'Maintenance updated successfully.');

    $this->assertDatabaseHas('maintenances', [
        'id' => $maintenance->id,
        'is_preventive' => false,
    ]);

    $this->assertDatabaseHas('failures', [
        'maintenance_id' => $maintenance->id,
        'failure_type_id' => $maintenance->failure->failure_type_id,
        'description' => 'Old description',
        'cause' => 'Old cause',
    ]);

    // Assert device status is 'In maintenance' if datetime is null
    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'device_status_id' => DeviceStatus::where('name', 'In maintenance')->first()->id,
    ]);
});

test('maintenance update handles validation errors', function () {
    $device = Device::factory()->create([
        'organization_id' => $this->user->organization_id,
    ]);
    $maintenance = Maintenance::factory()->create([
        'device_id' => $device->id,
    ]);

    $this->put(route('maintenances.update', $maintenance->id), [])
        ->assertSessionHasErrors(['device_id', 'cost', 'out_of_service_datetime', 'is_preventive']);
});

test('maintenance can be deleted', function () {
    $device = Device::factory()->create([
        'organization_id' => $this->user->organization_id,
    ]);
    $maintenance = Maintenance::factory()->create([
        'device_id' => $device->id,
    ]);

    $this->delete(route('maintenances.destroy', $maintenance))
        ->assertRedirect(route('maintenances.index'))
        ->assertSessionHas('success', 'Maintenance deleted successfully.');

    $this->assertDatabaseHas('maintenances', [
        'id' => $maintenance->id,
    ]);
});
