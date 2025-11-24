<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use InvalidArgumentException;

class MainController extends Controller
{



    public function home(Request $request)
    {
        $member = authMember();
        $memberNumber = $member->member_number;

        $cacheKey = "dashboard_summary_{$memberNumber}";

        // Data change after 1hr ,refresh it from setting to reset
        $data = Cache::remember($cacheKey, now()->addHour(), function () use ($memberNumber) {
            $rawSummary = getCGRAllYearSummary($memberNumber);
            $share_amount = getTotalShareAmount($memberNumber);
            $share_details = getTotalShareDetails($memberNumber);

            $yearlySummary = [];
            foreach ($rawSummary as $financialYear => $data) {
                $depositMonths = $data['deposit'][0]['months'] ?? [];
                $interestMonths = $data['interest'][0]['months'] ?? [];

                $months = [];
                foreach ($depositMonths as $monthName => $monthData) {
                    $months[] = [
                        'month' => $monthName,
                        'deposit' => floatval($monthData['amount'] ?? 0),
                        'interest' => floatval($interestMonths[$monthName] ?? 0),
                    ];
                }

                $yearlySummary[] = [
                    'year' => $financialYear,
                    'totalDeposit' => floatval($data['totalDeposit'] ?? 0),
                    'totalWithdrawal' => floatval($data['totalWithdrawal'] ?? 0),
                    'totalInterest' => floatval($data['totalInterest'] ?? 0),
                    'closing' => floatval($data['closing'] ?? 0),
                    'months' => $months,
                ];
            }

            usort($yearlySummary, fn($a, $b) => strcmp($b['year'], $a['year']));

            $totals = [
                'deposit' => array_sum(array_column($yearlySummary, 'totalDeposit')),
                'withdrawal' => array_sum(array_column($yearlySummary, 'totalWithdrawal')),
                'interest' => array_sum(array_column($yearlySummary, 'totalInterest')),
                'closing' => array_sum(array_column($yearlySummary, 'closing')),
                'share_amount' => $share_amount,
                'share_details' => $share_details,
            ];

            return [
                'yearlySummary' => $yearlySummary,
                'totals' => $totals,
                'cached_at' => now(), // record the cache generation time
            ];
        });

        return Inertia::render('Home', [
            'member' => $member,
            'yearlySummary' => $data['yearlySummary'],
            'totals' => $data['totals'],
            // show user exactly when cache was generated
            'lastUpdated' => \Carbon\Carbon::parse($data['cached_at'])->format('d M Y, h:i A'),

        ]);
    }

    // public function home(Request $request)
    // {
    //     $member = authMember();
    //     $memberNumber = $member->member_number;

    //     // Get raw yearly summaries for the dashboard
    //     $rawSummary = $this->getCGRAllYearSummary($memberNumber);

    //     $share_amount = $this->getTotalShareAmount($memberNumber);
    //     $share_details = $this->getTotalShareDetails($memberNumber);

    //     $yearlySummary = [];
    //     foreach ($rawSummary as $financialYear => $data) {
    //         // Extract deposits and interests per month safely
    //         $depositMonths = $data['deposit'][0]['months'] ?? [];
    //         $interestMonths = $data['interest'][0]['months'] ?? [];

    //         $months = [];
    //         foreach ($depositMonths as $monthName => $monthData) {
    //             $months[] = [
    //                 'month' => $monthName,
    //                 'deposit' => floatval($monthData['amount'] ?? 0),
    //                 'interest' => floatval($interestMonths[$monthName] ?? 0),
    //             ];
    //         }

    //         $yearlySummary[] = [
    //             'year' => $financialYear,
    //             'totalDeposit' => floatval($data['totalDeposit'] ?? 0),
    //             'totalWithdrawal' => floatval($data['totalWithdrawal'] ?? 0),
    //             'totalInterest' => floatval($data['totalInterest'] ?? 0),
    //             'closing' => floatval($data['closing'] ?? 0),
    //             'months' => $months,
    //         ];
    //     }

