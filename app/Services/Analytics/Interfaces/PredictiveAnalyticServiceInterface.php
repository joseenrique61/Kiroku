<?php

namespace App\Services\Analytics\Interfaces;

interface PredictiveAnalyticServiceInterface
{
    public function getPredictiveRiskList(int $monthsFuture, int $category): array;

    public function analyzeModelFailureProbability(int $deviceModelId): array;
}
