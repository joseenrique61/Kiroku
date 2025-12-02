<?php

namespace App\Services\Analytics;

use App\Models\FailureType;
use App\Models\Maintenance;
use Illuminate\Support\Facades\DB;

class FailureAnalyticService
{
    /**
     * Calculate the failure rate of a device.
     *
     * @param null
     * @return float
     */
    public function getFailureTrend(): float
    {
        $maintenance = Maintenance::with(['failure', 'failure.failureType'])
            ->selectRaw('COUNT(*) as count')
            ->get();

        $totalOperations = $maintenance->count;

        foreach ($maintenance as $record) {
            if ($record->failure) {
                $failedOperations = $failedOperations ?? 0;
                $failedOperations++;
            }
        }

        if ($totalOperations === 0) {
            return 0.0;
        }

        return ($failedOperations / $totalOperations) * 100;
    }

    /**
     * Calculate the failure rate of a device by Category.
     *
     * @param FailureType $failureType
     * @return float
     */
    public function getFailureTrendByType(FailureType $failureType): float
    {
        $maintenance = Maintenance::with(['failure', 'failure.failureType'])
            ->whereHas('failure.failureType', function ($query) use ($failureType) {
                $query->where('id', $failureType->id);
            })
            ->selectRaw('COUNT(*) as count')
            ->get();

        $totalOperations = $maintenance->count;

        foreach ($maintenance as $record) {
            if ($record->failure) {
                $failedOperations = $failedOperations ?? 0;
                $failedOperations++;
            }
        }

        if ($totalOperations === 0) {
            return 0.0;
        }

        return ($failedOperations / $totalOperations) * 100;
    }

    /**
     * Calculate the failure rate of a device by Category.
     *
     * @param null
     * @return float
     */
    public function getFailureTrendByBrands(): float
    {
        $maintenances = DB::table('maintenances')
            ->leftJoin('failures','maintenances.id','=','failures.maintenance_id')
            ->join('devices','maintenances.device_id','=','devices.id')
            ->join('device_models','devices.device_model_id','=','devices.id')
            ->select('device_models.name', DB::raw('count(devices.id) as total'))
            ->get();

        $totalOperations = $maintenances->count;

        foreach ($maintenances as $maintenance) {
            $failedOperations = $failedOperations ?? 0;
            $failedOperations++;
        }

        if ($totalOperations === 0) {
            return 0.0;
        }

        return ($failedOperations / $totalOperations) * 100;
    }
}