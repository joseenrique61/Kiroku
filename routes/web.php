<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Inventory\Devices\DeviceController;
use App\Http\Controllers\Inventory\Failures\FailureController;
use App\Http\Controllers\Inventory\Reports\MaintenanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class );
    Route::resource('devices', DeviceController::class );
    Route::resource('failures', FailureController::class );
    Route::resource('maintenances', MaintenanceController::class );
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
