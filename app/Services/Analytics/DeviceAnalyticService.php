<?php

# This class contains methods to analyze device usage data.
# It provides insights into failure rates, mean time to repair and the state of each device.
namespace App\Services\Analytics;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Models\DeviceStatus;

class DeviceAnalyticService
{
    /**
     * Get the current state of the device.
     *
     * @param null
     * @return array
     */
    public function getDeviceCountByStatus(): array
    {
        $devices = DeviceStatus::query()
            ->leftJoin('devices', 'device_statuses.id', '=', 'devices.device_status_id')
            ->select('device_statuses.name as name')
            ->selectRaw('COUNT(devices.id) as count')
            ->groupBy('device_statuses.id', 'device_statuses.name')
            ->orderBy('count', 'desc')
            ->get();

        return $devices->pluck('count', 'name')->toArray();
    }

    /**
     * Get the current state of the device by Category.
     *
     * @param DeviceCategory $deviceCategory
     * @return array
     */
    public function getDeviceStatusByCategory(DeviceCategory $deviceCategory): array
    {
        $devices = DeviceStatus::query()
            ->leftJoin('devices', 'device_statuses.id', '=', 'devices.device_status_id')
            ->where('devices.device_category_id', $deviceCategory->id)
            ->select('device_statuses.name as name')
            ->selectRaw('COUNT(devices.id) as count')
            ->groupBy('device_statuses.id', 'device_statuses.name')
            ->orderBy('count', 'desc')
            ->get();

        return $devices->pluck('count', 'name')->toArray();
    }

    /**
     * Get the number of devices wiht warranty about to expire
     *
     * @param null
     * @return int
     */
    public function getDeviceWarrantyAboutExpire(): int
    {
        $devices = Device::with('aqquisition')
            ->whereHas('acquisition', function ($query) {
                $query->where('warranty_end_date', '>=', now());
            })
            ->selectRaw('COUNT(*) as count')
            ->get();
        
        return $devices->count;
    }

    /**
     * Get the number of devices wiht warranty expired
     *
     * @param null
     * @return int
     */
    public function getDeviceWarrantyExpired(): int
    {
        $devices = Device::with('aqquisition')
            ->whereHas('acquisition', function ($query) {
                $query->where('warranty_end_date', '<=', now());
            })
            ->selectRaw('COUNT(*) as count')
            ->get();
        
        return $devices->count;
    }
}
