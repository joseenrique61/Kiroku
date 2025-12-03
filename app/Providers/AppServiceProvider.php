<?php

namespace App\Providers;

use App\Listeners\LogSuccessfulLogin;
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
            PredictiveAnalyticService::class,
            fn () => new PredictiveAnalyticService()
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
