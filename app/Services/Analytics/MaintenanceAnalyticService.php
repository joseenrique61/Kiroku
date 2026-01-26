<?php

namespace App\Services\Analytics;

use App\Models\DeviceBrand;
use App\Models\DeviceCategory;
use App\Models\Maintenance;
use App\Services\Analytics\Interfaces\MaintenanceAnalyticServiceInterface;
use Illuminate\Support\Collection;

class MaintenanceAnalyticService implements MaintenanceAnalyticServiceInterface
{
    /**
     * Get the mean time to repair (MTTR) of all Devices.
     *
     * @param null
     * @return float
     */
    public function getMeanTimeToRepair(): float
    {
        $maintenances = Maintenance::with('device')
            ->whereNotNull('back_to_service_datetime')
            ->get();

        if ($maintenances->isEmpty()) {
            return 0.0;
        }

        $totalRepairTime = 0;
        $repairCount = $maintenances->count();

        foreach ($maintenances as $maintenance) {
            $repairTime = $maintenance->out_of_service_datetime->diffInHours($maintenance->back_to_service_datetime);
            $totalRepairTime += $repairTime;
        }

        return $totalRepairTime / $repairCount;
    }

    /**
     * Get the mean time to repair (MTTR) for each device category.
     *
     * @return array
     */
    public function getMeanTimeToRepairByDeviceCategory(): array
    {
        $maintenances = Maintenance::with('device.deviceCategory')
            ->whereNotNull('back_to_service_datetime')
            ->get();

        $groupedByCategory = $maintenances->groupBy('device.deviceCategory.name')
            ->filter(fn($group, $key) => $key !== null);

        $allCategoryNames = DeviceCategory::pluck('name');

        return $allCategoryNames->map(function ($categoryName) use ($groupedByCategory) {
            $group = $groupedByCategory->get($categoryName);

            if (!$group) {
                return ['name' => $categoryName, 'mttr' => 0.0];
            }

            $totalRepairTime = $group->sum(function ($maintenance) {
                return $maintenance->out_of_service_datetime->diffInHours($maintenance->back_to_service_datetime);
            });

            $repairCount = $group->count();
            $mttr = ($repairCount > 0) ? $totalRepairTime / $repairCount : 0.0;

            return [
                'name' => $categoryName,
                'mttr' => round($mttr, 2),
            ];
        })->sortBy('name')->values()->toArray();
    }

    /**
     * Get the mean time to repair (MTTR) for each device brand.
     *
     * @return array
     */
    public function getMeanTimeToRepairByDeviceBrand(): array
    {
        $maintenances = Maintenance::with('device.deviceModel.deviceBrand')
            ->whereNotNull('back_to_service_datetime')
            ->get();

        $groupedByBrand = $maintenances->groupBy('device.deviceModel.deviceBrand.name')
            ->filter(fn($group, $key) => $key !== null);

        $allBrandNames = DeviceBrand::pluck('name');

        return $allBrandNames->map(function ($brandName) use ($groupedByBrand) {
            $group = $groupedByBrand->get($brandName);

            if (!$group) {
                return ['name' => $brandName, 'mttr' => 0.0];
            }

            $totalRepairTime = $group->sum(function ($maintenance) {
                return $maintenance->out_of_service_datetime->diffInHours($maintenance->back_to_service_datetime);
            });

            $repairCount = $group->count();
            $mttr = ($repairCount > 0) ? $totalRepairTime / $repairCount : 0.0;

            return [
                'name' => $brandName,
                'mttr' => round($mttr, 2),
            ];
        })->sortBy('name')->values()->toArray();
    }
}