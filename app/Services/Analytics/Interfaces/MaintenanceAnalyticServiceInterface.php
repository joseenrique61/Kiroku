<?php

namespace App\Services\Analytics\Interfaces;

use Illuminate\Support\Collection;

interface MaintenanceAnalyticServiceInterface
{
    public function getMeanTimeToRepair(): float;

    public function getMeanTimeToRepairByDeviceCategory(): array;

    public function getMeanTimeToRepairByDeviceBrand(): array;
}