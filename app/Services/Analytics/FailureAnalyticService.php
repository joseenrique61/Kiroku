<?php

namespace App\Services\Analytics;

use App\Models\Failure;
use App\Services\Analytics\Interfaces\FailureAnalyticServiceInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class FailureAnalyticService implements FailureAnalyticServiceInterface
{
    /**
     * Get the percentage of each failure type out of all failures.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getFailureRateByFailureType(): Collection
    {
        $failuresByType = Failure::join('failure_types', 'failures.failure_type_id', '=', 'failure_types.id')
            ->select('failure_types.name', DB::raw('COUNT(failures.id) as count'))
            ->groupBy('failure_types.name')
            ->get();

        $totalFailures = $failuresByType->sum('count');

        if ($totalFailures === 0) {
            return collect([]);
        }

        return $failuresByType->map(function ($item) use ($totalFailures) {
            return [
                'name' => $item->name,
                'percentage' => round(($item->count / $totalFailures) * 100, 2),
            ];
        });
    }

    /**
     * Get the failure rate for each brand.
     * The rate is calculated as (failures_for_brand / total_maintenances_for_brand) * 100.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getFailureRateByBrand(): Collection
    {
        $statsByBrand = DB::table('device_brands')
            ->leftJoin('device_models', 'device_brands.id', '=', 'device_models.device_brand_id')
            ->leftJoin('devices', function ($join) {
                $join->on('device_models.id', '=', 'devices.device_model_id')
                    ->whereNull('devices.deleted_at');
            })
            ->leftJoin('maintenances', function ($join) {
                $join->on('devices.id', '=', 'maintenances.device_id')
                    ->whereNull('maintenances.deleted_at');
            })
            ->leftJoin('failures', 'maintenances.id', '=', 'failures.maintenance_id')
            ->select(
                'device_brands.name',
                DB::raw('COUNT(DISTINCT maintenances.id) as total_maintenances'),
                DB::raw('COUNT(DISTINCT failures.id) as failure_count')
            )
            ->groupBy('device_brands.name')
            ->get();

        return $statsByBrand->map(function ($item) {
            $percentage = ($item->total_maintenances > 0)
                ? round(($item->failure_count / $item->total_maintenances) * 100, 2)
                : 0.0;

            return [
                'name' => $item->name,
                'percentage' => $percentage,
            ];
        });
    }
}