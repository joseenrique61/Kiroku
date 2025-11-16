<?php

namespace Database\Factories;

use App\Models\Acquisition;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\DeviceStatus;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'serial_number' => $this->faker->unique()->ean13(),
            'description' => $this->faker->optional()->sentence(),
            'device_model_id' => DeviceModel::inRandomOrder()->first()->id,
            'device_status_id' => DeviceStatus::inRandomOrder()->first()->id,
            'device_category_id' => DeviceCategory::inRandomOrder()->first()->id,
            'acquisition_id' => Acquisition::factory(),
            'organization_id' => Organization::first()->id,
        ];
    }
}
