<?php

namespace Database\Factories;

use App\Models\FailureType;
use App\Models\Maintenance;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Failure>
 */
class FailureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(),
            'cause' => $this->faker->sentence(),
            'failure_type_id' => FailureType::inRandomOrder()->first()->id,
            'maintenance_id' => Maintenance::factory(),
        ];
    }
}
