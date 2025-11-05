import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function LedgerYearSelect() {
    // All available years (latest first)
    const years = [
        "2024-2025",
        "2023-2024",
        "2022-2023",
        "2021-2022",
        "2020-2021",
    ];

    // Function to determine current financial year (April–March)
    const getCurrentFinancialYear = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 1–12
        if (month < 4) {
            // Before April → belongs to previous FY
            return `${year - 1}-${year}`;
        } else {
            return `${year}-${year + 1}`;
        }
    };

    const currentFY = getCurrentFinancialYear();

    return (
        <AppLayout title="Select Ledger Year">
            <PageHeader
                title="Ledger Years"
                subtitle="Select a financial year to view ledger"
            />

            <div className="p-4 space-y-3">
                {years.map((year) => {
                    const isCurrent = year === currentFY;
                    return (
                        <Link
                            key={year}
                            href={route("ledger", { year })}
                            className={`block rounded-lg p-4 border shadow-sm transition ${
                                isCurrent
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-white border-gray-200 hover:bg-indigo-50 text-gray-800"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {year}
                                    {isCurrent && (
                                        <span className="ml-2 text-xs bg-white text-indigo-600 px-2 py-[1px] rounded-full font-semibold">
                                            Current
                                        </span>
                                    )}
                                </span>
                                <i
                                    className={`fa-solid fa-chevron-right ${
                                        isCurrent
                                            ? "text-white"
                                            : "text-gray-400"
                                    }`}
                                ></i>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </AppLayout>
    );
}
