import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function Home() {
    return (
        <AppLayout title="Financial Dashboard">
            {/* Header */}
            <PageHeader
                title="Welcome, User!"
                subtitle="Your financial overview at a glance"
            />

            {/* Date */}
            <p className="text-sm font-medium text-gray-500 text-center py-3 border-b border-gray-100 mx-4">
                Data as on 03-10-2025
            </p>

            {/* Graph Card */}
            <div className="p-4">
                <div className="bg-white p-6 h-64 border border-gray-200 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition">
                    <p className="text-xl font-semibold text-gray-700 mb-4">
                        Graph of monthly deposits
                    </p>
                    <div className="w-full h-32 flex items-end justify-around p-2">
                        {[
                            "h-1/4",
                            "h-2/4",
                            "h-3/4",
                            "h-2/4",
                            "h-1/4",
                            "h-3/4",
                            "h-full",
                        ].map((h, i) => (
                            <div
                                key={i}
                                className={`w-8 bg-blue-400 rounded-t ${h} animate-pulse`}
                                style={{ animationDelay: `${i * 100}ms` }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 p-4">
                <MetricCard
                    title="Total Deposits"
                    value="1,00,000/-"
                    color="green"
                />
                <MetricCard
                    title="Total Withdrawal"
                    value="10,000/-"
                    color="red"
                />
                <MetricCard
                    title="Total Interest"
                    value="1,000/-"
                    color="blue"
                />
                <MetricCard
                    title="Total Savings"
                    value="91,000/-"
                    color="indigo"
                />
            </div>
        </AppLayout>
    );
}

function MetricCard({ title, value, color }) {
    return (
        <div
            className={`bg-white p-4 rounded-lg shadow-md border-l-4 border-${color}-500 cursor-pointer hover:shadow-lg transition`}
        >
            <p className="text-xs font-medium text-gray-500 uppercase truncate">
                {title}
            </p>
            <p className={`text-2xl font-bold text-${color}-600 mt-1`}>
                {value}
            </p>
        </div>
    );
}
