<?php

namespace App\Http\Controllers;

use App\Services\Analytics\Interfaces\FailureAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\PredictiveAnalyticServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller as BaseController;

class ApiController extends BaseController
{
    public function __construct(protected FailureAnalyticServiceInterface $failure_analytic, protected PredictiveAnalyticServiceInterface $predictive_analytic) {}

    /**
     * Display a listing of the resource.
     */
    public function failure_prediction(Request $request): JsonResponse
    {
        $category = "";
        if ($request->has("category")) {
            $category = $request->get("category");
        }

        $months = "";
        if ($request->has("months")) {
            $months = $request->get("months");
        }

        if ($category == "") {
            $category = -1;
        }
        $predictive_list = $this->predictive_analytic->getPredictiveRiskList($months, $category);

        return response()->json($predictive_list);
    }
}
