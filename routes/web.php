<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Permission routes
    Route::resource('permissions', PermissionController::class);
    
    // Admin routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        Route::get('admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::get('admin/export/excel', [AdminController::class, 'create'])->name('admin.export.excel')->defaults('format', 'excel');
        Route::get('admin/export/pdf', [AdminController::class, 'store'])->name('admin.export.pdf')->defaults('format', 'pdf');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
