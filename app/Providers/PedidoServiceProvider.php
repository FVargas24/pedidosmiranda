<?php

namespace App\Providers;

use App\Services\ClienteService;
use App\Services\DestinoService;
use App\Services\ExternalApiService;
use App\Services\PedidoService;
use App\Services\VinculacionService;
use Illuminate\Support\ServiceProvider;

class PedidoServiceProvider extends ServiceProvider
{
    /**
     * Register any application domain services.
     */
    public function register(): void
    {
        $this->app->singleton(ExternalApiService::class, fn () => new ExternalApiService);

        $this->app->singleton(PedidoService::class, fn ($app) => new PedidoService(
            $app->make(ExternalApiService::class)
        ));

        $this->app->singleton(VinculacionService::class, fn ($app) => new VinculacionService(
            $app->make(ExternalApiService::class)
        ));

        $this->app->singleton(ClienteService::class, fn () => new ClienteService);

        $this->app->singleton(DestinoService::class, fn () => new DestinoService);
    }

    /**
     * Bootstrap any domain services.
     */
    public function boot(): void
    {
        //
    }
}
