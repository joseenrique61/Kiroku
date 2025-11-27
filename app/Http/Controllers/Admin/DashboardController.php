<?php

namespace App\Http\Controllers\Admin;

use App\Services\Analytics\PredictiveAnalyticService;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends BaseController
{
    public function __construct(protected PredictiveAnalyticService $predictive_analytic)
    {
        $this->middleware('permission:view-dashboard');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $predictiveRiskList = $this->predictive_analytic->getPredictiveRiskList(3);

        return Inertia::render('admin/dashboard', [
            'predictiveRiskList' => $predictiveRiskList,
        ]);
    }
}