<?php

use App\Http\Controllers\PedidoController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // ─── Pedidos / Cuadernos ─────────────────────────────────────────────────
    Route::prefix('pedidos')->name('pedidos.')->group(function () {
        Route::get('/', [PedidoController::class, 'index'])->name('index');
        Route::post('/', [PedidoController::class, 'store'])->name('store');
        Route::get('/{pedido}', [PedidoController::class, 'show'])->name('show');
        Route::patch('/{pedido}', [PedidoController::class, 'update'])->name('update');
        Route::patch('/{pedido}/estado', [PedidoController::class, 'updateStatus'])->name('updateStatus');
        Route::delete('/{pedido}', [PedidoController::class, 'destroy'])->name('destroy');

        // Vinculaciones
        Route::post('/vincular-imagen-producto', [PedidoController::class, 'vincularImagenProducto'])->name('vincularImagenProducto');
        Route::post('/vincular-pago', [PedidoController::class, 'vincularPago'])->name('vincularPago');
    });
});

require __DIR__.'/settings.php';
