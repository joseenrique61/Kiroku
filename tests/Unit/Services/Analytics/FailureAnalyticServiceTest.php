<?php

use App\Models\Device;
use App\Models\DeviceBrand;
use App\Models\DeviceModel;
use App\Models\Failure;
use App\Models\FailureType;
use App\Models\Maintenance;
use App\Services\Analytics\FailureAnalyticService;
use Database\Seeders\DeviceCategorySeeder;
use Database\Seeders\DeviceStatusSeeder;
use Database\Seeders\OrganizationPolicySeeder;
use Database\Seeders\OrganizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->service = new FailureAnalyticService();

    $this->seed(DeviceStatusSeeder::class);
    $this->seed(DeviceCategorySeeder::class);
    $this->seed(OrganizationSeeder::class);
});

// getFailureRateByFailureType
test('getFailureRateByFailureType returns empty when no failures', function () {
    $result = $this->service->getFailureRateByFailureType();
    expect(count($result) == 0)->toBeTrue();
});

test('getFailureRateByFailureType calculates correctly', function () {
    $typeA = FailureType::factory()->create(['name' => 'Type A']);
    $typeB = FailureType::factory()->create(['name' => 'Type B']);
    $brandA = DeviceBrand::factory()->create(['name' => 'Brand A']);
    $modelA = DeviceModel::factory()->create(['device_brand_id' => $brandA->id]);
    $device = Device::factory()->create();

    // 6 failures of Type A
    Maintenance::factory(6)->create(['device_id' => $device->id])
        ->each(function ($maintenance) use ($typeA) {
            Failure::factory()->create([
                'maintenance_id' => $maintenance->id,
                'failure_type_id' => $typeA->id,
            ]);
        });

    // 4 failures of Type B
    Maintenance::factory(4)->create(['device_id' => $device->id])
        ->each(function ($maintenance) use ($typeB) {
            Failure::factory()->create([
                'maintenance_id' => $maintenance->id,
                'failure_type_id' => $typeB->id,
            ]);
        });

    $result = $this->service->getFailureRateByFailureType();

    expect($result)->toHaveCount(2)
        ->and($result[0]['name'])->toBe('Type A')
        ->and($result[0]['percentage'])->toBe(60.0)
        ->and($result[1]['name'])->toBe('Type B')
        ->and($result[1]['percentage'])->toBe(40.0);
});


// getFailureRateByBrand
test('getFailureRateByBrand calculates correctly', function () {
    $typeA = FailureType::factory()->create(['name' => 'Type A']);

    // Brand A: 10 maintenances, 2 failures -> 20%
    $brandA = DeviceBrand::factory()->create(['name' => 'Brand A']);
    $modelA = DeviceModel::factory()->create(['device_brand_id' => $brandA->id]);
    $deviceA = Device::factory()->create(['device_model_id' => $modelA->id]);
    Maintenance::factory(8)->create(['device_id' => $deviceA->id]); // No failure
    Maintenance::factory(2)->create(['device_id' => $deviceA->id])
        ->each(function ($maintenance) {
            Failure::factory()->create(['maintenance_id' => $maintenance->id]);
        });

    // Brand B: 5 maintenances, 4 failures -> 80%
    $brandB = DeviceBrand::factory()->create(['name' => 'Brand B']);
    $modelB = DeviceModel::factory()->create(['device_brand_id' => $brandB->id]);
    $deviceB = Device::factory()->create(['device_model_id' => $modelB->id]);
    Maintenance::factory(1)->create(['device_id' => $deviceB->id]); // No failure
    Maintenance::factory(4)->create(['device_id' => $deviceB->id])
        ->each(function ($maintenance) {
            Failure::factory()->create(['maintenance_id' => $maintenance->id]);
        });
    
    // Brand C: No maintenances -> 0%
    DeviceBrand::factory()->create(['name' => 'Brand C']);

    $result = $this->service->getFailureRateByBrand();

    expect($result)->toHaveCount(3)
        ->and($result[0]['name'])->toBe('Brand A')
        ->and($result[0]['percentage'])->toBe(20.0)
        ->and($result[1]['name'])->toBe('Brand B')
        ->and($result[1]['percentage'])->toBe(80.0)
        ->and($result[2]['name'])->toBe('Brand C')
        ->and($result[2]['percentage'])->toBe(0.0);
});