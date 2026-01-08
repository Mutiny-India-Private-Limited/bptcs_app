<?php

namespace App\Services;

// use App\Models\SmsLog;

use App\Models\SmsLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{

    public static function sendMessage($mobile, $type, $data = [])
    {
        $authKey   = env('MSG91_AUTH_KEY');
        $senderId  = env('MSG91_SENDER_ID');
        $country   = env('MSG91_COUNTRY_CODE', '91');
        $templates = [
            'otp'    => env('MSG91_VERIFY_OTP_TEMPLATE_ID'),
        ];

        if (!isset($templates[$type])) {
            Log::error("SMS type '{$type}' is not configured.");
            return ['type' => 'error', 'message' => 'Invalid message type'];
        }

        $templateId = $templates[$type];

        // Prepare dynamic message based on type
        switch ($type) {
            case 'otp':
                $otp  = $data['otp'];
                $message = "Hi,$otp is your mobile number verification code,this code is valid for next 24 hours.(Mutiny India)";
                break;

            default:
                $message = $data['message'] ?? 'Hello!';
        }

        $postData = [
            'authkey'     => $authKey,
            'mobiles'     => $mobile,
            'message'     => $message,
            'sender'      => $senderId,
            'country'     => $country,
            'DLT_TE_ID'   => $templateId,
            'unicode'     => '1', // Unicode enabled for emoji/birthday use
        ];

        $url = "https://control.msg91.com/api/sendhttp.php";

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $postData,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
        ]);

        $output = curl_exec($ch);

        if (curl_errno($ch)) {
            Log::error('MSG91 cURL Error: ' . curl_error($ch));
            return ['type' => 'error', 'message' => curl_error($ch)];
        }

        curl_close($ch);
        Log::info("MSG91 [$type] SMS sent to $mobile", ['response' => $output]);

        // Log successful message
        SmsLog::create([
            'phone_number' => $mobile,
            'type'         => $type,
            'message'      => $message,
            'status'       => true,
            'sent_at'      => now(),
        ]);

        return [
            'type'       => 'success',
            'message_id' => trim((string) $output),
        ];
    }
}