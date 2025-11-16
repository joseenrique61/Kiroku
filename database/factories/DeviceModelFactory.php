<?php

namespace Database\Factories;

use App\Models\DeviceBrand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DeviceModel>
 */
class DeviceModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'device_brand_id' => DeviceBrand::inRandomOrder()->first()->id,
        ];
    }
}
