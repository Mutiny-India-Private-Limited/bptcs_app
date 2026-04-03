<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BPTCS - Member Deposits Dashboard</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link rel="icon" type="image/x-icon" href="{{ asset('assets/images/favicon.ico') }}" />

    <style>
        /* Scrollbar for sections */
        .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(100, 100, 100, 0.3);
            border-radius: 3px;
        }

        .card-hover:hover {
            transform: translateY(-2px);
            transition: all 0.2s;
        }
    </style>
</head>

<body class="bg-gray-100">

    @php
        $totalFd = 0;
        foreach ($fd ?? [] as $item) {
            $totalFd += $item['transaction']['amount'] ?? ($item['amount'] ?? 0);
        }
        $totalRd = 0;
        foreach ($rd ?? [] as $item) {
            $totalRd += $item['amount'] ?? ($item['transaction']['amount'] ?? 0);
        }
        $totalSavings = $savings[0]['amount'] ?? 0;
        $cgrAmount = $totals['closing'] ?? 0;

        function statusColor($status)
        {
            $s = strtolower($status ?? 'active');
            if ($s === 'active' || $s === 'new') {
                return 'text-green-600 bg-green-50';
            }
            if ($s === 'closed') {
                return 'text-red-600 bg-red-50';
            }
            return 'text-gray-500 bg-gray-50';
        }
    @endphp


    <div class="max-w-7xl mx-auto p-6 space-y-6">

        <!-- MEMBER FILTER / SEARCH FORM WITH DEFAULT MEMBER NUMBER -->
        <form method="GET" action=""
            class="bg-white border rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">

            <!-- Numeric Search Input -->
            <div class="flex-1">
                <label for="memberSearch" class="sr-only">Search Member</label>
                <input type="number" id="memberSearch" name="member" value="{{ request('member', '') }}"
                    placeholder="Search by Member No"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
            </div>

            <!-- Buttons -->
            <div class="flex gap-2">
                <button type="submit"
                    class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
                    Search
                </button>
                @if (request('member'))
                    <a href="{{ request()->url() }}"
                        class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">
                        Reset
                    </a>
                @endif
            </div>
        </form>
        <!-- PAGE HEADER -->
        <div>
            <h1 class="text-2xl font-bold text-gray-800">Deposits</h1>
            <p class="text-sm text-gray-500">Fixed, Recurring & Savings Accounts</p>
        </div>
        @if (!empty($member))
            <!-- MEMBER DETAILS SECTION -->
            <div class="bg-white border rounded-lg shadow-sm p-6 mb-6">
                <h2 class="text-lg font-bold text-gray-800 mb-3">Member Details</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">

                    <div>
                        <span class="font-semibold">Name:</span> {{ $member['name'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Member Number:</span> {{ $member['member_number'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">CGR Number:</span> {{ $member['cgr_number'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Date of Birth:</span> {{ $member['date_of_birth'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Father's Name:</span> {{ $member['fathers_name'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Designation:</span> {{ $member['designation'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Office Address:</span> {{ $member['office_address'] ?? '—' }},
                        {{ $member['office_city'] ?? '' }}, {{ $member['office_state'] ?? '' }}
                    </div>
                    <div>
                        <span class="font-semibold">Permanent Address:</span>
                        {{ $member['permanent_address'] ?? '—' }},
                        {{ $member['permanent_city'] ?? '' }}, {{ $member['permanent_state'] ?? '' }}
                    </div>
                    <div>
                        <span class="font-semibold">Nominee:</span> {{ $member['nominee_name'] ?? '—' }}
                        ({{ $member['nominee_relation'] ?? '—' }})
                    </div>
                    <div>
                        <span class="font-semibold">Appointment / Retirement:</span>
                        {{ $member['date_of_appointment'] ?? '—' }} — {{ $member['date_of_retirement'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Phone:</span> {{ $member['phone_number'] ?? '—' }}
                    </div>
                    <div>
                        <span class="font-semibold">Branch / Zone / District:</span> {{ $member['Branch'] ?? '—' }} /
                        {{ $member['zone'] ?? '—' }} / {{ $member['district'] ?? '—' }}
                    </div>

                </div>
            </div>
            <!-- SUMMARY CARDS ROW -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                @foreach ([['label' => 'Fixed Deposits', 'value' => $totalFd, 'gradient' => 'from-indigo-600 to-indigo-500'], ['label' => 'Recurring Deposits', 'value' => $totalRd, 'gradient' => 'from-emerald-600 to-emerald-500'], ['label' => 'Savings', 'value' => $totalSavings, 'gradient' => 'from-amber-600 to-amber-500'], ['label' => 'CGR', 'value' => $cgrAmount, 'gradient' => 'from-sky-600 to-sky-500']] as $c)
                    <div
                        class="relative rounded-xl p-4 text-white shadow-md bg-gradient-to-br {{ $c['gradient'] }} card-hover">
                        <div class="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                        <div class="relative z-10">
                            <div class="text-xs uppercase tracking-wide opacity-90">{{ $c['label'] }}</div>
                            <div class="mt-2 text-2xl font-bold">₹ {{ number_format($c['value'], 2) }}
                                {{ $c['label'] == 'CGR' ? '*' : '' }}</div>
                            <div class="mt-1 text-[11px] opacity-80">Total Balance</div>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- DEPOSITS SECTIONS SIDE-BY-SIDE -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                @foreach ([['title' => 'Fixed Deposits', 'icon' => 'fa-piggy-bank', 'items' => $fd, 'type' => 'fd'], ['title' => 'Recurring Deposits', 'icon' => 'fa-repeat', 'items' => $rd, 'type' => 'rd'], ['title' => 'Savings Accounts', 'icon' => 'fa-wallet', 'items' => $savings, 'type' => 'savings']] as $sec)
                    <div class="bg-white border rounded-lg shadow-sm flex flex-col">
                        <!-- Section Header -->
                        <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b sticky top-0 z-10">
                            <div
                                class="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <i class="fa-solid {{ $sec['icon'] }}"></i>
                            </div>
                            <div>
                                <div class="text-sm font-semibold text-gray-800">{{ $sec['title'] }}</div>
                                <div class="text-xs text-gray-500">{{ count($sec['items']) }} accounts</div>
                            </div>
                        </div>

                        <!-- Section Body -->
                        <div class="divide-y overflow-y-auto scrollbar-thin max-h-[28rem]">
                            @forelse($sec['items'] as $item)
                                @php
                                    $acc = $item['account'] ?? [];
                                    $status = $acc['status'] ?? ($item['status'] ?? 'Active');
                                @endphp
                                {{-- <a javascript:void() href="{{ route($sec['type'] . '.show', $item['id']) }}"
                                    class="flex justify-between px-4 py-3 hover:bg-indigo-50"> --}}
                                <a javascript:void() href="javascript:void(0)"
                                    class="flex justify-between px-4 py-3 hover:bg-indigo-50">
                                    <div class="min-w-0">
                                        <div class="text-xs font-medium text-indigo-700 truncate">
                                            Account:
                                            {{ $acc['account_number'] ?? ($item['name'] ?? 'Deposit Account') }}
                                            (#{{ $item['transaction']['reference'] ?? '-' }})
                                        </div>
                                        <div class="text-[11px] text-gray-500">
                                            Start: {{ $item['start_date'] ?? '—' }}
                                        </div>
                                    </div>

                                    <div class="text-right flex flex-col items-end justify-between">
                                        <div class="text-xs font-semibold text-gray-800">
                                            ₹
                                            {{ number_format($item['amount'] ?? ($item['transaction']['amount'] ?? 0), 2) }}
                                        </div>
                                        <div
                                            class="text-[11px] font-medium px-2 py-0.5 rounded {{ statusColor($status) }}">
                                            {{ ucfirst($status) }}
                                        </div>
                                    </div>
                                </a>
                            @empty
                                <div class="py-6 text-center text-sm text-gray-500">No records available</div>
                            @endforelse
                        </div>
                    </div>
                @endforeach

            </div>
        @else
            <div class="bg-white border rounded-lg shadow-sm p-6 mb-6 text-center text-gray-500">
                <i class="fa-solid fa-user-slash text-2xl mb-2"></i>
                <div class="text-lg font-semibold">No Member Selected</div>
                <div class="text-sm">Please search for a member to view deposits and details.</div>
            </div>
        @endif

        <!-- FOOTNOTE -->
        <div>
            <span class="text-red-900 text-xs">
                * All the interest amount shown above are for reference only. The interest amount is valid only after
                end of financial year/maturity period.
            </span>
        </div>

    </div>

</body>

</html>

{{-- <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Deposits Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Inter', sans-serif;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stats-gradient {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }

        .hover-scale {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-scale:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>

<body class="bg-[#f8fafc] text-slate-900">

    @php
        // Logic remains same, but ensured fallbacks
        $totalFd = 0;
        foreach ($fd ?? [] as $item) {
            $totalFd += $item['transaction']['amount'] ?? ($item['amount'] ?? 0);
        }
        $totalRd = 0;
        foreach ($rd ?? [] as $item) {
            $totalRd += $item['amount'] ?? ($item['transaction']['amount'] ?? 0);
        }
        $totalSavings = $savings[0]['amount'] ?? 0;
        $cgrAmount = $totals['closing'] ?? 0;
        $grandTotal = $totalFd + $totalRd + $totalSavings;

        function statusBadge($status)
        {
            $s = strtolower($status ?? 'active');
            if ($s === 'active' || $s === 'new') {
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            }
            if ($s === 'closed') {
                return 'bg-slate-100 text-slate-600 border-slate-200';
            }
            return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    @endphp

    <div class="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Portfolio Overview</h1>
                <p class="text-slate-500 mt-1 font-medium">Manage and monitor member deposit assets.</p>
            </div>

            <form method="GET"
                class="flex items-center bg-white shadow-sm border border-slate-200 rounded-2xl p-1.5 w-full md:w-96 transition-focus focus-within:ring-2 focus-within:ring-indigo-500">
                <div class="pl-3 text-slate-400">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
                <input type="number" name="member" value="{{ request('member') }}" placeholder="Enter Member ID..."
                    class="w-full bg-transparent border-none focus:ring-0 text-sm px-3 py-2 outline-none">
                <button type="submit"
                    class="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                    Find
                </button>
            </form>
        </div>

        @if (!empty($member))
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div class="flex items-center gap-4 mb-6">
                        <div
                            class="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                            {{ substr($member['name'] ?? 'M', 0, 1) }}
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-slate-800">{{ $member['name'] ?? 'Unknown Member' }}</h2>
                            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">ID:
                                {{ $member['member_number'] ?? '—' }}</span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-2 border-b border-slate-50 text-sm">
                            <span class="text-slate-500">Total Net Worth</span>
                            <span class="font-bold text-slate-900 text-lg">₹{{ number_format($grandTotal, 2) }}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <p class="text-[10px] uppercase text-slate-400 font-bold mb-1">CGR Number</p>
                                <p class="text-sm font-semibold">{{ $member['cgr_number'] ?? '—' }}</p>
                            </div>
                            <div>
                                <p class="text-[10px] uppercase text-slate-400 font-bold mb-1">Phone</p>
                                <p class="text-sm font-semibold">{{ $member['phone_number'] ?? '—' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <div class="space-y-3">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Personal
                            Details</label>
                        <p class="text-sm"><span class="text-slate-500">Father:</span> <span
                                class="font-medium ml-1">{{ $member['fathers_name'] ?? '—' }}</span></p>
                        <p class="text-sm"><span class="text-slate-500">Nominee:</span> <span
                                class="font-medium ml-1">{{ $member['nominee_name'] ?? '—' }}
                                ({{ $member['nominee_relation'] ?? '' }})</span></p>
                        <p class="text-sm"><span class="text-slate-500">DOB:</span> <span
                                class="font-medium ml-1">{{ $member['date_of_birth'] ?? '—' }}</span></p>
                    </div>
                    <div class="space-y-3">
                        <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Employment &
                            Office</label>
                        <p class="text-sm"><span class="text-slate-500">Office:</span> <span
                                class="font-medium ml-1">{{ $member['Branch'] ?? 'Main' }} /
                                {{ $member['district'] ?? 'HQ' }}</span></p>
                        <p class="text-sm"><span class="text-slate-500">Designation:</span> <span
                                class="font-medium ml-1">{{ $member['designation'] ?? '—' }}</span></p>
                        <p class="text-sm"><span class="text-slate-500">Retirement:</span> <span
                                class="font-medium ml-1 text-red-600">{{ $member['date_of_retirement'] ?? '—' }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @foreach ([['label' => 'Fixed Deposits', 'value' => $totalFd, 'color' => 'indigo', 'icon' => 'fa-vault'], ['label' => 'Recurring', 'value' => $totalRd, 'color' => 'emerald', 'icon' => 'fa-arrows-rotate'], ['label' => 'Savings', 'value' => $totalSavings, 'color' => 'amber', 'icon' => 'fa-wallet'], ['label' => 'CGR Funds', 'value' => $cgrAmount, 'color' => 'sky', 'icon' => 'fa-shield-halved']] as $c)
                    <div
                        class="bg-white p-5 rounded-3xl border border-slate-200 hover-scale relative overflow-hidden group">
                        <div
                            class="absolute -right-4 -top-4 w-20 h-20 bg-{{ $c['color'] }}-50 rounded-full group-hover:scale-150 transition-transform duration-500">
                        </div>
                        <div class="relative z-10">
                            <div class="flex items-center justify-between mb-4">
                                <div
                                    class="w-10 h-10 rounded-xl bg-{{ $c['color'] }}-100 text-{{ $c['color'] }}-600 flex items-center justify-center">
                                    <i class="fa-solid {{ $c['icon'] }}"></i>
                                </div>
                                <span
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ $c['label'] }}</span>
                            </div>
                            <h3 class="text-2xl font-bold text-slate-800">₹{{ number_format($c['value'], 0) }}</h3>
                            <div class="flex items-center mt-1">
                                <span
                                    class="text-[11px] font-medium text-{{ $c['color'] }}-600 bg-{{ $c['color'] }}-50 px-2 py-0.5 rounded-full">Current
                                    Assets</span>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                @foreach ([['title' => 'Fixed Deposits', 'items' => $fd, 'accent' => 'indigo'], ['title' => 'Recurring', 'items' => $rd, 'accent' => 'emerald'], ['title' => 'Savings', 'items' => $savings, 'accent' => 'amber']] as $sec)
                    <div class="flex flex-col">
                        <div class="flex items-center justify-between mb-4 px-2">
                            <h4 class="font-bold text-slate-800 flex items-center gap-2">
                                <span class="w-2 h-5 bg-{{ $sec['accent'] }}-500 rounded-full"></span>
                                {{ $sec['title'] }}
                            </h4>
                            <span
                                class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{{ count($sec['items']) }}</span>
                        </div>

                        <div class="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide pr-1">
                            @forelse($sec['items'] as $item)
                                @php $status = $item['account']['status'] ?? ($item['status'] ?? 'Active'); @endphp
                                <div
                                    class="bg-white border border-slate-200 p-4 rounded-2xl hover:border-{{ $sec['accent'] }}-300 transition-colors cursor-pointer shadow-sm group">
                                    <div class="flex justify-between items-start">
                                        <div class="space-y-1">
                                            <p
                                                class="text-xs font-bold text-slate-400 group-hover:text-{{ $sec['accent'] }}-600 transition-colors uppercase tracking-widest">
                                                #{{ $item['transaction']['reference'] ?? 'ACC-' . rand(1000, 9999) }}
                                            </p>
                                            <h5 class="text-sm font-bold text-slate-800">
                                                {{ $item['account']['account_number'] ?? ($item['name'] ?? 'Standard Deposit') }}
                                            </h5>
                                        </div>
                                        <span
                                            class="text-[10px] border px-2 py-0.5 rounded-md font-bold uppercase {{ statusBadge($status) }}">
                                            {{ $status }}
                                        </span>
                                    </div>

                                    <div class="mt-4 flex items-end justify-between">
                                        <div>
                                            <p class="text-[10px] text-slate-400 font-medium italic">Opened on</p>
                                            <p class="text-xs font-semibold text-slate-600">
                                                {{ $item['start_date'] ?? 'N/A' }}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-lg font-black text-slate-900 leading-none">
                                                ₹{{ number_format($item['amount'] ?? ($item['transaction']['amount'] ?? 0), 2) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            @empty
                                <div class="border-2 border-dashed border-slate-200 rounded-2xl py-10 text-center">
                                    <p class="text-xs font-medium text-slate-400">No active accounts</p>
                                </div>
                            @endforelse
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-20 text-center">
                <div
                    class="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    <i class="fa-solid fa-user-plus"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-800">No Member Portfolio Loaded</h2>
                <p class="text-slate-500 max-w-xs mx-auto mt-2">Use the search bar above to look up a member by their
                    identification number.</p>
            </div>
        @endif

        <div class="bg-slate-900 rounded-2xl p-6 text-slate-400">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-[11px] leading-relaxed max-w-2xl">
                    <span class="text-amber-500 font-bold uppercase mr-1">Disclaimer:</span>
                    Interest calculations shown are indicative. Actual maturity amounts are subject to tax laws and
                    financial year-end audits.
                    Refer to the bank's official terms and conditions for exact figures.
                </p>
                <div class="flex gap-4 text-xs font-bold uppercase tracking-widest">
                    <a href="#" class="hover:text-white transition">Terms</a>
                    <a href="#" class="hover:text-white transition">Privacy</a>
                </div>
            </div>
        </div>
    </div>

</body>

</html> --}}
