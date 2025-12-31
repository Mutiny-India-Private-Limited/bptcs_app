<?php

namespace App\Http\Controllers;

use App\Models\GuestDevice;
use App\Models\Member;
use App\Models\UserDeviceDetails;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
    public function saveGuestDeviceDetails(Request $request)
    {
        Log::info('Saving guest device details', $request->all());

        try {
            $validated = $request->validate([
                'fcm_token'   => 'required|string',
                'device_id'   => 'required|string',
                'device_name' => 'nullable|string',
                'device_type' => 'nullable|string',
            ]);

            $device = GuestDevice::updateOrCreate(
                ['device_id' => $validated['device_id']],
                $validated
            );

            Log::info('Guest device saved successfully', [
                'device_id' => $device->id
            ]);

            return response()->json([
                'message' => 'Guest device saved successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error saving guest device', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Server error',
            ], 500);
        }
    }

    public function generateToken(Request $request)
    {
        Log::info('Generate biometric token request received', [
            'ip' => $request->ip(),
        ]);

        $member = authMember(); // user already logged in

        if (!$member) {
            Log::warning('Biometric token generation failed: not logged in', [
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Not logged in'
            ], 401);
        }

        DB::beginTransaction();

        try {
            $token = Str::random(64);
            $hashedToken = hash('sha256', $token);

            // If model has no primary key, prefer query builder
            DB::table('member_details')
                ->where('member_number', $member->member_number)
                ->update([
                    'biometric_token' => $hashedToken,
                ]);

            DB::commit();

            Log::info('Biometric token enrolled', [
                'member_number' => $member->member_number,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'token' => $token
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Biometric token generation failed', [
                'error' => $e->getMessage(),
                'member_number' => $member->member_number ?? null,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate token'
            ], 500);
        }
    }

    // Login with token
    public function loginWithToken(Request $request)
    {
        Log::info('Biometric login attempt', [
            'ip' => $request->ip(),
        ]);

        if (!$request->filled('token')) {
            Log::warning('Biometric login failed: token missing', [
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Token is required'
            ], 400);
        }

        $hashedToken = hash('sha256', $request->token);

        DB::beginTransaction();

        try {
            // Lock row to prevent token reuse (important)
            $member = DB::table('member_details')
                ->where('biometric_token', $hashedToken)
                ->lockForUpdate()
                ->first();

            if (!$member) {
                DB::rollBack();

                Log::warning('Biometric login failed: invalid token', [
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token'
                ], 401);
            }

            // Rotate token
            $newToken = Str::random(64);
            $newHashedToken = hash('sha256', $newToken);

            // DB::table('member_details')
            //     ->where('member_number', $member->member_number)
            //     ->update([
            //         'biometric_token' => $newHashedToken,
            //     ]);

            DB::commit();

            // Session should be set AFTER commit
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

            Log::info('Biometric login successful', [
                'member_number' => $member->member_number,
                'ip' => $request->ip(),
            ]);

            Log::info('Biometric token rotated after login', [
                'member_number' => $member->member_number,
            ]);

            return response()->json([
                'success' => true,
                'new_token' => $newToken,
                'message' => 'Logged in successfully',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Biometric login failed due to exception', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Login failed'
            ], 500);
        }
    }
}