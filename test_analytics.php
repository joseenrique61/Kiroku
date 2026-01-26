<?php

use App\Services\Analytics\DeviceAnalyticService;
use App\Services\Analytics\MaintenanceAnalyticService;

$deviceAnalytic = app(DeviceAnalyticService::class);
$maintenanceAnalytic = app(MaintenanceAnalyticService::class);

echo "=== Device Count By Status ===\n";
$deviceCountByStatus = $deviceAnalytic->getDeviceCountByStatus();
var_dump($deviceCountByStatus);
echo json_encode($deviceCountByStatus, JSON_PRETTY_PRINT) . "\n\n";

echo "=== Most Common Models ===\n";
$mostCommonModels = $deviceAnalytic->mostCommonModels();
var_dump($mostCommonModels);
echo json_encode($mostCommonModels, JSON_PRETTY_PRINT) . "\n\n";

echo "=== MTTR By Category ===\n";
$mttrByCategory = $maintenanceAnalytic->getMeanTimeToRepairByDeviceCategory();
var_dump($mttrByCategory);
echo json_encode($mttrByCategory, JSON_PRETTY_PRINT) . "\n\n";

echo "=== MTTR By Brand ===\n";
$mttrByBrand = $maintenanceAnalytic->getMeanTimeToRepairByDeviceBrand();
var_dump($mttrByBrand);
echo json_encode($mttrByBrand, JSON_PRETTY_PRINT) . "\n\n";
