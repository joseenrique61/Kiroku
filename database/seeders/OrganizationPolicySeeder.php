<?php

namespace Database\Seeders;

use App\Models\OrganizationPolicy;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrganizationPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrganizationPolicy::firstOrCreate(
            ['name' => 'Default Policy'],
            ['device_lifespan_policy' => 180]
        );
    }
}
