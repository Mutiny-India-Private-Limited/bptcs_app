@extends('layouts.app')

@section('title', 'Notification')

@section('header')
    <div class="mb-4">
        <h2 class="h4">Notifications List</h2>
        <p class="text-muted">All notifications sent to users</p>
    </div>
@endsection

@section('content')
    <div class="card shadow-sm">

        <div class="card-header d-flex justify-content-between align-items-center">
            <strong class="card-title">Notifications List</strong>
            <a class="btn btn-sm btn-primary" href="{{ route('admin.notifications.add') }}">Add Notifications</a>
        </div>

        <div class="card-body">

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Action URL</th>
                            <th>Description</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($notifications as $item)
                            <tr>
                                <td>{{ $loop->iteration }}</td>
                                <td>{{ $item->user_id == 0 ? 'All' : $item->user_id }}</td>

                                @if ($item->image)
                                    <td><img src="{{ $item->image }}" width="120px" alt="{{ $item->title }}"></td>
                                @else
                                    <td>No image</td>
                                @endif

                                <td>{{ $item->title }}</td>
                                <td>{{ $item->actionUrl }}</td>
                                <td>{{ $item->description }}</td>
                                <td>{{ date('d/M/Y', strtotime($item->created_at)) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <hr>

        </div>
    </div>
@endsection
