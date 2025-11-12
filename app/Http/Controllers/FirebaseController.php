<?php

namespace App\Http\Controllers;

use App\Jobs\SendNotificationsJob;
use App\Models\Notification;
use App\Models\UserDeviceDetails;
use App\Services\FirebaseNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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
        Notification::create([
            'user_id' => '0',
            'title' => "New Notification Added",
            'actionUrl' => 'https://app.bptcspatna.com/public/notifications',
            'description' => $request->body,
        ]);
        return back()->with('success', 'Notification sent successfully.');

        dd($request->all());

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

            $userTokens = UserDeviceDetails::orderBy('id', 'desc')

                ->get()

                ->unique('email_id')

                ->pluck('fcm_token')

                ->toArray();
        } else {

            $userTokens = [$request->fcm_token];
        }

        // Notification::create([
        //     'user_id' => '0',
        //     'title' => $request->title,
        //     'actionUrl' => $request->actionUrl,
        //     'image' => $imageUrl,
        //     'description' => $request->body,
        // ]);

        // dd($userTokens);
        SendNotificationsJob::dispatch(
            $userTokens,
            $request->title,
            $request->body,
            $imageUrl,
            $request->actionUrl
        );
        // Notification::create([
        //     'user_id' => '0',
        //     'title' => $request->title,
        //     'actionUrl' => $request->actionUrl,
        //     'image' => $imageUrl,
        //     'description' => $request->body,
        // ]);

        // foreach ($userTokens as $token) {

        //     if (!$token || $token == null) {

        //         continue;
        //     }

        //     // try {

        //     $this->firebaseNotificationService->sendNotification(

        //         $token,

        //         $request->title,

        //         $request->body,

        //         $imageUrl,

        //         $request->actionUrl

        //     );



        //     $userDevice = UserDeviceDetails::where('fcm_token', $token)->first();

        //     $notiLog = FirebaseNotiLog::create([

        //         'user_id' => $userDevice->email_id,

        //         'title' => $validatedData['title'],

        //         'description' => $validatedData['body'],

        //         'image' => $imageUrl,

        //         'actionUrl' => $validatedData['actionUrl'],

        //     ]);


        // }



        return back()->with('success', 'Notification sent successfully to selected users.');
    }



    public function fire_notifi_add()
    {

        $userDevice = UserDeviceDetails::orderBy("id", "desc")->get()->unique("email_id");
        return view('admin.notification.firebase_add', compact('userDevice'));

        // return Inertia::render('SendNotification', ['userDevice' => $userDevice]);
    }



    public function fire_notifi_list()
    {

        $notifications = Notification::orderBy('id', 'desc')->get();

        return view('admin.notification.manage', compact('notifications'));
    }
}
