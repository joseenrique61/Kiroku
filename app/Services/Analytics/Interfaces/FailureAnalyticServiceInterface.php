<?php

namespace App\Services\Analytics\Interfaces;

use Illuminate\Support\Collection;

interface FailureAnalyticServiceInterface
{
    public function getFailureRateByFailureType(): array;

    public function getFailureRateByBrand(): array;
}