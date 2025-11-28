<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Services\FirebaseNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SendNotificationsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userTokens;
    protected $title;
    protected $body;
    protected $imageUrl;
    protected $actionUrl;

    /**
     * Create a new job instance.
     */
    public function __construct($userTokens, $title, $body, $imageUrl, $actionUrl)
    {
        $this->userTokens = $userTokens;
        $this->title = $title;
        $this->body = $body;
        $this->imageUrl = $imageUrl;
        $this->actionUrl = $actionUrl;
    }

    /**
     * Execute the job.
     */
    public function handle(FirebaseNotificationService $firebase)
    {
        Log::info("Firebase notification job started, total devices : " . count($this->userTokens));
        foreach ($this->userTokens as $token) {
            if (!$token) {
                continue;
            }

            $firebase->sendNotification(
                $token,
                $this->title,
                $this->body,
                $this->imageUrl,
                $this->actionUrl
            );
        }
        //   Notification::create([
        //     'user_id' => '0',
        //     'title' => $this->title,
        //     'actionUrl' =>  $this->actionUrl,
        //     'description' => Str::limit($this->title, 20),
        // ]);
    }
}