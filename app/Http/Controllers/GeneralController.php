<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function saveDeviceDetails(Request $request)
    {

        // $data = ($request->all());

        try {
            $validatedData = $request->validate([
                'email_id' => 'required|email',
                'fcm_token' => 'required|string',
                'fcm_installation_id' => 'required|string',
                'unique_installation_id' => 'required|string',
            ]);
            dd($validatedData);
            // $email = User::where('email', $request->email_id)->first();
            // if ($email) {
            //     UserDeviceDetails::updateOrCreate(
            //         ['fcm_token' => $validatedData['fcm_token']],
            //         $validatedData
            //     );
            // }

            // Keep session alive
            $request->session()->put('last_active', now());

            return response()->json([
                'message' => 'Data saved successfully!',

            ]);
        } catch (\Exception $e) {
            //Log::error('Error saving data:', ['exception' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
