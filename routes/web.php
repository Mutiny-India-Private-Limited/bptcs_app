<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\GeneralController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MainController;
use App\Http\Controllers\ProfileController;
use App\Models\Member;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });


Route::middleware('guest.member')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/app_login', [LoginController::class, 'app_login'])->name('app_login');
});


Route::middleware('auth.member')->group(function () {
    Route::redirect('/', 'home');
    Route::get('/home', [MainController::class, 'home'])->name('home');

    Route::get('/profile', [MainController::class, 'profile'])->name('profile');

    Route::get('/office', [MainController::class, 'office'])->name('office');

    Route::get('/ledger/years', [MainController::class, 'ledgerYears'])
        ->name('ledger.years');

    Route::get('/ledger/{year}', [MainController::class, 'ledger'])
        ->name('ledger');

    Route::get('/more', fn() => Inertia::render('More'))->name('more');

    // Route::get('/notifications', fn() => Inertia::render('Notification'))->name('notification');
    Route::get('/notifications', [MainController::class, 'notifications'])->name('notification');
    Route::get('/help_support', [MainController::class, 'help_support'])->name('help_support');

    Route::get('/security', [MainController::class, 'security'])->name('security');


    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::get('/refresh', [LoginController::class, 'refresh'])->name('refresh');

    Route::get('/blogs', [BlogController::class, 'blogs'])->name('blogs');

    Route::get('/blog-details/{id}', [BlogController::class, 'blog_details'])->name('blog_details');

    Route::get('/accounts', [MainController::class, 'accounts_index'])->name('accounts.index');

    Route::get('/fd_details/{id}', [MainController::class, 'fd_show'])->name('fd.show');
    Route::get('/rd_details/{id}', [MainController::class, 'rd_show'])->name('rd.show');
    Route::get('/saving_details/{id}', [MainController::class, 'saving_show'])->name('savings.show');
});
Route::get('/privacy_policy', fn() => Inertia::render('PrivacyPolicy'))->name('privacy_policy');

Route::get('/migrate', function () {
    Artisan::call('migrate');
    return Artisan::output();
});
Route::post(
    '/generate-biometric-token',
    [GeneralController::class, 'generateToken']
)->name('generateBioToken');
Route::post('/biometric-login', [GeneralController::class, 'loginWithToken'])->name('loginWithBioToken');

Route::post('/login/send-otp', [LoginController::class, 'sendOtp'])->name('login.sendOtp');
Route::post('/login/verify-otp', [LoginController::class, 'verifyOtp'])->name('login.verifyOtp');

// Route::get('/seed', function () {
//     return Artisan::call('db:seed');
// });
// Route::get('/storage-link', function () {
//     return Artisan::call('storage:link');
// });
// Route::post('/fire_notifi_add', [GeneralController::class, 'fire_notifi_add'])->name('fire_notifi_add');






require __DIR__ . '/admin.php';
// require __DIR__ . '/auth.php';