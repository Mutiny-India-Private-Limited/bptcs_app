@extends('layouts.app')

@section('title', ' Notification')

@section('header')
    <div class="mb-4">
        <h2 class="h4">Add Notification</h2>
        <p class="text-muted">Send notification to users</p>
    </div>
@endsection

@section('content')
    <div class="card shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
            <strong class="card-title">Create Notification</strong>
            <a class="btn btn-sm btn-primary" href="{{ route('admin.notifications.list') }}">List Notifications</a>
        </div>

        <div class="card-body">
            <form class="row g-3" method="POST" action="{{ route('admin.notifications.store') }}"
                enctype="multipart/form-data">
                @csrf

                <!-- User Selection -->
                <div class="col-md-6">
                    <label for="fcm_token" class="form-label">Member <span class="text-danger">*</span></label>
                    <select id="fcm_token" class="form-select" name="fcm_token">
                        <option value="all">All</option>
                        @foreach ($userDevice as $item)
                            <option value="{{ $item->fcm_token }}">
                                {{ $item->member_number }} - {{ $item->member?->name }} - {{ $item->device_name }}
                                - ({{ $item->updated_at->format('d M Y, H:i') }})
                            </option>
                        @endforeach

                    </select>
                    @error('fcm_token')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <!-- Title -->
                <div class="col-md-6">
                    <label for="title" class="form-label">Title <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="title" name="title" value="{{ old('title') }}">
                    @error('title')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <!-- Action URL -->
                <div class="col-md-6">
                    <label for="actionUrl" class="form-label">Action URL <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="actionUrl" name="actionUrl"
                        value="{{ old('actionUrl', 'https://app.bptcspatna.com/public/') }}">
                    @error('actionUrl')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <!-- Image -->
                <div class="col-md-6">
                    <label for="image" class="form-label">Image</label>
                    <input type="file" class="form-control" id="image" name="image">
                    @error('image')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <!-- Description -->
                <div class="col-12">
                    <label class="form-label">Description <span class="text-danger">*</span></label>
                    <textarea name="body" class="form-control" rows="4">{{ old('body') }}</textarea>
                    @error('body')
                        <small class="text-danger">{{ $message }}</small>
                    @enderror
                </div>

                <!-- Submit -->
                <div class="col-12 text-end">
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>

            </form>
        </div>
    </div>
@endsection
