<?php

use App\Http\Controllers\GeneralController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/save-device-token', [GeneralController::class, 'saveDeviceDetails'])->name('api.saveDeviceDetails');