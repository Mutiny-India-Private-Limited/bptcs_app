@extends('layouts.app')

@section('title', 'Blogs')

@section('header')
    <div class="mb-4">
        <h2 class="h4">Manage Blogs</h2>
        <p class="text-muted">View, edit, or add blogs</p>
    </div>
@endsection

@section('content')
    <div class="card shadow-sm mb-4 min-vh-100">
        <div class="card-header d-flex justify-content-between align-items-center">
            <strong class="card-title">Blog List</strong>
            <a class="btn btn-sm btn-primary" href="{{ route('admin.blogs.add') }}">Add Blog</a>
        </div>

        <div class="card-body table-responsive">
            <table class="table table-bordered align-middle">
                <thead>
                    <tr>
                        <th class="" width="5%">Actions</th>
                        <th>Title</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    @if (count($data) > 0)
                        @foreach ($data as $d)
                            <tr>

                                <td class="">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input toggle-status-contact" type="checkbox" role="switch"
                                            id="flexSwitchCheckDefault" {{ $d->status == '1' ? 'checked' : '' }}
                                            data-item-id="{{ $d->id }}" />
                                    </div>
                                </td>
                                <td> <a href="{{ route('admin.blogs.edit', [$d->id]) }}"
                                        class="text-primary">{{ Str::limit($d->heading, 70) }}
                                    </a>
                                </td>
                                <td>{{ date('d M Y', strtotime($d->created_at)) }}</td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
                            <td colspan="5" class="text-center">No data found</td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>
    </div>

@endsection
