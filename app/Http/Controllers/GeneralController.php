<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\UserDeviceDetails;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function saveDeviceDetails(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'email_id' => 'required|email', //email_id = member_number
                'fcm_token' => 'required|string',
                'device_name' => 'required|string',
                'device_type' => 'required|string',
            ]);

            // Simulate saving to the database
            // Example: DeviceToken::create($validatedData);

            //Save data to the database (example)
            // $email = User::where('email', $request->email_id)->first();
            $member = Member::where('member_number', $request->email_id)->first();

            if ($member) {
                UserDeviceDetails::updateOrCreate(
                    ['fcm_token' => $validatedData['fcm_token']],
                    $validatedData

                );
            }

            // Keep session alive
            // $request->session()->put('last_active', now());

            return response()->json([
                'message' => 'Data saved successfully!',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}