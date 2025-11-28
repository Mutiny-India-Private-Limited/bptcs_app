<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\UserDeviceDetails;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GeneralController extends Controller
{

    public function saveDeviceDetails(Request $request)
    {
        Log::info('Saving device details request received: ' . print_r($request->all(), true));

        // Validate request
        try {
            $validatedData = $request->validate([
                'member_number' => 'required|numeric',
                'fcm_token' => 'required|string',
                'device_name' => 'required|string',
                'device_type' => 'required|string',
                'device_id' => 'required|string',
            ]);


            // Validate member exists
            $member = Member::where('member_number', $validatedData['member_number'])->first();

            if (!$member) {
                Log::warning('Member not found', [
                    'member_number' => $validatedData['member_number']
                ]);

                return response()->json([
                    'error' => 'Invalid member number.',
                ], 404);
            }

            // Save or update device details
            $device = UserDeviceDetails::updateOrCreate(
                ['device_id' => $validatedData['device_id']], // lookup
                $validatedData // update or insert
            );

            Log::info('Device details saved successfully', [
                'device_id' => $device->id,
                'member_number' => $validatedData['member_number']
            ]);

            return response()->json([
                'message' => 'Data saved successfully!',
            ]);
        } catch (\Exception $e) {

            Log::error('Error saving device details', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }
}