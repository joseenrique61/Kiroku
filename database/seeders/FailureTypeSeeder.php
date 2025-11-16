<?php

namespace Database\Seeders;

use App\Models\FailureType;
use Illuminate\Database\Seeder;

class FailureTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Software Issue', 'severity' => 'Low'],
            ['name' => 'Hardware Malfunction', 'severity' => 'High'],
            ['name' => 'Accidental Damage', 'severity' => 'Medium'],
            ['name' => 'Connectivity Problem', 'severity' => 'Low'],
        ];

        foreach ($types as $type) {
            FailureType::firstOrCreate(['name' => $type['name']], $type);
        }
    }
}
