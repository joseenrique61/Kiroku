<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Inventory\Devices\DeviceController;
use App\Http\Controllers\Inventory\Failures\FailureController;
use App\Http\Controllers\Inventory\Reports\MaintenanceController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('users', UserController::class );
    Route::resource('devices', DeviceController::class );
    Route::resource('failures', FailureController::class );
    Route::resource('maintenances', MaintenanceController::class );

    Route::get('logs', [AuditLogController::class, 'index'])->name('logs.index');
    Route::get('logs/{log}', [AuditLogController::class, 'show'])->name('logs.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
