<?php

namespace App\Http\Controllers;

use App\Jobs\SendNotificationsJob;
use App\Models\Notification;
use App\Models\UserDeviceDetails;
use App\Services\FirebaseNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FirebaseController extends Controller
{
    protected $firebaseNotificationService;



    public function __construct(FirebaseNotificationService $firebaseNotificationService)

    {
        $this->firebaseNotificationService = $firebaseNotificationService;
    }



    public function fireSendNotification(Request $request)

    {
        // Notification::create([
        //     'user_id' => '0',
        //     'title' => "New Notification Added",
        //     'actionUrl' => 'https://app.bptcspatna.com/public/notifications',
        //     'description' => $request->body,
        // ]);
        // return back()->with('success', 'Notification sent successfully.');

        // dd($request->all());

        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required',
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:1000',
            'image' => 'nullable|image|max:10240',
            'actionUrl' => 'required|url',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Retrieve the validated data
        $validatedData = $validator->validated();
        $imageUrl = '';
        $imagePath = '';

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '-' . $image->getClientOriginalName();
            $imagePath = public_path('assets/image/notifications/' . $imageName);
            // Move the image to the public directory
            $image->move(public_path('assets/image/notifications'), $imageName);
            // Generate the URL to the image
            $imageUrl = asset('assets/image/notifications/' . $imageName);
        }

        // Get FCM tokens (either a specific token or all users)
        if ($request->fcm_token == 'all') {
            $user_id = '0';
            $userTokens = UserDeviceDetails::orderBy('id', 'desc')
                ->get()
                // ->unique('member_number')
                ->pluck('fcm_token')
                ->toArray();
        } else {
            $user_id = UserDeviceDetails::where('fcm_token', $request->fcm_token)->value('member_number');
            $userTokens = UserDeviceDetails::where('member_number', $user_id)
                ->get()
                ->pluck('fcm_token')
                ->toArray();
            // $userTokens = [$request->fcm_token];
        }

        $notification = Notification::create([
            'user_id' => $user_id,
            'title' => $request->title,
            'actionUrl' =>   $request->actionUrl,
            'description' => ($request->body),
        ]);

        $hasError = false;

        foreach ($userTokens as $token) {
            if (!$token) {
                continue;
            }
            $sent = $this->firebaseNotificationService->sendNotification(
                $token,
                $request->title,
                Str::limit($request->body, 30),
                $imageUrl,
                $request->actionUrl
            );

            if (!$sent) {
                $hasError = true;
            }
        }

        // SendNotificationsJob::dispatch(
        //     $userTokens,
        //     $request->title,
        //     Str::limit($request->body, 20),
        //     $imageUrl,
        //     $request->actionUrl
        // );
        // Update notification status based on result
        if ($hasError) {
            $notification->update(['status' => '0']);
            return back()->with('error', 'Some notifications failed to send.');
        }

        return back()->with('success', 'Notification sent successfully');
    }


    public function fire_notifi_add()
    {

        $userDevice = UserDeviceDetails::orderBy("id", "desc")->get()->unique("member_number");
        return view('admin.notification.firebase_add', compact('userDevice'));

        // return Inertia::render('SendNotification', ['userDevice' => $userDevice]);
    }



    public function fire_notifi_list()
    {

        $notifications = Notification::orderBy('id', 'desc')->get();

        return view('admin.notification.manage', compact('notifications'));
    }
}