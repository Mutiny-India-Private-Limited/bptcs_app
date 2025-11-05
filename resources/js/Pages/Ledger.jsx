import React from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function Ledger() {
    const { props } = usePage();
    const { year, openingBalance, closingBalance, ledgerData = [] } = props;

    // ✅ Back button handler
    const handleBack = (e) => {
        e.preventDefault();
        // Go to previous page or fallback to home
        if (document.referrer) {
            window.history.back();
        } else {
            router.visit(route("ledger.years"));
        }
    };

    return (
        <AppLayout title={`Ledger ${year || ""}`}>
            {/* Back Button */}

            {/* Header */}
            <PageHeader
                title={`Ledger ${year ? `(${year})` : ""}`}
                subtitle="Financial summary from April to March"
            />

            {/* Content */}
            <div className="p-3 space-y-3">
                {/* Opening Balance */}
                <div className="bg-white rounded-md shadow-sm p-3">
                    <h2 className="text-gray-600 text-sm font-semibold">
                        Opening Balance
                    </h2>
                    <p className="text-indigo-700 text-base font-bold mt-1">
                        ₹ {openingBalance?.toLocaleString() ?? 0}
                    </p>
                </div>

                {/* Ledger Table */}
                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 bg-white text-indigo-700 font-medium px-4 py-2 mb-2 rounded-lg shadow-sm border border-gray-200 hover:bg-indigo-50 active:bg-indigo-100 transition-all duration-150"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Back</span>
                    </button>
                    <table className="w-full text-xs sm:text-sm text-gray-700">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-2 px-3 text-left">Month</th>
                                <th className="py-2 px-3 text-left">CGR</th>
                                <th className="py-2 px-3 text-left">
                                    Interest
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgerData.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={
                                        idx % 2 ? "bg-gray-50" : "bg-white"
                                    }
                                >
                                    <td className="py-2 px-3 font-medium">
                                        {row.month}
                                    </td>
                                    <td className="py-2 px-3">
                                        <p>
                                            ₹ {row.cgr.amount.toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {new Date(
                                                row.cgr.date
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                            })}
                                        </p>
                                    </td>
                                    <td className="py-2 px-3">
                                        ₹ {row.interest.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Closing Balance */}
                <div className="bg-white rounded-md shadow-sm p-3">
                    <h2 className="text-gray-600 text-sm font-semibold">
                        Closing Balance
                    </h2>
                    <p className="text-indigo-700 text-base font-bold mt-1">
                        ₹ {closingBalance?.toLocaleString() ?? 0}
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
