@extends('layouts.app')

@section('title', 'SMS Logs')

@section('header')
    <div class="mb-4">
        <h2 class="h4">SMS Logs</h2>
        <p class="text-muted">All sent SMS records</p>
    </div>
@endsection

@section('content')
    <div class="card shadow-sm">

        <div class="card-header">
            <strong class="card-title">SMS Logs List</strong>
        </div>

        <form method="GET" action="{{ route('admin.sms.list') }}" class="row g-2 mb-3 p-2">
            <div class="col-md-4">
                <input type="text" name="phone_number" class="form-control" placeholder="Search by phone number"
                    value="{{ request('phone_number') }}">
            </div>

            <div class="col-md-2">
                <button type="submit" class="btn btn-primary w-100 btn-sm">
                    Search
                </button>
            </div>

            @if (request()->filled('phone_number'))
                <div class="col-md-2">
                    <a href="{{ route('admin.sms.list') }}" class="btn btn-secondary w-100  btn-sm">
                        Reset
                    </a>
                </div>
            @endif
        </form>

        <div class="card-body">

            <div class="table-responsive" style="max-height: 500px;overflow:auto">
                <table class="table table-bordered align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone </th>
                            <th>Type</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Sent At</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($smsLogs as $log)
                            <tr>
                                <td>{{ $loop->iteration + ($smsLogs->currentPage() - 1) * $smsLogs->perPage() }}</td>
                                <td>{{ $log->memberDetail?->name ?? '-' }}</td>
                                <td>{{ $log->phone_number }}</td>
                                <td>{{ ucfirst($log->type) }}</td>
                                <td style="max-width: 400px;">{{ $log->message }}</td>
                                <td>
                                    @if ($log->status == 1)
                                        <span class="text-success fw-bold">Sent</span>
                                    @else
                                        <span class="text-danger fw-bold">Failed</span>
                                    @endif
                                </td>
                                <td>{{ \Carbon\Carbon::parse($log->sent_at)->format('d-M-Y H:i') }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center text-muted">No SMS logs found</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="mt-3">
                {{ $smsLogs->links('pagination::bootstrap-5') }}

            </div>

        </div>
    </div>
@endsection
