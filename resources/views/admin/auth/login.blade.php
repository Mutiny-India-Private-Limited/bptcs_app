@extends('layouts.guest')

@section('title', 'Admin Login')

@section('content')
    <div class="card shadow-sm">
        <div class="card-body">
            <h4 class="text-center mb-4">Admin Login</h4>

            <form method="POST" action="{{ route('admin.login.submit') }}">
                @csrf

                <div class="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>

                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
        </div>
    </div>
@endsection
