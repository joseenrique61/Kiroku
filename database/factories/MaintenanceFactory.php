<?php

namespace Database\Factories;

use App\Models\Device;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Maintenance>
 */
class MaintenanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_preventive' => $this->faker->boolean(),
            'cost' => $this->faker->randomFloat(2, 10, 1000),
            'datetime' => $this->faker->dateTimeThisYear(),
            'out_of_service_datetime' => $this->faker->dateTimeThisYear(),
            'device_id' => Device::factory(),
        ];
    }
}
