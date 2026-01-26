<?php

namespace App\Services;

use App\Models\DeviceCategory;

class DeviceService implements DeviceServiceInterface
{
    public function getAllDeviceCategories() : array
    {
        $categories = DeviceCategory::get();

        return $categories->toArray();
    }
}
