<?php

namespace App\Services;

use App\Models\DeviceCategory;

interface DeviceServiceInterface
{
    public function getAllDeviceCategories(): array;
}
