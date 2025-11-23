<?php

# This class contains methods to analyze device usage data.
# It provides insights into failure rates, mean time to repair and the state of each device.
namespace App\Services\Analytics;
use App\Models\Device;
use App\Models\Maintenance;

class DeviceAnalyticsService
{
    /**
     * Calculate the failure rate of a device.
     *
     * @param Device $device
     * @return float
     */
    public function getFailureTrend(): float
    {
        $totalOperations = $device->operations_count;
        $failedOperations = $device->failed_operations_count;

        if ($totalOperations === 0) {
            return 0.0;
        }

        return ($failedOperations / $totalOperations) * 100;
    }

    /**
     * Get the mean time to repair (MTTR) for a device.
     *
     * @param Device $device
     * @return float
     */
    public function getMeanTimeToRepair(): float
    {
        $maintenances = Maintenance::with('device')
            ->whereNotNull('completed_at')
            ->get();
    }

    /**
     * Get the current state of the device.
     *
     * @param Device $device
     * @return string
     */
    public function getDeviceCountByStatus(): array
    {
        $status = [];

        $deviceStatuses = Device::select('device_status_id')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('device_status_id')
            ->get();
        
        foreach ($deviceStatuses as $deviceStatus) {
            $status[$deviceStatus->device_status_id] = $deviceStatus->count;
        }

        return $status;
    }
}
