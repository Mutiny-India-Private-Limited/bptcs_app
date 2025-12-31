<?php

use App\Http\Controllers\GeneralController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/save-device-token', [GeneralController::class, 'saveDeviceDetails'])->name('api.saveDeviceDetails');
Route::post('/save-guest-device', [GeneralController::class, 'saveGuestDeviceDetails'])->name('api.saveGuestDeviceDetails');

// Route::post('/generate-biometric-token', [GeneralController::class, 'generateToken'])->name('api.generateBioToken');
// Route::post('/biometric-login', [GeneralController::class, 'loginWithToken'])->name('api.loginWithBioToken');