    //     // Sort newest first
    //     usort($yearlySummary, fn($a, $b) => strcmp($b['year'], $a['year']));

    //     // Compute totals for cards
    //     $totals = [
    //         'deposit' => array_sum(array_column($yearlySummary, 'totalDeposit')),
    //         'withdrawal' => array_sum(array_column($yearlySummary, 'totalWithdrawal')),
    //         'interest' => array_sum(array_column($yearlySummary, 'totalInterest')),
    //         'closing' => array_sum(array_column($yearlySummary, 'closing')),
    //         'share_amount' => $share_amount,
    //         'share_details' => $share_details,
    //     ];

    //     return Inertia::render('Home', [
    //         'member' => $member,
    //         'yearlySummary' => $yearlySummary,
    //         'totals' => $totals,
    //         'lastUpdated' => now()->format('d-m-Y'),
    //     ]);
    // }

    public function profile(Request $request)
    {
        $member = authMember([
            'name',
            'cgr_number',
            'member_number',
            'fathers_name',
            'date_of_birth',
            'phone_number',
            'permanent_address',
            'permanent_city',
            'permanent_state',
            'nominee_name',
            'nominee_relation'
        ]);
        if (!$member) {
            return redirect()
                ->route('login')
                ->withErrors(['login' => 'Please login to continue.']);
        }

        return Inertia::render('Profile', [
            'member' => $member,
        ]);
    }
    public function office(Request $request)
    {
        $member = authMember([
            'name',
            'designation',
            'date_of_appointment',
            'date_of_retirement',
            'office_address',
            'office_city',
            'office_state',
            'zone',
            'district'
        ]);
        if (!$member) {
            return redirect()
                ->route('login')
                ->withErrors(['login' => 'Please login to continue.']);
        }

        return Inertia::render('Office', [
            'member' => $member,
        ]);
    }

    public function ledgerYears()
    {
        $years = getLedgerYears();

        return Inertia::render('LedgerYearSelect', [
            'years' => $years,
        ]);
    }
    public function ledger($year)
    {
        $memberNumber = authMember()->member_number;
        $yearTable = 'cgr_' . str_replace('-', '_', $year);

        $summary = getCGRYearSummary($memberNumber, $yearTable);
        dd($summary);

        $deposit = $summary['deposit'] ?? [];
        $interest = $summary['interest'] ?? [];
        $months = array_keys($deposit[0]['months'] ?? []);

        $ledgerData = [];
        foreach ($months as $month) {
            $ledgerData[] = [
                'month' => ucfirst($month),
                'cgr' => [
                    'amount' => round(floatval($deposit[0]['months'][$month]['amount'] ?? 0)),
                    'mode' => $deposit[0]['months'][$month]['mode'] ?? null,
                    'date' => $deposit[0]['months'][$month]['date'] ?? null,
                ],
                'interest' => round(floatval($interest[0]['months'][$month] ?? 0)),
            ];
        }

        return Inertia::render('Ledger', [
            'year' => $year,
            'openingBalance' => $deposit[0]['opening_amount'] ?? 0,
            'closingBalance' => ($deposit[0]['opening_amount'] ?? 0) + $summary['totalDeposit'] + $summary['totalInterest'],
            'totalDeposit' => $summary['totalDeposit'],
            'totalInterest' => $summary['totalInterest'],
            'totalWithdrawal' => $summary['totalWithdrawal'],
            'closing' => $summary['closing'],
            'ledgerData' => $ledgerData,
        ]);
    }

    public function notifications()
    {
        $id = authMember(['sno']);
        $notifications = Notification::orderBy('id', 'desc')->whereIn('user_id', ['0', $id])->where('status', '1')->get();

        return Inertia::render('Notification', [
            'notifications' => $notifications,
        ]);
    }

    public function help_support(Request $request)
    {
        return Inertia::render('HelpSupport');
    }
}