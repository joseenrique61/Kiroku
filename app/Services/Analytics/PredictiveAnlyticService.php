<?php

namespace App\Services\Analytics;

use App\Models\Device;
use App\Models\DeviceModel;
use App\Models\Maintenance;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PredictiveAnalyticService
{
    /**
     * Constantes de Riesgo
     */
    const RISK_LOW = 'Riesgo Bajo';
    const RISK_MEDIUM = 'Riesgo Medio';
    const RISK_HIGH = 'Riesgo Alto';

    const ACTION_LOW = 'Se recomienda realizar mantenimientos de forma periódica.';
    const ACTION_MEDIUM = 'Se recomienda realizar una evaluación y mantenimiento preventivo.';
    const ACTION_HIGH = 'Tomar acciones inmediatamente.';

    /**
     * ESCENARIO 1: Cálculo con Información Histórica del Dispositivo
     * Calcula el riesgo basado en el MTBF propio del dispositivo.
     * @param Device $device Objeto del dispositivo cargado con relaciones.
     * @param int $monthsFuture Meses en el futuro para la proyección.
     * @return array Estructura de riesgo y falla probable.
     */
    public function calculateDeviceRisk(Device $device, int $monthsFuture, ?float $modelMtbfDays = null): array
    {
        // 1. Calcular MTBF del Dispositivo (Promedio de días entre sus fallas)
        $maintenances = $device->maintenances()
            ->whereHas('failure')
            ->orderBy('datetime', 'desc')
            ->get();

        $hasHistoricalData = $maintenances->isNotEmpty() || $maintenances->count() > 1; 

        // Si no se pasó el MTBF del modelo, calcularlo
        if ($hasHistoricalData) {
            $deviceMtbfDays = $this->calculateDeviceMTBF($maintenances);
            
            // 2. Tiempo desde la última falla
            $lastFailureDate = Carbon::parse($maintenances->first()->out_of_service_datetime);
            $daysSinceLastEvent = Carbon::now()->diffInDays(Carbon::parse($lastFailureDate));

            // 3. Falla más probable (Moda de este dispositivo)
            $mostProbableFailure = $this->getMostCommonFailureForDevice($device->id);
        }
        else
        {   
            // 2. Tiempo desde que el equipo fue adquirido
            $deviceMtbfDays = 1825.0; // Si no hay datos suficientes se utiliza el MTBF del modelo (5 años)
            $acquisitionDate = Carbon::parse($device->acquisition?->acquisition_date ?? $device->created_at);
            $daysSinceLastEvent = Carbon::now()->diffInDays(Carbon::parse($acquisitionDate));

            // 3. Falla más probable (Moda del MODELO completo)
            $mostProbableFailure = $this->getMostCommonFailureForModel($device->device_model_id);
        }
        
        // 4. Cálculo de Probabilidad
        $futureDays = $monthsFuture * 30;
        $riskScore = (($daysSinceLastEvent + $futureDays) / $deviceMtbfDays) * 100;
        $riskPercentage = min(100, round($riskScore, 2));

        return $this->formatRiskOutput($riskPercentage, $mostProbableFailure);
    }

    /**
     * MÉTODO INTEGRADOR (Lista de Riesgos)
     * Decide qué escenario usar para cada dispositivo y retorna la lista completa.
     */
    public function getPredictiveRiskList(int $monthsFuture): array
    {
        $devices = Device::with(['maintenances.failure.failureType', 'acquisition', 'deviceModel'])->get();
        $results = [];

        $modelMtbfs = [];

        foreach ($devices as $device) {
            if (!isset($modelMtbfs[$device->device_model_id])) {
                $modelMtbfs[$device->device_model_id] = $this->calculateModelMTBF($device->device_model_id);
            }

            $riskData = $this->calculateDeviceRisk($device, $monthsFuture, $modelMtbfs[$device->device_model_id]);

            $results[] = array_merge([
                'device_id' => $device->id,
                'serial_number' => $device->serial_number,
                'model' => $device->deviceModel->name ?? 'N/A',
            ], $riskData);
        }

        return $results;
    }

    /**
     * ESCENARIO 2: Análisis de Probabilidad de fallo por Modelo
     * Retorna top 3 fallas y tiempos estimados para umbrales de riesgo.
     * @param int $deviceModelId ID del modelo a analizar.
     * @return array
     */
    public function analyzeModelFailureProbability(int $deviceModelId): array
    {
        // 1. Obtener Top 3 Fallas más comunes
        $failures = DB::table('failures')
            ->join('maintenances', 'failures.maintenance_id', '=', 'maintenances.id')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->join('failure_types', 'failures.failure_type_id', '=', 'failure_types.id')
            ->where('devices.device_model_id', $deviceModelId)
            ->whereNull('failures.deleted_at')
            ->select('failure_types.name', DB::raw('count(*) as total'))
            ->groupBy('failure_types.name')
            ->orderByDesc('total')
            ->get();

        $totalFailures = $failures->sum('total');
        
        $top3Failures = $failures->take(3)->map(function($f) use ($totalFailures) {
            return [
                'failure_name' => $f->name,
                'probability_percentage' => $totalFailures > 0 ? round(($f->total / $totalFailures) * 100, 1) : 0
            ];
        });

        // 2. Calcular Tiempo Promedio para Riesgo 30% y 70%
        // Fórmula inversa: Si Riesgo = (Tiempo / MTBF) * 100  =>  Tiempo = (Riesgo / 100) * MTBF
        $mtbfDays = $this->calculateModelMTBF($deviceModelId);
        
        // Convertir días a meses (aprox 30 días) y redondear hacia abajo (floor)
        $monthsTo30 = floor((0.30 * $mtbfDays) / 30);
        $monthsTo70 = floor((0.70 * $mtbfDays) / 30);

        return [
            'model_id' => $deviceModelId,
            'top_3_failures' => $top3Failures,
            'thresholds' => [
                'risk_30_percent_months' => (int) $monthsTo30,
                'risk_70_percent_months' => (int) $monthsTo70,
            ],
            'base_mtbf_days' => round($mtbfDays, 2)
        ];
    }

     /**
     * Calcula el MTBF de un modelo específico basado en todos sus dispositivos.
     */
    private function calculateDeviceMTBF(Maintenance $maintenances): float
    {
        if ($maintenances->isEmpty()) {
            return 365; // Valor base si no hay suficientes datos
        }

        $intervals = [];
        $lastBackToServiceDate = null;

        foreach ($maintenances as $maintenance) {
            $failureDate = Carbon::parse($maintenance->out_of_service_datetime);
            $currentBackToServiceDate = Carbon::parse($maintenance->back_to_service_datetime);

            // Tiempo entre la fecha de compra/creación del equipo hasta su primer mantenimiento
            if (!$lastBackToServiceDate) {
                $acquiredDate = Carbon::parse($maintenance->device->acquisition?->acquisition_date ?? $maintenance->device->created_at);
                $intervals[] = $acquiredDate->diffInDays($failureDate);
            }
            else
            {
                $intervals[] = $lastBackToServiceDate->diffInDays($failureDate);
            }
            
            $lastBackToServiceDate = $currentBackToServiceDate;
        }
        // MTBF en días (si solo hay 1 falla, usamos un valor base o la antigüedad, aquí evitamos división por 0)
        return count($intervals) > 0 ? (array_sum($intervals) / count($intervals)) : 365;
    }

    /**
     * Calcula el MTBF de un modelo específico basado en todos sus dispositivos.
     */
    private function calculateModelMTBF(int $deviceModelId): float
    {
        $maintenances = DB::table('maintenances')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->where('devices.device_model_id', $deviceModelId)
            ->orderBy('devices.id')
            ->orderBy('maintenances.datetime')
            ->get(['devices.id as device_id', 'maintenances.datetime']);

        $intervals = [];
        $lastBackToServiceDates = [];

        foreach ($maintenances as $maintenance) {
            $current = Carbon::parse($maintenance->back_to_service_datetime);
            $deviceId = $maintenance->device_id;

            if (!isset($lastBackToServiceDates[$deviceId])) 
            {
                // Tiempo entre la fecha de compra/creación del equipo hasta su primer mantenimiento
                $device = Device::find($deviceId);
                $lastBackToServiceDates[$deviceId] = Carbon::parse($device->acquisition?->acquisition_date ?? $device->created_at);
                $intervals[] = $lastBackToServiceDates[$deviceId]->diffInDays($current);
            }
            else
            {
                $intervals[] = $lastBackToServiceDates[$deviceId]->diffInDays($current);
            }

            $lastDates[$deviceId] = $current;
        }
        // MTBF en días (si solo hay 1 falla, usamos un valor base o la antigüedad, aquí evitamos división por 0)
        return count($intervals) > 0 ? (array_sum($intervals) / count($intervals)) : 365;
    }

    /**
     * Obtiene el nombre de la falla más común de un modelo.
     */
    private function getMostCommonFailureForDevice(int $deviceId): string
    {
        $result = DB::table('failures')
            ->join('maintenances', 'failures.maintenance_id', '=', 'maintenances.id')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->join('failure_types', 'failures.failure_type_id', '=', 'failure_types.id')
            ->where('devices.id', $deviceId)
            ->select('failure_types.name', DB::raw('count(*) as total'))
            ->groupBy('failure_types.name')
            ->orderByDesc('total')
            ->first();

        return $result ? $result->name : 'Indeterminada';
    }

    /**
     * Obtiene el nombre de la falla más común de un modelo.
     */
    private function getMostCommonFailureForModel(int $modelId): string
    {
        $result = DB::table('failures')
            ->join('maintenances', 'failures.maintenance_id', '=', 'maintenances.id')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->join('failure_types', 'failures.failure_type_id', '=', 'failure_types.id')
            ->where('devices.device_model_id', $modelId)
            ->select('failure_types.name', DB::raw('count(*) as total'))
            ->groupBy('failure_types.name')
            ->orderByDesc('total')
            ->first();

        return $result ? $result->name : 'Indeterminada';
    }

    /**
     * Formatea la salida de riesgo con etiquetas y colores.
     */
    private function formatRiskOutput(float $percentage, string $failureName): array
    {
        $status = self::RISK_LOW;
        $action = self::ACTION_LOW;
        $color = 'text-green-600'; // Útil para frontend

        if ($percentage >= 30 && $percentage < 70) {
            $status = self::RISK_MEDIUM;
            $action = self::ACTION_MEDIUM;
            $color = 'text-yellow-600';
        } elseif ($percentage >= 70) {
            $status = self::RISK_HIGH;
            $action = self::ACTION_HIGH;
            $color = 'text-red-600';
        }

        return [
            'probability_percentage' => $percentage,
            'most_probable_failure' => $failureName,
            'risk_level' => $status,
            'recommended_action' => $action,
            'ui_color' => $color
        ];
    }
}

// $mostProbableFailure = $maintenances->groupBy('failure.failure_type_id')
// ->sortByDesc(fn($group) => $group->count())
// ->first()
// ?->first()
// ->failure->failureType->name ?? 'Indeterminado';