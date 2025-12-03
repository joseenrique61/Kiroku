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
        $endOfYear = (new \DateTime('last day of December this year'))->setTime(23, 59, 59);

        $outOfServiceDateTime = $this->faker->dateTimeThisYear();
        $backToServiceDateTime = $this->faker->dateTimeBetween(
            $outOfServiceDateTime->format('Y-m-d'),
            $endOfYear->format('Y-m-d')
        );
        $maintenanceDateTime = $this->faker->dateTimeBetween(
            $outOfServiceDateTime->format('Y-m-d'),
            'now'
        );

        // Ensure maintenanceDateTime is strictly after outOfServiceDateTime
        // if ($outOfServiceDateTime->format('Y-m-d') === $maintenanceDateTime->format('Y-m-d')) {
        //     $maintenanceDateTime->modify('+1 day');
        // }

        // Ensure maintenanceDateTime is strictly after outOfServiceDateTime
        // if ($backToServiceDateTime < $outOfServiceDateTime) {
        //     $backToServiceDateTime->modify('+10 day');
        // }

        // Ensure maintenanceDateTime does not exceed the end of the current year
        // if ($maintenanceDateTime > $endOfYear) {
        //     $maintenanceDateTime = $endOfYear;
        // }
        
        // Ensure backToServiceDatetime does not exceed the end of the current year
        // if ($backToServiceDateTime > $endOfYear) {
        //     $backToServiceDateTime = $endOfYear;
        // }

        return [
            'is_preventive' => $this->faker->boolean(),
            'cost' => $this->faker->randomFloat(2, 10, 1000),
            'out_of_service_datetime' => $outOfServiceDateTime->format('Y-m-d'),
            'back_to_service_datetime' => $backToServiceDateTime->format('Y-m-d'),
            'device_id' => Device::factory(),
        ];
    }
}
