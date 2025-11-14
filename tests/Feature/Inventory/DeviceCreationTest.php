<?php 

use App\Models\Acquisition;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\DeviceStatus;
use App\Models\User;

test('creation device screen can be rendered', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('devices.create'))->assertOk();
});

test('new devices can be registered', function () {
    $user = User::factory()->create();

    $acquisition = Acquisition::factory()->create();
    $category = DeviceCategory::factory()->create();
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

    $response = $this->actingAs($user)->post(route('devices.store'), $deviceData);

    $response->assertRedirect(route('devices.index', absolute: false));
});