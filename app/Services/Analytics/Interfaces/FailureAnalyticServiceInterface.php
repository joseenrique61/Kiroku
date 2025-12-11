<?php

namespace App\Services\Analytics\Interfaces;

use Illuminate\Support\Collection;

interface FailureAnalyticServiceInterface
{
    public function getFailureRateByFailureType(): Collection;

    public function getFailureRateByBrand(): Collection;
}