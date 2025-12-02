<?php

namespace App\Http\Controllers\Admin;

use App\Services\Analytics\PredictiveAnalyticService;
use Illuminate\Http\Request;
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
    public function index(Request $request): Response
    {
        $months = $request->input("months", 3);

        return Inertia::render('admin/dashboard', [
            'predictiveRiskList' => function () use ($months) {
                return $this->predictive_analytic->getPredictiveRiskList($months);
            },
        ]);
    }
}