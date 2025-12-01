<?php

namespace App\Http\Controllers;


use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\BlogManagement;
use App\Http\Controllers\Controller;
use App\Jobs\SendNotificationsJob;
use App\Models\UserDeviceDetails;
use App\Services\FirebaseNotificationService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    protected $firebaseNotificationService;

    public function __construct(FirebaseNotificationService $firebaseNotificationService)
    {
        $this->firebaseNotificationService = $firebaseNotificationService;
    }
    public function blogManage()
    {
        $data = BlogManagement::orderBy('id', 'desc')->get();
        return view('blogs.manage', compact('data'));
    }

    public function blogAdd($id = null)
    {
        $blogData = null;
        if ($id != null) {
            $blogData = BlogManagement::where('id', $id)->first();
        }
        $categories = BlogManagement::select('category')->distinct()->get();
        // return Inertia::render('Blogs/Add', ['blogData' => $blogData, 'category' => $category]);
        return view('blogs.form', compact('blogData', 'categories'));
    }
    // public function blogStore(Request $request, $id = null)
    // {

    //     $rules = [
    //         'heading' => 'required|string',
    //         'sub_heading' => 'nullable|string',
    //         'description' => 'required',
    //         'category' => 'required',
    //         'author' => 'required',
    //         'pub_date' => 'required',
    //         'featured_image' => 'required', // Default to required
    //     ];

    //     // Check if the request is for editing
    //     if ($request->isMethod('put') || $request->isMethod('patch')) {
    //         // If it's an update request, make 'featured_image' not required
    //         $rules['featured_image'] = 'nullable';
    //     }

    //     $validator = Validator::make($request->all(), $rules);


    //     if ($validator->fails()) {
    //         return redirect()->back()->withErrors($validator)->withInput();
    //     }

    //     if ($id != null) {
    //         $data = BlogManagement::find(decrypt($id));
    //         if ($request->file('featured_image')) {
    //             $image = $request->file('featured_image');
    //             $imageName = time() . '.' . $image->getClientOriginalExtension();
    //             Storage::putFileAs('public/blog', $image, $imageName);
    //         }
    //         if (isset($imageName)) {
    //             $data->featured_image = $imageName;
    //         }
    //         $data->category = $request->category;
    //         $data->author = $request->author;
    //         $data->pub_date = $request->pub_date;
    //         $data->heading = $request->heading;
    //         $data->sub_heading = $request->sub_heading;
    //         $data->description = $request->description;
    //         $data->save();

    //         return redirect()->route('admin.blogs.manage')->with('success', 'Blog Update Succesfully');
    //     } else {
    //         $data = new BlogManagement();
    //         // dd($request->featured_image);
    //         if ($request->file('featured_image')) {
    //             $image = $request->file('featured_image');
    //             $imageName = time() . '.' . $image->getClientOriginalExtension();
    //             Storage::putFileAs('public/blog', $image, $imageName);
    //         }

    //         $data->featured_image = $imageName;
    //         $data->category = $request->category;
    //         $data->author = $request->author;
    //         $data->pub_date = $request->pub_date;
    //         $data->heading = $request->heading;
    //         $data->sub_heading = $request->sub_heading;
    //         $data->description = $request->description;
    //         $data->save();
    //         return redirect()->back()->with('success', 'Blog Add Succesfully');
    //     }
    // }

    public function blogStore(Request $request, $id = null)
    {
        // Validation rules
        $rules = [
            'heading'        => 'required|string|max:255',
            'sub_heading'    => 'nullable|string|max:255',
            'description'    => 'required|string',
            'category'       => 'required|string',
            'author'         => 'required|string',
            'pub_date'       => 'required|date',

            // Featured image rules:
            'featured_image' => $id
                ? 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120'
                : 'required|image|mimes:jpg,jpeg,png,webp|max:5120',

            // Attachment (optional)
            'attachment'     => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png|max:10240',
        ];

        $validated = $request->validate($rules);

        // Create or Update model
        $blog = $id ? BlogManagement::findOrFail(decrypt($id)) : new BlogManagement();


        if ($request->hasFile('featured_image')) {

            // delete old image if exists
            if ($id && $blog->featured_image && Storage::disk('public')->exists($blog->featured_image)) {
                Storage::disk('public')->delete($blog->featured_image);
            }

            $blog->featured_image = $request->file('featured_image')
                ->store('blog/image', 'public');
        }


        if ($request->hasFile('attachment')) {

            // delete old attachment if exists
            if ($id && $blog->attachment && Storage::disk('public')->exists($blog->attachment)) {
                Storage::disk('public')->delete($blog->attachment);
            }

            $blog->attachment = $request->file('attachment')
                ->store('blog/attachment', 'public');
        }

        // Fill other fields
        $blog->heading      = $validated['heading'];
        $blog->sub_heading  = $validated['sub_heading'] ?? null;
        $blog->description  = $validated['description'];
        $blog->category     = $validated['category'];
        $blog->author       = $validated['author'];
        $blog->pub_date     = $validated['pub_date'];

        $blog->save();

        if (!$id) {
            $actionUrl = route('blog_details', ['id' => $blog->id]);
            $title = 'New Blog Added';
            $user_id = '0';
            $description = Str::limit($blog->heading, 30);
            $notification = Notification::create([
                'user_id' => $user_id,
                'title' => $title,
                'actionUrl' => $actionUrl,
                'description' => $blog->heading,
            ]);
            $userTokens = UserDeviceDetails::orderBy('id', 'desc')
                ->get()
                // ->unique('member_number')
                ->pluck('fcm_token')
                ->toArray();

            $imageUrl = $blog->featured_image ? asset('storage/' . $blog->featured_image) : null;

            $hasError = false;

            $sent = $this->firebaseNotificationService->sendNotification(
                $userTokens,
                $title,
                $description,
                $imageUrl,
                $actionUrl
            );

            if (!$sent) {
                $hasError = true;
            }

            if ($hasError) {
                $notification->update(['status' => '0']);
            }

            // SendNotificationsJob::dispatch(
            //     $userTokens,
            //     $title,
            //     $description,
            //     $imageUrl,
            //     $actionUrl
            // );
        }


        return redirect()
            ->route('admin.blogs.manage')
            ->with('success', $id ? 'Blog Updated Successfully' : 'Blog Added Successfully');
    }

    public function deleteblog($id)
    {
        $blog = BlogManagement::findOrFail($id);

        // Delete featured image if exists
        if ($blog->featured_image && Storage::disk('public')->exists($blog->featured_image)) {
            Storage::disk('public')->delete($blog->featured_image);
        }

        // Delete attachment if exists
        if ($blog->attachment && Storage::disk('public')->exists($blog->attachment)) {
            Storage::disk('public')->delete($blog->attachment);
        }

        // Delete the blog record
        $blog->delete();

        return redirect()
            ->back()
            ->with('success', 'Blog deleted successfully');
    }


    public function blogStatus(Request $request)
    {
        $id = request()->input('itemId');
        $data = BlogManagement::findOrFail($id);
        $data->status = request()->input('status');
        $data->save();
        return response()->json(['success' => true, 'new_status' => $data->status]);
    }
    public function blogs(Request $request)
    {

        $today = Carbon::now()->toDateString();
        $blogs = BlogManagement::where([['status', '1'], ['pub_date', '<=', $today]])
            ->when($request->filled('seachCategory'), function ($query) use ($request) {
                $query->where('category', 'like', '%' . $request->seachCategory . '%');
            })->orderBy('pub_date', 'desc')->orderBy('id', 'desc')
            ->get();
        $categoryData = BlogManagement::where([['status', '1'], ['pub_date', '<=', $today]])->get();
        return Inertia::render('Blogs/View', ['blogs' => $blogs, 'categoryData' => $categoryData]);
    }
    public function blog_details(request $request)
    {
        $today = Carbon::now()->toDateString();

        // $blog = BlogManagement::where('heading', urldecode($request->heading))->first();
        $blog = BlogManagement::where('id', $request->id)
            ->where('status', '1')
            ->first();

        if (!$blog) {
            return redirect()->route('blogs')->with('error', 'Blog Not Found');
        }
        //related blog data get
        $reletedBlog = BlogManagement::where([['category', @$blog->category], ['pub_date', '<=', $today]])
            ->where('status', '1')
            ->orderBy('id', 'desc')->get();
        return Inertia::render('Blogs/Show', ['blog' => $blog, 'reletedBlog' => $reletedBlog]);
        // return view('blog.blog_details', compact('blog', 'reletedBlog'));
    }
}