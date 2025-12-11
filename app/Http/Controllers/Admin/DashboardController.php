<?php

namespace App\Http\Controllers\Admin;

use App\Services\Analytics\Interfaces\DeviceAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\FailureAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\MaintenanceAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\PredictiveAnalyticServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends BaseController
{
    public function __construct(protected PredictiveAnalyticServiceInterface $predictive_analytic, protected FailureAnalyticServiceInterface $failure_analytic, protected MaintenanceAnalyticServiceInterface $maintenance_analytic, protected DeviceAnalyticServiceInterface $device_analytic)
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