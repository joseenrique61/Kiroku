<?php

namespace App\Providers;

use App\Listeners\LogSuccessfulLogin;
use App\Services\Analytics\DeviceAnalyticService;
use App\Services\Analytics\FailureAnalyticService;
use App\Services\Analytics\Interfaces\DeviceAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\FailureAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\MaintenanceAnalyticServiceInterface;
use App\Services\Analytics\Interfaces\PredictiveAnalyticServiceInterface;
use App\Services\Analytics\MaintenanceAnalyticService;
use App\Services\Analytics\PredictiveAnalyticService;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            PredictiveAnalyticServiceInterface::class,
            fn () => new PredictiveAnalyticService()
        );

        $this->app->singleton(
            MaintenanceAnalyticServiceInterface::class,
            fn () => new MaintenanceAnalyticService()
        );

        $this->app->singleton(
            FailureAnalyticServiceInterface::class,
            fn () => new FailureAnalyticService()
        );

        $this->app->singleton(
            DeviceAnalyticServiceInterface::class,
            fn () => new DeviceAnalyticService()
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(
            Login::class,
            LogSuccessfulLogin::class
        );
    }
}
