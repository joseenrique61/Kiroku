<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\OrganizationPolicy;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizationPolicy = OrganizationPolicy::firstOrCreate(
            ['name' => 'Default Policy'],
            ['device_lifespan_policy' => 180]
        );
        Organization::firstOrCreate(
            ['name' => 'Default Organization'],
            ['organization_policy_id' => $organizationPolicy->id]
        );
    }
}
