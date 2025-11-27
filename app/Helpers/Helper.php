<?php

use App\Models\Member;
use App\Models\UserDeviceDetails;
use Illuminate\Support\Facades\DB;

if (!function_exists('authMember')) {
    /**
     * Get the currently logged-in member (from session).
     *
     * @return \App\Models\Member|null
     */
    function authMember(array $select = ['*'])
    {
        $sessionMember = session('member');

        if (!$sessionMember || !isset($sessionMember['member_id'], $sessionMember['mobile'])) {
            return null;
        }

        return Member::where('member_number', $sessionMember['member_id'])
            ->where('phone_number', $sessionMember['mobile'])
            ->select($select)
            ->first();
    }
}
if (!function_exists('getLedgerYears')) {
    function getLedgerYears()
    {
        $startYear = 2021;
        $currentYear = (int)date('Y');
        $endYear = $currentYear + 1;   // e.g., 2025 → 2026

        $years = [];

        for ($y = $endYear - 1; $y >= $startYear; $y--) {
            $years[] = $y . '-' . ($y + 1);
        }

        return $years;
    }
}

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
    $totalDeposit = floatval(getTotalDeposit($sno, $year));
    $totalInterest = floatval(getTotalInterest($sno, $year));
    $remaining = floatval(remainingOpeningAmount($sno, $year));

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
    $deposit = getCGRDeposit($memberNumber, $year);
    $interest = getCGRDepositInterest($memberNumber, $year);
    $totalDeposit = getTotalDeposit($memberNumber, $year);
    $totalInterest = getTotalInterest($memberNumber, $year);
    $closing = getClosingAmount($memberNumber, $year);
    $withdrawal = getTotalWithdrawal($memberNumber, $year);

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
        $data = getCGRYearSummary($memberNumber, $yearTable);
        $summary[$year] = $data;
    }

    return $summary;
}

function getDashboardSummary($memberNumber)
{
    $years = getLedgerYears();
    // Get the current (latest) ledger year
    $year = $years[0];
    $yearTable = 'cgr_' . str_replace('-', '_', $year);

    $totalDeposit = getTotalDeposit($memberNumber, $yearTable);
    $totalInterest = getTotalInterest($memberNumber, $yearTable);
    $closing = getClosingAmount($memberNumber, $yearTable);
    $withdrawal = getTotalWithdrawal($memberNumber, $yearTable);

    return [
        'totalDeposit' => $totalDeposit,
        'totalInterest' => $totalInterest,
        'closing' => $closing,
        'totalWithdrawal' => $withdrawal

    ];
}

if (!function_exists('fcmTokenGet')) {
    /**
     * Get the currently logged-in member (from session).
     *
     * @return \App\Models\Member|null
     */
    function fcmTokenGet()
    {
        $auth_member = authMember(['member_number']);
        if (!$auth_member) {
            return null;
        }

        return UserDeviceDetails::where('member_number', $auth_member?->member_number)
            ->value('fcm_token');
    }
}