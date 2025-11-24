<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    {{-- <title>BPTCS - Homepage</title> --}}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/images/favicon.ico') }}" />

    <!-- Tailwind CSS CDN -->
    {{-- <script src="https://cdn.tailwindcss.com"></script> --}}
    <style>
        /* Custom App Container for Bottom Nav */
        .app-container {
            padding-bottom: 4.5rem;
            /* Space for fixed nav */
        }

        /* Card hover effect */
        .card-focus {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-focus:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        /* Floating Home Button in Nav */
        .home-nav-button {
            background-color: #4f46e5;
            /* Indigo-600 */
            color: white;
            border-radius: 9999px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 0.75rem;
            border: 4px solid white;
        }

        /* Background pattern for header */
        .pattern-dots-md {
            background-image: radial-gradient(#ffffff 1px, transparent 1px);
            background-size: 15px 15px;
        }
    </style>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>


<body class="font-sans antialiased">

    @php
        $fcmToken = fcmTokenGet();
    @endphp
    <input type="hidden" name="hidden_fcm_token" class="fcmToken" value="{{ $fcmToken }}" />
    @inertia
</body>

</html>
