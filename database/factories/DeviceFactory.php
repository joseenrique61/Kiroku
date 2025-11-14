<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
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
            'serial_number' => fake()->unique()->bothify('SN-##########'),
            'acquisition_id' => \App\Models\Acquisition::factory(),
            'organization_id' => \App\Models\Organization::factory(),
            'device_category_id' => \App\Models\DeviceCategory::factory(),
            'device_model_id' => \App\Models\DeviceModel::factory(),
            'device_status_id' => \App\Models\DeviceStatus::factory(),
            'description' => fake()->sentence(),
        ];
    }
}
