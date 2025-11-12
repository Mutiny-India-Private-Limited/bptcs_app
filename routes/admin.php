<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\FirebaseController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;

Route::prefix('admin')->name('admin.')->middleware('guest:admin')->group(function () {
    Route::get('login', [LoginController::class, 'adminShowLoginForm'])->name('login');
    Route::post('login', [LoginController::class, 'adminLogin'])->name('login.submit');
});

Route::prefix('admin')->name('admin.')->middleware('admin.auth')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.blogs.manage');
    })->name('dashboard');
    Route::post('/logout', [LoginController::class, 'adminLogout'])->name('logout');


    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/add', [FirebaseController::class, 'fire_notifi_add'])->name('add');
        Route::post('/store', [FirebaseController::class, 'fireSendNotification'])->name('store');
        Route::get('/list', [FirebaseController::class, 'fire_notifi_list'])->name('list');
    });


    Route::prefix('blogs')->name('blogs.')->group(function () {
        Route::get('/manage', [BlogController::class, 'blogManage'])->name('manage');
        Route::get('/add', [BlogController::class, 'blogAdd'])->name('add');
        Route::post('/store', [BlogController::class, 'blogStore'])->name('store');
        Route::post('/status', [BlogController::class, 'blogStatus'])->name('status');
        Route::get('/edit/{id}', [BlogController::class, 'blogAdd'])->name('edit');
        Route::put('/update/{id}', [BlogController::class, 'blogStore'])->name('update');
        Route::get('/delete/{id}', [BlogController::class, 'deleteblog'])->name('delete');
    });
});
