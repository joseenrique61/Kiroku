<?php 

use App\Models\Acquisition;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\DeviceStatus;
use App\Models\User;

test('update device screen can be rendered', function () {
    // --- Preparación ---
    // 1. Crea las dependencias primero (Org y User)
    $user = User::factory()->create();

    // 2. ¡Loguea al usuario AHORA!
    $this->actingAs($user);

    // 3. Ahora crea el dispositivo. El trait Auditable
    //    encontrará al $user logueado y guardará el log.
    $device = Device::factory()->create(['organization_id' => $user->organization_id]);
    
    // --- Actuación y Afirmación ---
    $this->get(route('devices.edit', $device))->assertOk();
});

test('the device can be update', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $device = Device::factory()->create();
    
    $updatedAcquisition = Acquisition::factory()->create();
    $updatedCategory = DeviceCategory::factory()->create();
    $updatedModel = DeviceModel::factory()->create();
    $updatedStatus = DeviceStatus::factory()->create();
    $updatedDescription = 'Mi dispositivo de prueba ha sido actualizado';

    $deviceData = [
        'description' => 'Mi dispositivo de prueba',
        'acquisition_id' => $updatedAcquisition->id,
        'organization_id' => $user->organization_id,
        'device_category_id' => $updatedCategory->id,
        'device_model_id' => $updatedModel->id,
        'device_status_id' => $updatedStatus->id,
        'description' => $updatedDescription
    ];

    $response = $this->put(route('devices.update', $device), $deviceData);

    $response->assertRedirect(route('devices.index', absolute: false));
});