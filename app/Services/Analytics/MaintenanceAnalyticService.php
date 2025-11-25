<?php

namespace App\Services\Analytics;

use App\Models\DeviceCategory;
use App\Models\Maintenance;

class MaintenanceAnalyticService
{
    /**
     * Get the mean time to repair (MTTR) of all Devices.
     *
     * @param null
     * @return float
     */
    public function getMeanTimeToRepair() : float
    {
        $maintenances = Maintenance::with('device')
            ->whereNotNull('back_to_service_datetime')
            ->get();

        if ($maintenances->isEmpty()) {
            return 0.0;
        }

        $totalRepairTime = 0;
        $repairCount = 0;

        foreach ($maintenances as $maintenance) {
            $repairTime = $maintenance->back_to_service_datetime->diffInHours($maintenance->out_of_service_datetime);
            $totalRepairTime += $repairTime;
            $repairCount++;
        }

        return $totalRepairTime / $repairCount;
    }

    /**
     * Get the mean time to repair (MTTR) for a device.
     *
     * @param DeviceCategory $deviceCategory
     * @return float
     */
    public function getMeanTimeToRepairByDeviceCategory(DeviceCategory $deviceCategory) : float
    {
        $maintenances = Maintenance::with('device')
            ->whereNotNull('back_to_service_datetime')
            ->whereHas('device', function ($query) use ($deviceCategory) {
                $query->where('device_category_id', $deviceCategory->id);
            })
            ->get();

        if ($maintenances->isEmpty()) {
            return 0.0;
        }

        $totalRepairTime = 0;
        $repairCount = 0;

        foreach ($maintenances as $maintenance) {
            $repairTime = $maintenance->back_to_service_datetime->diffInHours($maintenance->out_of_service_datetime);
            $totalRepairTime += $repairTime;
            $repairCount++;
        }

        return $totalRepairTime / $repairCount;
    }
}