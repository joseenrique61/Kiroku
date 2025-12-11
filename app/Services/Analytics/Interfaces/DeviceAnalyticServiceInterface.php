<?php

namespace App\Services\Analytics\Interfaces;

use App\Models\DeviceCategory;
use Illuminate\Support\Collection;

interface DeviceAnalyticServiceInterface
{
    public function getDeviceCountByStatus();

    public function getDeviceStatusByCategory(DeviceCategory $deviceCategory): array;

    public function getDeviceWarrantyAboutExpire(): int;

    public function getDeviceWarrantyExpired(): int;

    public function mostCommonModels(): array;
}