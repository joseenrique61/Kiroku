<?php

namespace App\Services\Analytics\Interfaces;

use Illuminate\Support\Collection;

interface MaintenanceAnalyticServiceInterface 
{
    public function getMeanTimeToRepair() : float;

    public function getMeanTimeToRepairByDeviceCategory(): Collection;

    public function getMeanTimeToRepairByDeviceBrand(): Collection;
}