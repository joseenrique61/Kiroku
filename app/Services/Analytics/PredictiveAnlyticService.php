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
            ->whereHas('failure') // Solo mantenimientos correctivos
            ->orderBy('datetime')
            ->get();

        // MTBF en días (si solo hay 1 falla, usamos un valor base o la antigüedad, aquí evitamos división por 0)
        if ($maintenances->count() < 2) {
            // Si no hay suficientes datos, usar MTBF del modelo si se pasó
            if ($modelMtbfDays) {
                $deviceMtbfDays = $modelMtbfDays;
            } else {
                $deviceMtbfDays = $this->calculateModelMTBF($device->device_model_id);
            }
        } else {
        $deviceMtbfDays = $this->calculateDeviceMTBF($maintenances);

        // 2. Tiempo desde el último evento (Falla o Compra)
        $lastEventDate = $lastDate ?? $device->acquisition?->acquisition_date ?? $device->created_at;
        $daysSinceLastEvent = Carbon::now()->diffInDays(Carbon::parse($lastEventDate));

        // 3. Cálculo de Probabilidad
        $futureDays = $monthsFuture * 30;
        $riskScore = (($daysSinceLastEvent + $futureDays) / $deviceMtbfDays) * 100;
        $riskPercentage = min(100, round($riskScore, 2));

        // 4. Falla más probable (Moda de este dispositivo)
        $mostProbableFailure = $maintenances->groupBy('failure.failure_type_id')
            ->sortByDesc(fn($group) => $group->count())
            ->first()
            ?->first()
            ->failure->failureType->name ?? 'Indeterminado';

        return $this->formatRiskOutput($riskPercentage, $mostProbableFailure);
    }

    // /**
    //  * ESCENARIO 2: Cálculo Sin Historial (Basado en Modelo)
    //  * Utiliza el MTBF del modelo y la fecha de compra del equipo.
    //  * * @param Device $device Dispositivo sin historial.
    //  * @param int $monthsFuture Meses en el futuro.
    //  * @param float|null $modelMtbfDays MTBF pre-calculado del modelo (opcional para optimizar loops).
    //  * @return array
    //  */
    // public function calculateModelBasedRisk(Device $device, int $monthsFuture, ?float $modelMtbfDays = null): array
    // {
    //     // 1. Obtener MTBF del Modelo si no se pasó
    //     if (!$modelMtbfDays) {
    //         $modelMtbfDays = $this->calculateModelMTBF($device->device_model_id);
    //     }

    //     // 2. Tiempo de Vida (Fecha Actual - Fecha de Compra)
    //     // Asumimos que $device->acquisition->acquisition_date existe, si no, created_at
    //     $purchaseDate = $device->acquisition?->acquisition_date ?? $device->created_at;
    //     $lifetimeDays = Carbon::now()->diffInDays(Carbon::parse($purchaseDate));

    //     // 3. Cálculo de Probabilidad (Riesgo aumenta con la antigüedad vs MTBF del modelo)
    //     $futureDays = $monthsFuture * 30;
        
    //     // Aquí la lógica es: Si un equipo ha vivido X días sin fallar, y el promedio de fallo es Y,
    //     // su riesgo acumulado es alto.
    //     $riskScore = (($lifetimeDays + $futureDays) / $modelMtbfDays) * 100;
    //     $riskPercentage = min(100, round($riskScore, 2));

    //     // 4. Falla más probable (Moda del MODELO completo)
    //     $mostProbableFailure = $this->getMostCommonFailureForModel($device->device_model_id);

    //     return $this->formatRiskOutput($riskPercentage, $mostProbableFailure);
    // }

    /**
     * =================================================================================
     * MÉTODO INTEGRADOR (Lista de Riesgos)
     * =================================================================================
     * Decide qué escenario usar para cada dispositivo y retorna la lista completa.
     */
    public function getPredictiveRiskList(int $monthsFuture): array
    {
        $devices = Device::with(['maintenances.failure.failureType', 'acquisition', 'deviceModel'])->get();
        $results = [];

        // Pre-calcular MTBFs de modelos para evitar N+1 queries en el Escenario 2
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
     * =================================================================================
     * ESCENARIO 3: Análisis de Probabilidad por Modelo
     * =================================================================================
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

    // =================================================================================
    // MÉTODOS AUXILIARES (HELPERS)
    // =================================================================================

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
    private function calculateModelMTBF(int $modelId): float
    {
        $maintenances = DB::table('maintenances')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->where('devices.device_model_id', $modelId)
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

        return count($intervals) > 0 ? (array_sum($intervals) / count($intervals)) : 365;
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

        return $result ? $result->name : 'Desconocida';
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