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
        $outOfServiceDateTime = $this->faker->dateTimeThisYear();
        $maintenanceDateTime = $this->faker->dateTimeBetween(
            $outOfServiceDateTime->format('Y-m-d'),
            'now'
        );

        // Ensure maintenanceDateTime is strictly after outOfServiceDateTime
        if ($outOfServiceDateTime->format('Y-m-d') === $maintenanceDateTime->format('Y-m-d')) {
            $maintenanceDateTime->modify('+1 day');
        }

        // Ensure maintenanceDateTime does not exceed the end of the current year
        $endOfYear = (new \DateTime('last day of December this year'))->setTime(23, 59, 59);
        if ($maintenanceDateTime > $endOfYear) {
            $maintenanceDateTime = $endOfYear;
        }

        return [
            'is_preventive' => $this->faker->boolean(),
            'cost' => $this->faker->randomFloat(2, 10, 1000),
            'datetime' => $maintenanceDateTime->format('Y-m-d'),
            'out_of_service_datetime' => $outOfServiceDateTime->format('Y-m-d'),
            'device_id' => Device::factory(),
        ];
    }
}
