<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DeviceBrand>
 */
class DeviceBrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word('Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Sony', 'LG', 'Nokia', 'Motorola', 'OnePlus', 'Oppo'),
        ];
    }
}
