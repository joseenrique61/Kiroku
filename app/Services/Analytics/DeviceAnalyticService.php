<?php

# This class contains methods to analyze device usage data.
# It provides insights into failure rates, mean time to repair and the state of each device.
namespace App\Services\Analytics;
use App\Models\Device;
use App\Models\DeviceCategory;
use App\Models\DeviceStatus;
use Illuminate\Support\Facades\DB;

class DeviceAnalyticService
{
    /**
     * Get the current state of the device.
     *
     * @param null
     * @return array
     */
    public function getDeviceCountByStatus()
    {
        $devices = DeviceStatus::query()
            ->leftJoin('devices', 'device_statuses.id', '=', 'devices.device_status_id')
            ->select('device_statuses.name as name')
            ->selectRaw('COUNT(devices.id) as count')
            ->groupBy('device_statuses.id', 'device_statuses.name')
            ->orderBy('count', 'desc')
            ->get();

        return $devices->map(function ($item) {
            return [
                "name" => $item->name,
                "count" => $item->count
            ];
        });
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
                $query->where('warranty_end_date', '<=', now());
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
                $query->where('warranty_end_date', '>=', now());
            })
            ->selectRaw('COUNT(*) as count')
            ->get();
        
        return $devices->count;
    }

    /**
     * Get the number of the top 5 most common models
     *
     * @param null
     * @return array
     */
    public function mostCommonModels(): array
    {
        $deviceModels = DB::table('device_models')
            ->join('devices','device_models.id','=','devices.device_model_id')
            ->select('device_models.name', DB::raw('count(devices.id) as total'))
            ->groupBy('device_models.id','device_models.name')
            ->limit(5)
            ->get();

        foreach ($deviceModels as $deviceModel) {

            $results[] = [
                'model_name' => $deviceModel->name,
                'quantity' => (int) $deviceModel->total, 
            ];
        }

        return $results;
    }
}
