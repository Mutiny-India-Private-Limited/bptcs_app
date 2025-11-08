<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle login verification (no user table).
     */
    public function login(Request $request)
    {
        $request->validate([
            'member_id' => 'required|numeric',
            'mobile' => 'required|numeric',
        ]);

        if ($request->member_id === '12345' && $request->mobile === '12345') {
            // Fake member data for testing
            $member = (object) [
                'sno' => 1,
                'member_number' => '12345',
                'name' => 'Test Member',
                'phone_number' => '12345',
                'office_address' => 'Head Office',
            ];

            // Store session to act as login
            session([
                'member_logged_in' => true,
                'member' => [
                    'id' => $member->sno,
                    'member_id' => $member->member_number,
                    'name' => $member->name,
                    'mobile' => $member->phone_number,
                    'office' => $member->office_address,
                ],
            ]);

            return redirect()->route('home')->with('success', 'Welcome back! ' . $member->name);
        }
        //  else {
        //     return back()->withErrors(['login' => 'Error: Use test details - 12345.']);
        // }

        // Check against the members database
        $member = Member::where('member_number', $request->member_id)
            ->where('phone_number', $request->mobile)
            ->first();
        if (!$member) {
            return back()->withErrors(['login' => 'Invalid Member ID or Mobile Number.']);
        }

        // Set session data (acts like auth)
        session([
            'member_logged_in' => true,
            'member' => [
                'id' => $member->sno,
                'member_id' => $member->member_number,
                'name' => $member->name,
                'mobile' => $member->phone_number,
                'office' => $member->office_address,
            ],
        ]);

        return redirect()->route('home')->with('success', 'Welcome back! ' . $member->name);
    }

    public function logout(Request $request)
    {
        $request->session()->flush();
        return redirect()->route('login');
    }
}