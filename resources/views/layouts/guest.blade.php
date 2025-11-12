<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Login')</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome (optional) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <style>
        body {
            min-height: 100vh;
            background: #f0f2f5;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .guest-container {
            width: 100%;
            max-width: 400px;
        }
    </style>
</head>

<body>

    <div class="guest-container">
        @yield('content')
    </div>

    <script>
        function showToast(type, message) {
            Swal.fire({
                toast: true,
                icon: type,
                title: message,
                position: "bottom-end",
                timer: 4000,
                showConfirmButton: false,
            });
        }

        @if (Session::has('success'))
            showToast('success', "{{ Session::get('success') }}");
        @endif

        @if (Session::has('error'))
            showToast('error', "{{ Session::get('error') }}");
        @endif
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>
