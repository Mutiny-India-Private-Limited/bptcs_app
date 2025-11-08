<?php

use App\Models\Member;

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
        $years = [
            '2025-2026',
            '2024-2025',
            '2023-2024',
            '2022-2023',
            '2021-2022',
        ];

        return $years;
    }
}
