import React, { useState, useMemo, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import MetricCard from "@/Components/MetricCard";
import { Head, usePage } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Home() {
    const { props } = usePage();
    const { totals, yearlySummary = [], lastUpdated, member } = props;
    const { logged_in_page } = props;

    const [selectedYear, setSelectedYear] = useState(
        yearlySummary?.[0]?.year || ""
    );
    const [activeTab, setActiveTab] = useState("monthly"); // monthly | yearly

    // --- Monthly Chart Data ---
    const monthlyChartData = useMemo(() => {
        const selected = yearlySummary.find((y) => y.year === selectedYear);

        const monthShort = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec",
        };

        let labels = Array.from(
            { length: 12 },
            (_, i) => Object.values(monthShort)[i]
        );
        let deposits = Array(12).fill(0);
        let interests = Array(12).fill(0);

        if (selected?.months?.length) {
            labels = selected.months.map(
                (m) => monthShort[m.month] || m.month.slice(0, 3)
            );
            deposits = selected.months.map((m) => m.deposit || 0);
            interests = selected.months.map((m) => m.interest || 0);
        }

        return {
            labels,
            datasets: [
                {
                    label: "Monthly Deposit",
                    data: deposits,
                    backgroundColor: "rgba(59,130,246,0.7)",
                    borderRadius: 4,
                },
                {
                    label: "Monthly Interest",
                    data: interests,
                    backgroundColor: "rgba(34,197,94,0.7)",
                    borderRadius: 4,
                },
            ],
        };
    }, [selectedYear, yearlySummary]);

    // Get totals directly from yearlySummary
    const selectedYearData = yearlySummary.find((y) => y.year === selectedYear);
    const totalDeposit = selectedYearData?.totalDeposit || 0;
    const totalInterest = selectedYearData?.totalInterest || 0;

    // --- Yearly Chart Data ---
    const yearlyChartData = useMemo(() => {
        if (!yearlySummary.length)
            return {
                labels: ["No Data"],
                datasets: [
                    {
                        label: "Total Deposit",
                        data: [0],
                        backgroundColor: "rgba(59,130,246,0.7)",
                        borderRadius: 4,
                    },
                    {
                        label: "Total Interest",
                        data: [0],
                        backgroundColor: "rgba(34,197,94,0.7)",
                        borderRadius: 4,
                    },
                ],
            };

        return {
            labels: yearlySummary.map((y) => y.year),
            datasets: [
                {
                    label: "Total Deposit",
                    data: yearlySummary.map((y) => y.totalDeposit || 0),
                    backgroundColor: "rgba(59,130,246,0.7)",
                    borderRadius: 4,
                },
                {
                    label: "Total Interest",
                    data: yearlySummary.map((y) => y.totalInterest || 0),
                    backgroundColor: "rgba(34,197,94,0.7)",
                    borderRadius: 4,
                },
            ],
        };
    }, [yearlySummary]);

    const chartOptions = {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: {
            x: { ticks: { maxRotation: 45, minRotation: 0, autoSkip: false } },
            y: { beginAtZero: true },
        },
    };

    return (
        <AppLayout title="Homepage">
            <input
                type="hidden"
                name="from_login_redirect"
                id="from_login_redirect"
                value={logged_in_page ? "true" : "false"}
            />

            <input
                type="hidden"
                name="hidden_fcm_token"
                id="hidden_fcm_token"
                value={member?.fcmToken ?? ""}
            />
            <input
                type="hidden"
                name="hidden_member_number"
                id="hidden_member_number"
                value={member?.member_number}
            />

            <PageHeader
                title={`Hello, ${member?.name || "User"}!`}
                subtitle="Your financial overview at a glance"
            />

            <div className="text-center py-3 border-b border-gray-100 mx-4">
                <p className="text-sm font-medium text-gray-500">
                    Data as on {lastUpdated}
                </p>
                <p className="text-xs text-gray-400">(Updates every hour)</p>
            </div>

            {/* Tabs for charts */}
            <div className="p-6 bg-white border border-gray-200 shadow-md mb-6">
                {/* Tabs / Nav Carousel */}
                <div className="flex justify-center relative mb-6">
                    <div className="flex space-x-4">
                        {["monthly", "yearly"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 font-medium relative transition-colors duration-300 ${
                                    activeTab === tab
                                        ? "text-white bg-blue-500 rounded-lg shadow-md"
                                        : "text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab content carousel effect */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform:
                                activeTab === "monthly"
                                    ? "translateX(0%)"
                                    : "translateX(-100%)",
                        }}
                    >
                        {/* Monthly tab */}
                        <div className="min-w-full">
                            <div className="flex flex-col items-center">
                                <select
                                    className="appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-8 text-sm font-medium text-gray-700 bg-white mb-6 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    value={selectedYear}
                                    onChange={(e) =>
                                        setSelectedYear(e.target.value)
                                    }
                                >
                                    {yearlySummary.map((y) => (
                                        <option key={y.year} value={y.year}>
                                            {y.year}
                                        </option>
                                    ))}
                                </select>

                                <div className="w-full max-w-3xl">
                                    <Bar
                                        data={monthlyChartData}
                                        options={chartOptions}
                                    />
                                </div>

                                {/* Smaller totals below chart */}
                                <div className="mt-2 flex gap-4 text-gray-600 text-sm">
                                    <div>
                                        <span>Total Deposit: </span>
                                        <span className="font-semibold">
                                            {totalDeposit.toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Total Interest: </span>
                                        <span className="font-semibold">
                                            {totalInterest.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Yearly tab */}
                        <div className="min-w-full">
                            <div className="w-full max-w-3xl mx-auto">
                                <Bar
                                    data={yearlyChartData}
                                    options={chartOptions}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="">
                {/* Metric Cards */}
                <div className="text-center pb-3 border-b border-gray-100 mx-4">
                    <p className="text-sm text-gray-600 font-medium">
                        Showing data for the current financial year
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4">
                    <MetricCard
                        title="Total Deposits"
                        value={totals.deposit.toLocaleString()}
                        color="green"
                    />
                    <MetricCard
                        title="Total Withdrawal"
                        value={totals.withdrawal.toLocaleString()}
                        color="red"
                    />
                    <MetricCard
                        title="Total Interest"
                        value={totals.interest.toLocaleString()}
                        color="blue"
                    />
                    <MetricCard
                        title="Total Savings"
                        value={totals.closing.toLocaleString()}
                        color="cyan"
                    />
                    <MetricCard
                        title="Total Share"
                        value={totals.share_amount.toLocaleString()}
                        color="yellow"
                    />
                    <MetricCard
                        title="Share Details"
                        value={totals.share_details}
                        color="gray"
                        valueSize="text-xs"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
