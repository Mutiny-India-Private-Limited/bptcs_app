<?php

// app/Services/FirebaseNotificationService.php

namespace App\Services;

use App\Models\FirebaseNotiLog;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase;
use Kreait\Firebase\Exception\Messaging\InvalidMessage;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Kreait\Firebase\Messaging\AndroidConfig;
use Kreait\Laravel\Firebase\Facades\Firebase as FacadesFirebase;

class FirebaseNotificationService
{
    protected $firebase;

    public function __construct(Firebase\Factory $firebaseFactory)
    {

        // $firebaseServiceAccount = storage_path('app/public/firebase/tenders-mipl-firebase-adminsdk-joajk-cce3fe0a32.json');
        $firebaseServiceAccount = storage_path('app/public/firebase/bpntcs-e259d-firebase-adminsdk-fbsvc-07507fed3e.json');

        $this->firebase = $firebaseFactory->withServiceAccount($firebaseServiceAccount);
    }

    // public static function sendNotification($token, $title, $body, $imageUrl, $actionUrl)
    // {
    //     Log::info('Sending Firebase notification to user: ' . $token);
    //     $notification = Notification::create($title, $body, $imageUrl);

    //     $message = CloudMessage::withTarget('token', $token)
    //         ->withNotification($notification);
    //     $messaging = $this->firebase->createMessaging();
    //     // Add action URL if provided
    //     if ($actionUrl) {
    //         $message = $message->withData(['click_action' => $actionUrl]);
    //     }

    //     try {
    //         $messaging->send($message);
    //         Log::info('Firebase notification sent successfully to user: ' . $token);
    //         return true;
    //     } catch (\Exception $e) {
    //         Log::error('Firebase Notification Error: ' . $e->getMessage());
    //         return false;
    //     }
    //     dd('end');
    //     try {
    //         $messaging = $this->firebase->createMessaging();

    //         // Create the basic notification
    //         $notification = \Kreait\Firebase\Messaging\Notification::create($title, $body);

    //         // Create Android-specific configuration
    //         $androidConfig = \Kreait\Firebase\Messaging\AndroidConfig::fromArray([
    //             'priority' => 'high',
    //             'notification' => [
    //                 'title' => $title,
    //                 'body' => $body,
    //                 'image' => $imageUrl,
    //                 'channel_id' => 'WEBMIPL-23',
    //             ],

    //         ]);
    //         $data = [
    //             'url-new' => $actionUrl,
    //         ];

    //         // Create the message with the target token, notification, and Android configuration
    //         $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('token', $token)
    //             ->withNotification($notification)
    //             ->withAndroidConfig($androidConfig)
    //             ->withData($data);

    //         // Send the message
    //         $messaging->send($message);

    //         Log::info("Notification sent to user: {$token}");
    //     } catch (InvalidMessage $e) {

    //         if ($e->getMessage() === 'UNREGISTERED' || $e->getMessage() === 'INVALID_ARGUMENT') {
    //             Log::warning("FCM token expired or invalid for user: {$token}");
    //         } else {
    //             throw $e;
    //         }
    //     } catch (\Exception $e) {
    //         throw $e;
    //     }
    // }

    public function sendNotification($token, $title, $body, $imageUrl, $actionUrl)
    {
        try {
            Log::info("Preparing to send notification", ['token' => $token, 'title' => $title, 'body' => $body]);

            $messaging = $this->firebase->createMessaging();

            // Create the basic notification
            $notification = \Kreait\Firebase\Messaging\Notification::create($title, $body);
            // Log::info("Notification object created", ['notification' => $notification]);

            // Create Android-specific configuration
            $androidConfig = \Kreait\Firebase\Messaging\AndroidConfig::fromArray([
                'priority' => 'high',
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'image' => $imageUrl,
                    'channel_id' => 'BP_TCS_Notifications',
                ],
            ]);
            // Log::info("Android config created", ['androidConfig' => $androidConfig]);

            $data = [
                'url-new' => $actionUrl,
            ];
            // Log::info("Data payload prepared", ['data' => $data]);

            // Create the message with the target token, notification, and Android configuration
            $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('token', $token)
                ->withNotification($notification)
                ->withAndroidConfig($androidConfig)
                ->withData($data);
            Log::info("Cloud message prepared", ['message' => $message]);

            // Send the message
            $messaging->send($message);
            Log::info("Notification successfully sent", ['token' => $token]);
            return true;
        } catch (InvalidMessage $e) {
            if ($e->getMessage() === 'UNREGISTERED' || $e->getMessage() === 'INVALID_ARGUMENT') {
                Log::warning("FCM token expired or invalid for user", ['token' => $token, 'error' => $e->getMessage()]);
                return false;
            } else {
                Log::error("InvalidMessage exception occurred", ['token' => $token, 'error' => $e->getMessage()]);
                return false;
                // throw $e;
            }
        } catch (\Exception $e) {
            Log::error("Exception while sending notification", ['token' => $token, 'error' => $e->getMessage()]);
            return false;
            // throw $e;
        }
    }
}