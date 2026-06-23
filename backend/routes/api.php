<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StockMovementController;
use App\Http\Controllers\Api\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index']);
// --- ROUTES PUBLIQUES (Accessibles sans être connecté) ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/login', [AuthController::class, 'login']);

// --- ROUTES PROTÉGÉES (Nécessitent un Token Bearer Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {

    // Gestion du stock
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);

    // Mouvements de stock
    Route::get('/movements', [StockMovementController::class, 'index']);
    Route::post('/movements', [StockMovementController::class, 'store']);
    Route::get('/products/{product}/movements', [StockMovementController::class, 'productHistory']);

    // Authentification / Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);
});