<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use InvalidArgumentException;

class MainController extends Controller
{
    function getCGRDeposit($memberNumber, $year = 'cgr_2021_2022')
    {
        $rows = DB::table($year)
            ->where('membernumber', $memberNumber)
            ->get();

        if ($rows->isEmpty()) {
            return null;
        }

        $data = [];
        foreach ($rows as $r) {
            $months = [
                'April' => ['amount' => $r->april, 'mode' => $r->aprilmode, 'date' => $r->aprildate],
                'May' => ['amount' => $r->may, 'mode' => $r->maymode, 'date' => $r->maydate],
                'June' => ['amount' => $r->june, 'mode' => $r->junemode, 'date' => $r->junedate],
                'July' => ['amount' => $r->july, 'mode' => $r->julymode, 'date' => $r->julydate],
                'August' => ['amount' => $r->aug, 'mode' => $r->augmode, 'date' => $r->augdate],
                'September' => ['amount' => $r->sep, 'mode' => $r->sepmode, 'date' => $r->sepdate],
                'October' => ['amount' => $r->oct, 'mode' => $r->octmode, 'date' => $r->octdate],
                'November' => ['amount' => $r->nov, 'mode' => $r->novmode, 'date' => $r->novdate],
                'December' => ['amount' => $r->dece, 'mode' => $r->decmode, 'date' => $r->decdate],
                'January' => ['amount' => $r->jan, 'mode' => $r->janmode, 'date' => $r->jandate],
                'February' => ['amount' => $r->feb, 'mode' => $r->febmode, 'date' => $r->febdate],
                'March' => ['amount' => $r->march, 'mode' => $r->marchmode, 'date' => $r->marchdate],
            ];

            $data[] = [
                'opening_amount' => round(floatval($r->opening_amount)),
                'months' => $months,
            ];
        }

        return $data;
    }
    function getTotalDeposit($memberNumber, $year = 'cgr_2021_2022')
    {
        $rows = DB::table($year)->where('membernumber', $memberNumber)->get();

        if ($rows->isEmpty()) {
            return 0;
        }

        $total = 0;
        foreach ($rows as $r) {
            $total += round(floatval($r->april))
                + round(floatval($r->may))
                + round(floatval($r->june))
                + round(floatval($r->july))
                + round(floatval($r->aug))
                + round(floatval($r->sep))
                + round(floatval($r->oct))
                + round(floatval($r->nov))
                + round(floatval($r->dece))
                + round(floatval($r->jan))
                + round(floatval($r->feb))
                + round(floatval($r->march));
        }

        return $total;
    }
    function getTotalInterest($memberNumber, $year = 'cgr_2021_2022')
    {
        $rows = DB::table($year)->where('membernumber', $memberNumber)->get();

        if ($rows->isEmpty()) {
            return 0;
        }

        $rate = 0.08;
        $total = 0;

        foreach ($rows as $r) {
            // Monthly interest contributions
            $total +=
                round((($rate * floatval($r->april)) / 12) * 12) +
                round((($rate * floatval($r->may)) / 12) * 11) +
                round((($rate * floatval($r->june)) / 12) * 10) +
                round((($rate * floatval($r->july)) / 12) * 9) +
                round((($rate * floatval($r->aug)) / 12) * 8) +
                round((($rate * floatval($r->sep)) / 12) * 7) +
                round((($rate * floatval($r->oct)) / 12) * 6) +
                round((($rate * floatval($r->nov)) / 12) * 5) +
                round((($rate * floatval($r->dece)) / 12) * 4) +
                round((($rate * floatval($r->jan)) / 12) * 3) +
                round((($rate * floatval($r->feb)) / 12) * 2) +
                round((($rate * floatval($r->march)) / 12) * 1);

            // Withdraw logic
            if (!empty(trim($r->withdrawamount))) {
                $month = date('m', strtotime(str_replace('/', '-', $r->withdrawdate)));
                $opening = floatval($r->opening_amount) - floatval($r->withdrawamount);

                $monthNumber = intval($month);
                $monthsElapsed = $monthNumber - 3; // April = 4, so April = 1st month
                $monthsRemaining = 12 - $monthsElapsed;

                $previousAmount = round((($rate * floatval($r->opening_amount)) / 12) * max($monthsElapsed, 0));
                $newAmount = round((($rate * floatval($opening)) / 12) * max($monthsRemaining, 0));

                $total += $previousAmount + $newAmount;
            } else {
                $total += round((($rate * floatval($r->opening_amount)) / 12) * 12);
            }
        }

        return $total;
    }


