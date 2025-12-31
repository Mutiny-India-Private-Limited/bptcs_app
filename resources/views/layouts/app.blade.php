<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Dashboard')</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/images/favicon.ico') }}" />
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.18/summernote-bs4.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        body {
            min-height: 100vh;
        }

        .sidebar {
            min-width: 250px;
            max-width: 250px;
            background-color: #f8f9fa;
            min-height: 100vh;
        }

        .sidebar .nav-link.active {
            background-color: #0d6efd;
            color: #fff;
        }

        .sidebar .nav-link i {
            margin-right: 10px;
        }

        .content {
            flex: 1;
        }
    </style>
</head>

<body>
    <div class="d-flex">

        <!-- Sidebar -->
        @include('layouts.partials.sidebar')
        <!-- Main Content -->
        <div class="content flex-grow-1">
            <!-- Top Navbar -->
            <nav class="navbar navbar-expand navbar-light bg-light px-4 ">
                <a class="navbar-brand" href="#">@yield('title', 'Welcome')</a>

                <div class="ms-auto d-flex align-items-center">

                    <span class="me-3">
                        {{ Auth::guard('admin')->user()->name ?? '' }}
                    </span>

                    <form action="{{ route('admin.logout') }}" method="POST" class="mb-0">
                        @csrf
                        <button type="submit" class="btn btn-outline-danger">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </form>

                </div>
            </nav>


            <!-- Page Content -->
            <div class="container-fluid p-4">
                @yield('content')
            </div>
        </div>

    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.18/summernote-bs4.min.js"></script>
    <script>
        $(document).ready(function() {
            $('#summernote').summernote({
                height: 300, // Set editor height
                minHeight: null, // Set minimum height of editor
                maxHeight: null, // Set maximum height of editor
                focus: true // Set focus to editable area after initializing summernote
            });
            $('.select2').select2({
                placeholder: "Select an option",
                allowClear: true,
                dropdownParent: $('#exampleModal'),
            });
            $('.select2_source').select2({
                placeholder: "Select an option",
                allowClear: true,
                //  dropdownParent: $('#exampleModal'),
            });
            $('.select-new-value').select2({
                tags: "true",
                placeholder: "Select an option",
                allowClear: true,
            });
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.full.js"></script>
    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            $('.toggle-status-contact').on('change', function() {
                const itemId = $(this).data('item-id');
                const status = $(this).is(':checked') ? 1 : 0;

                $.ajax({
                    url: "{{ route('admin.blogs.status') }}", // or use '/admin/blogs/status'
                    type: "POST",
                    data: {
                        _token: "{{ csrf_token() }}",
                        itemId: itemId,
                        status: status
                    },
                    success: function(response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Status Updated',
                                text: 'Blog status changed successfully!',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Something went wrong while updating status.',
                            });
                        }
                    },
                    error: function() {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Unable to update status. Please try again later.',
                        });
                    }
                });
            });
        });
    </script>

    <script>
        function showToast(type, message) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                iconColor: type === 'success' ? 'green' : 'red',
                customClass: {
                    popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 6000,
                timerProgressBar: true,
            });

            Toast.fire({
                icon: type,
                title: message,
            });
        }

        @if (Session::has('success'))
            showToast('success', '{{ Session::get('success') }}');
        @endif

        @if (Session::has('error'))
            showToast('error', '{{ Session::get('error') }}');
        @endif
    </script>


</body>

</html>
