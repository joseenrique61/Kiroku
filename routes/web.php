<?php

use App\Http\Controllers\DeviceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('users', [UserController::class, 'index'] )->name('users');
    Route::get('devices', [DeviceController::class, 'index'] )->name('devices');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
