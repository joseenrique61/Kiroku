<?php

namespace Database\Factories;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Acquisition>
 */
class AcquisitionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $acquire_date = Carbon::createFromTimestamp(rand(Carbon::create(2020, 1, 1)->timestamp, Carbon::create(2024,1,1)->timestamp));

        return [
            'price' => $this->faker->randomFloat(2, 100, 5000),
            'acquired_at' => $acquire_date,
            'warranty_end_date' => $acquire_date->addYear(),
        ];
    }
}
