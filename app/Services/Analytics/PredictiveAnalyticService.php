<?php

namespace App\Services\Analytics;

use App\Models\Device;
use Carbon\Carbon;
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
    private function calculateDeviceRisk(Device $device, int $monthsFuture, ?float $modelMtbfDays = null): array
    {
        // 1. Calcular MTBF del Dispositivo (Promedio de días entre sus fallas)
        $maintenancesWithFailures = $device->maintenances()
            ->where('is_preventive', "=", false)
            ->orderBy('out_of_service_datetime', 'desc')
            ->get();

        $hasHistoricalData = $maintenancesWithFailures->count() > 1; 

        // Si no se pasó el MTBF del modelo, calcularlo
        if ($hasHistoricalData) {
            $deviceMtbfDays = $this->calculateDeviceMTBF($device->id);
            
            // 2. Tiempo desde la última falla
            $lastFailureDate = Carbon::parse($maintenancesWithFailures->first()->out_of_service_datetime);
            $daysSinceLastEvent = $lastFailureDate->diffInDays(Carbon::now());
            
            // 3. Falla más probable (Moda de este dispositivo)
            $mostProbableFailure = $this->getMostCommonFailureForDevice($device->id);
        }
        else
        {   
            $deviceMtbfDays = $this->calculateModelMTBF($device->device_model_id);
                
            // 2. Tiempo desde la última falla
            $acquisitionDate = Carbon::parse($device->acquisition?->acquired_at ?? $device->created_at);
            $daysSinceLastEvent = $acquisitionDate->diffInDays(Carbon::now());

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

        // Por el momento, no está siendo utilizada
        $modelMtbfs = [];

        foreach ($devices as $device) {
            $riskData = $this->calculateDeviceRisk($device, $monthsFuture);

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
            ->select('failure_types.name', DB::raw('count(*) as total'))
            ->groupBy('failure_types.name')
            ->orderByDesc('total')
            ->get();

        $totalFailures = $failures->sum('total');
        
        $top3Failures = $failures->take(3)->map(function($failure) use ($totalFailures) {
            return [
                'failure_name' => $failure->name,
                'probability_percentage' => $totalFailures > 0 ? round(($failure->total / $totalFailures) * 100, 1) : 0
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
    private function calculateDeviceMTBF(int $deviceId): float
    {
        $maintenances = DB::table('maintenances')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->leftJoin('acquisitions', 'devices.acquisition_id', '=', 'acquisitions.id') 
            ->where('devices.id', $deviceId)
            ->where('is_preventive', '=', false) // Filtro para conseguir los mantenimientos que presentaron fallos
            ->orderBy('maintenances.out_of_service_datetime', 'asc') // Orden cronológico vital
            ->select([
                'devices.created_at as device_created_at',
                'acquisitions.acquired_at',
                'maintenances.out_of_service_datetime',
                'maintenances.back_to_service_datetime'
            ])
            ->get();
        
        $intervals = [];
        $lastBackToServiceDate = null;

        foreach ($maintenances as $maintenance) {
            $failureDate = Carbon::parse($maintenance->out_of_service_datetime);

            $currentBackToServiceDate = Carbon::parse($maintenance->back_to_service_datetime) ? Carbon::parse($maintenance->back_to_service_datetime) : null;

            // Tiempo entre la fecha de compra/creación del equipo hasta su primer mantenimiento
            if (!$lastBackToServiceDate) {
                $acquiredDate = Carbon::parse($maintenance->acquired_at ?? $maintenance->created_at);
                $intervals[] = $acquiredDate->diffInDays($failureDate);
            }
            else
            {
                $intervals[] = $lastBackToServiceDate->diffInDays($failureDate);
            }
            
            // Se actualiza sólo si el mantenimiento registra una fecha en que el equipo regresó a estar disponible
            if ($currentBackToServiceDate) {
                $lastBackToServiceDate = $currentBackToServiceDate;
            }
        }
        // MTBF en días (si solo hay 1 falla, usamos un valor base o la antigüedad, aquí evitamos división por 0)
        return count($intervals) > 0 ? (array_sum($intervals) / count($intervals)) : 365;
    }

    /**
     * Calcula el MTBF de un modelo específico de forma optimizada.
     */
    private function calculateModelMTBF(int $deviceModelId): float
    {
        $maintenances = DB::table('maintenances')
            ->join('devices', 'maintenances.device_id', '=', 'devices.id')
            ->leftJoin('acquisitions', 'devices.acquisition_id', '=', 'acquisitions.id') // Unir adquisiciones
            ->where('devices.device_model_id', $deviceModelId)
            ->where('is_preventive', '=', false) // Filtro para conseguir los mantenimientos que presentaron fallos
            ->orderBy('devices.id')
            ->orderBy('maintenances.out_of_service_datetime', 'asc') // Orden cronológico vital
            ->select([
                'devices.id as device_id',
                'devices.created_at as device_created_at',
                'acquisitions.acquired_at',
                'maintenances.out_of_service_datetime',
                'maintenances.back_to_service_datetime'
            ])
            ->get();

        // Se valida que los registros tengan mínimo 3 fallos registrados para ese modelo (Tomando la información de todos los dispositivos que son parte de dicho modelo)
        $hasHistoricalData = $maintenances->count() > 3;
        
        if (!$hasHistoricalData)
        {
            return 1825.0; // Si no hay datos suficientes se utiliza un MTBF para ese modelo de 5 años calculado días
        }

        $intervals = [];
        $lastBackToServiceDates = [];

        foreach ($maintenances as $maintenance) {
            $deviceId = $maintenance->device_id;
            
            // Usamos out_of_service para marcar el FIN del tiempo operativo (Falla)
            $failureDate = Carbon::parse($maintenance->out_of_service_datetime);
            
            // Usamos back_to_service para marcar el INICIO del siguiente intervalo
            $currentBackToService = $maintenance->back_to_service_datetime ? Carbon::parse($maintenance->back_to_service_datetime) : null;

            if (!isset($lastBackToServiceDates[$deviceId])) {
                // Se calcula desde Fecha Adquisición (o Creación) -> Hasta Primera Falla Registrada
                $originDate = $maintenance->acquired_at ? Carbon::parse($maintenance->acquired_at) : Carbon::parse($maintenance->device_created_at);   
                $intervals[] = $originDate->diffInDays($failureDate);
            } else {
                // Se calcula desde Último Arreglo -> Hasta Nueva Falla
                $lastBackToServiceDate = $lastBackToServiceDates[$deviceId];
                $intervals[] = $lastBackToServiceDate->diffInDays($failureDate);
            }

            // Se actualiza la fecha base para la siguiente vuelta del bucle
            if ($currentBackToService) {
                $lastBackToServiceDates[$deviceId] = $currentBackToService;
            } else {
                // Si no se ha arreglado, se elimina la referencia para no calcular intervalos erróneos futuros
                unset($lastBackToServiceDates[$deviceId]); 
            }
        }

        return count($intervals) > 0 ? (array_sum($intervals) / count($intervals)) : 365.0;
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
            ->selectRaw('failure_types.name, count(*) as total')
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
            ->selectRaw('failure_types.name, count(*) as total')
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
        $color = 'text-green-600';

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