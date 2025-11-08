import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function LedgerYearSelect({ years }) {
    return (
        <AppLayout title="Select Ledger Year">
            <PageHeader
                title="Ledger Years"
                subtitle="Select a financial year to view ledger"
            />

            <div className="p-4 space-y-3">
                {years.map((year) => (
                    <Link
                        key={year}
                        href={route("ledger", { year })}
                        className="block rounded-lg p-4 border shadow-sm bg-white border-gray-200 hover:bg-indigo-50 text-gray-800 transition"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{year}</span>
                            <i className="fa-solid fa-chevron-right text-gray-400"></i>
                        </div>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
