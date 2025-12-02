<?php 

use App\Models\Acquisition;
use App\Models\DeviceBrand;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\DeviceStatus;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(RoleSeeder::class);

    $this->user = User::factory()->create()->syncRoles("Technical Agent");
    $this->actingAs($this->user);
});

test('creation device screen can be rendered', function () {
    $this->get(route('devices.create'))->assertOk();
});

test('new devices can be registered', function () {
    $acquisition = Acquisition::factory()->create();
    $category = DeviceCategory::factory()->create();
    $brand = DeviceBrand::factory()->create();
    $model = DeviceModel::factory()->create();
    $status = DeviceStatus::factory()->create();

    $deviceData = [
        'serial_number' => 'SN-1234567890',
        'description' => 'Mi dispositivo de prueba',
        'acquisition_id' => $acquisition->id,
        'device_category_id' => $category->id,
        'device_model_id' => $model->id,
        'device_status_id' => $status->id
    ];

    $response = $this->post(route('devices.store'), $deviceData);

    $response->assertRedirect(route('home', absolute: false));
});