    function getCGRDepositInterest($memberNumber, $year = 'cgr_2021_2022')
    {
        $rows = DB::table($year)
            ->where('membernumber', $memberNumber)
            ->get();

        if ($rows->isEmpty()) {
            return null;
        }

        $rate = 0.08;
        $interestData = [];

        foreach ($rows as $r) {
            $openingAmount = floatval($r->opening_amount);

            // Monthly interest calculations
            $monthFields = [
                'April'     => 'april',
                'May'       => 'may',
                'June'      => 'june',
                'July'      => 'july',
                'August'    => 'aug',
                'September' => 'sep',
                'October'   => 'oct',
                'November'  => 'nov',
                'December'  => 'dece',
                'January'   => 'jan',
                'February'  => 'feb',
                'March'     => 'march',
            ];

            $monthlyInterest = [];
            $monthIndex = 0;
            foreach ($monthFields as $name => $field) {
                $amount = floatval($r->$field ?? 0);
                $monthlyInterest[$name] = round((($rate * $amount) / 12) * (12 - $monthIndex));
                $monthIndex++;
            }

            $openingInterest = round((($rate * $openingAmount) / 12) * 12);

            $interestData[] = [
                'opening_interest' => $openingInterest,
                'months' => $monthlyInterest,
            ];
        }

        return $interestData;
    }
    function getTotalShareAmount($sno)
    {
        $record = DB::table('share_amount')
            ->where('member_number', $sno)
            ->first();

        return $record ? $record->share_value : 'Not Available';
    }

    function getTotalShareDetails($sno)
    {
        $record = DB::table('share_amount')
            ->where('member_number', $sno)
            ->first();

        return $record ? $record->share_details : 'Not Available';
    }

    function remainingOpeningAmount($sno, $year = "cgr_2021_2022")
    {
        $total = 0;

        // Ensure $year is a valid table name (optional safety check)
        // You can add a whitelist or regex validation if needed.

        $record = DB::table($year)
            ->where('membernumber', $sno)
            ->first();

        if ($record) {
            $total = floatval($record->opening_amount) - floatval($record->withdrawamount);
        }

        return $total;
    }

    function getClosingAmount($sno, $year = 'cgr_2021_2022')
    {
        $totalDeposit = floatval($this->getTotalDeposit($sno, $year));
        $totalInterest = floatval($this->getTotalInterest($sno, $year));
        $remaining = floatval($this->remainingOpeningAmount($sno, $year));

        $amount = round($totalDeposit + $totalInterest + $remaining);

        return $amount;
    }
    function getTotalWithdrawal($sno, $year = "cgr_2021_2022")
    {
        // Optional: safety check for table name
        if (!preg_match('/^cgr_\d{4}_\d{4}$/', $year)) {
            throw new InvalidArgumentException('Invalid year table name.');
        }

        $record = DB::table($year)
            ->where('membernumber', $sno)
            ->first();

        if (!$record) {
            return "0";
        }

        $withdrawAmount = floatval($record->withdrawamount ?? 0);
        $withdrawDate = $record->withdrawdate ?? null;

        if ($withdrawAmount == 0) {
            return "0";
        }

        return round($withdrawAmount) . " On - " . $withdrawDate;
    }

    function getCGRYearSummary($memberNumber, $year)
    {
        $deposit = $this->getCGRDeposit($memberNumber, $year);
        $interest = $this->getCGRDepositInterest($memberNumber, $year);
        $totalDeposit = $this->getTotalDeposit($memberNumber, $year);
        $totalInterest = $this->getTotalInterest($memberNumber, $year);
        $closing = $this->getClosingAmount($memberNumber, $year);
        $withdrawal = $this->getTotalWithdrawal($memberNumber, $year);

        return [
            'deposit' => $deposit,
            'interest' => $interest,
            'totalDeposit' => $totalDeposit,
            'totalInterest' => $totalInterest,
            'closing' => $closing,
            'totalWithdrawal' => $withdrawal

        ];
    }
    function getCGRAllYearSummary($memberNumber)
    {
        $years = getLedgerYears(); // returns array of years
        $summary = [];

        foreach ($years as $year) {
            $yearTable = 'cgr_' . str_replace('-', '_', $year);
            $data = $this->getCGRYearSummary($memberNumber, $yearTable);
            $summary[$year] = $data;
        }

        return $summary;
    }


    public function home(Request $request)
    {
        $member = authMember();
        $memberNumber = $member->member_number;

        $cacheKey = "dashboard_summary_{$memberNumber}";

        // Data change after 1hr ,refresh it from setting to reset
        $data = Cache::remember($cacheKey, now()->addHour(), function () use ($memberNumber) {
            $rawSummary = $this->getCGRAllYearSummary($memberNumber);
            $share_amount = $this->getTotalShareAmount($memberNumber);
            $share_details = $this->getTotalShareDetails($memberNumber);

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

        $summary = $this->getCGRYearSummary($memberNumber, $yearTable);

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

    public function help_support(Request $request)
    {
        return Inertia::render('HelpSupport');
    }
}
