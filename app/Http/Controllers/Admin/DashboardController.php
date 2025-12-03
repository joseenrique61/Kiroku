<?php

namespace App\Http\Controllers\Admin;

use App\Services\Analytics\DeviceAnalyticService;
use App\Services\Analytics\FailureAnalyticService;
use App\Services\Analytics\MaintenanceAnalyticService;
use App\Services\Analytics\PredictiveAnalyticService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends BaseController
{
    public function __construct(protected PredictiveAnalyticService $predictive_analytic, protected FailureAnalyticService $failure_analytic, protected MaintenanceAnalyticService $maintenance_analytic, protected DeviceAnalyticService $device_analytic)
    {
        $this->middleware('permission:view-dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $months = $request->input("months", 3);

        return Inertia::render('admin/dashboard', [
            'deviceCountByStatus' => $this->device_analytic->getDeviceCountByStatus(),
            'mostCommonModels' => $this->device_analytic->mostCommonModels(),
            'predictiveRiskList' => function () use ($months) {
                return $this->predictive_analytic->getPredictiveRiskList($months);
            },
            'failureRateByFailureType' => $this->failure_analytic->getFailureRateByFailureType(),
            'failureRateByBrand' => $this->failure_analytic->getFailureRateByBrand(),
            'generalMttr' => $this->maintenance_analytic->getMeanTimeToRepair(),
            'mttrByCategory' => $this->maintenance_analytic->getMeanTimeToRepairByDeviceCategory(),
            'mttrByBrand' => $this->maintenance_analytic->getMeanTimeToRepairByDeviceBrand()
        ]);
    }
}