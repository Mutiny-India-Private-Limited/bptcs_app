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
        $firebaseServiceAccount = storage_path('app/public/firebase/test-6eb1d-82aefd6126a7.json');

        $this->firebase = $firebaseFactory->withServiceAccount($firebaseServiceAccount);
    }

    public static function sendNotification($token, $title, $body, $imageUrl, $actionUrl)
    {
        Log::info('Sending Firebase notification to user: ' . $token);
        $notification = Notification::create($title, $body, $imageUrl);

        $message = CloudMessage::withTarget('token', $token)
            ->withNotification($notification);
        $messaging = $this->firebase->createMessaging();
        // Add action URL if provided
        if ($actionUrl) {
            $message = $message->withData(['click_action' => $actionUrl]);
        }

        try {
            $messaging->send($message);
            Log::info('Firebase notification sent successfully to user: ' . $token);
            return true;
        } catch (\Exception $e) {
            Log::error('Firebase Notification Error: ' . $e->getMessage());
            return false;
        }
        dd('end');
        try {
            $messaging = $this->firebase->createMessaging();

            // Create the basic notification
            $notification = \Kreait\Firebase\Messaging\Notification::create($title, $body);

            // Create Android-specific configuration
            $androidConfig = \Kreait\Firebase\Messaging\AndroidConfig::fromArray([
                'priority' => 'high',
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'image' => $imageUrl,
                    'channel_id' => 'WEBMIPL-23',
                ],

            ]);
            $data = [
                'url-new' => $actionUrl,
            ];

            // Create the message with the target token, notification, and Android configuration
            $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('token', $token)
                ->withNotification($notification)
                ->withAndroidConfig($androidConfig)
                ->withData($data);

            // Send the message
            $messaging->send($message);

            Log::info("Notification sent to user: {$token}");
        } catch (InvalidMessage $e) {

            if ($e->getMessage() === 'UNREGISTERED' || $e->getMessage() === 'INVALID_ARGUMENT') {
                Log::warning("FCM token expired or invalid for user: {$token}");
            } else {
                throw $e;
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }

    public function tenderSendNotification($token, $title, $Organization, $actionUrl)
    {
        try {
            $messaging = $this->firebase->createMessaging();

            // Create the basic notification
            $notification = \Kreait\Firebase\Messaging\Notification::create($title, $Organization);

            // Create Android-specific configuration
            $androidConfig = \Kreait\Firebase\Messaging\AndroidConfig::fromArray([
                'priority' => 'high',
                'notification' => [
                    'title' => $title,
                    'body' => $Organization,
                    // 'image' =>"https://tender.mutinyindia.com/public/assets/image/tenders_mipl.png",
                    'channel_id' => 'WEBMIPL-23',
                ],

            ]);
            $data = [
                'url-new' => $actionUrl,
            ];

            // Create the message with the target token, notification, and Android configuration
            $message = \Kreait\Firebase\Messaging\CloudMessage::withTarget('token', $token)
                ->withNotification($notification)
                ->withAndroidConfig($androidConfig)
                ->withData($data);

            // Send the message
            $messaging->send($message);

            //log save
            Log::info("Firebase tender Send message:");
        } catch (InvalidMessage $e) {
            // Handling specific Firebase exceptions
            if ($e->getMessage() === 'UNREGISTERED' || $e->getMessage() === 'INVALID_ARGUMENT') {
                Log::warning("FCM token expired or invalid for user: {$token}");
            } else {
                Log::error("Invalid message error: " . $e->getMessage());
            }
        } catch (\Exception $e) {
            Log::info("Firebase tender error: $e");
            // throw $e;
        }
    }
}
