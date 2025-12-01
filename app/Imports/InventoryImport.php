<?php

namespace App\Imports;

use App\Models\Acquisition;
use App\Models\Device;
use App\Models\DeviceBrand;
use App\Models\DeviceCategory;
use App\Models\DeviceModel;
use App\Models\DeviceStatus;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\OnEachRow;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Row;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class InventoryImport implements OnEachRow, WithHeadingRow
{
    private int $organizationId;

    private array $brandsCache = [];
    private array $categoriesCache = [];
    private array $statusesCache = [];
    private array $modelsCache = [];

    public function __construct(int $organizationId)
    {
        $this->organizationId = $organizationId;
    }

    public function onRow(Row $row)
    {
        $row = $row->toArray();

        // Limpieza de datos
        $brandName = trim($row['brand']);
        $modelName = trim($row['model']);
        $statusName = trim($row['status']);
        $categoryName = trim($row['categorie']);
        
        $brandId = $this->getOrCreateIndex(DeviceBrand::class, $brandName, $this->brandsCache);

        $modelId = $this->getDeviceModelId($modelName, $brandId);
        
        $categoryId = $this->getOrCreateIndex(DeviceCategory::class, $categoryName, $this->categoriesCache);
        $statusId = $this->getOrCreateIndex(DeviceStatus::class, $statusName, $this->statusesCache);

        DB::transaction(function () use ($row, $modelId, $categoryId, $statusId) {
            
            // Transformar fecha de Excel a formato BD
            $acquiredAt = $this->transformDate($row['acquired_at']);
            $warrantyEnd = $this->transformDate($row['warranty_end_date']);

            $acquisition = Acquisition::create([
                'acquired_at' => $acquiredAt,
                'warranty_end_date' => $warrantyEnd,
                'price' => $row['price'],
            ]);

            Device::create([
                'serial_number' => $row['serial_number'],
                'description' => $row['description'],
                'acquisition_id' => $acquisition->id,
                'organization_id' => $this->organizationId,
                'device_category_id' => $categoryId,
                'device_model_id' => $modelId,
                'device_status_id' => $statusId,
            ]);
        });
    }

    /**
     * Función Genérica para "Buscar, Crear y Cachear"
     * Funciona para: Categorías, Marcas, Estatus
     */
    private function getOrCreateIndex(string $modelClass, string $name, array &$cache): int
    {
        if (empty($name)) {
            throw new \Exception("El campo nombre es obligatorio para crear un registro.");
        }

        // Revisar en memoria RAM (Cache)
        if (isset($cache[$name])) {
            return $cache[$name];
        }

        // Sugerencia: DB::transaction asegura que si dos procesos corren a la vez, no duplique (opcional pero recomendado)
        $record = $modelClass::firstOrCreate(
            ['name' => $name]
        );

        $cache[$name] = $record->id;

        return $record->id;
    }

    /**
     * Lógica específica para Modelos (que dependen de Marca)
     */
    private function getDeviceModelId(string $modelName, int $brandId): int
    {
        $cacheKey = $modelName . '-' . $brandId;

        if (isset($this->modelsCache[$cacheKey])) {
            return $this->modelsCache[$cacheKey];
        }

        $model = DeviceModel::firstOrCreate(
            [
                'name' => $modelName,
                'brand_id' => $brandId
            ]
        );

        $this->modelsCache[$cacheKey] = $model->id;

        return $model->id;
    }

    private function transformDate($value)
    {
        if (is_null($value) || trim($value) === '') {
            return null;
        }
        try {
            return Date::excelToDateTimeObject($value);
        } catch (\Throwable $e) {
            return $value; 
        }
    }
}