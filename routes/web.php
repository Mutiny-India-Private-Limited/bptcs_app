<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware('guest.member')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
});


Route::middleware('auth.member')->group(function () {
    Route::get('/', function () {
        // return Inertia::render('Home', [
        //     'success' => 'Successfully logged in!',
        // ]);
        return Inertia::render('Home');
    })->name('home');
    Route::get('/profile', fn() => Inertia::render('Profile'))->name('profile');
    Route::get('/office', fn() => Inertia::render('Office'))->name('office');
    Route::get('/ledger/years', function () {
        return Inertia::render('LedgerYearSelect');
    })->name('ledger.years');

    Route::get('/ledger/{year?}', function ($year = '2024-2025') {
        return Inertia::render('Ledger', [
            'year' => $year,
            'openingBalance' => 50000,
            'closingBalance' => 195000,
            'ledgerData' => [
                ['month' => 'April', 'cgr' => ['amount' => 12000, 'date' => '2024-04-10'], 'interest' => 450],
                ['month' => 'May', 'cgr' => ['amount' => 10000, 'date' => '2024-05-09'], 'interest' => 410],
                ['month' => 'June', 'cgr' => ['amount' => 15000, 'date' => '2024-06-15'], 'interest' => 500],
                ['month' => 'July', 'cgr' => ['amount' => 13000, 'date' => '2024-07-12'], 'interest' => 470],
                ['month' => 'August', 'cgr' => ['amount' => 14000, 'date' => '2024-08-18'], 'interest' => 480],
                ['month' => 'September', 'cgr' => ['amount' => 16000, 'date' => '2024-09-16'], 'interest' => 520],
                ['month' => 'October', 'cgr' => ['amount' => 12500, 'date' => '2024-10-13'], 'interest' => 460],
                ['month' => 'November', 'cgr' => ['amount' => 17000, 'date' => '2024-11-10'], 'interest' => 550],
                ['month' => 'December', 'cgr' => ['amount' => 14500, 'date' => '2024-12-20'], 'interest' => 495],
                ['month' => 'January', 'cgr' => ['amount' => 15500, 'date' => '2025-01-18'], 'interest' => 505],
                ['month' => 'February', 'cgr' => ['amount' => 13500, 'date' => '2025-02-15'], 'interest' => 460],
                ['month' => 'March', 'cgr' => ['amount' => 18000, 'date' => '2025-03-10'], 'interest' => 580],
            ],
        ]);
    })->name('ledger');

    Route::get('/more', fn() => Inertia::render('More'))->name('more');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::get('/refresh', function () {
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        return redirect()->back()->with('success', 'Page refresh successfully!');
    })->name('refresh');
});




// require __DIR__ . '/auth.php';