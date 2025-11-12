import React from "react";
import { usePage, router, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function Ledger() {
    const { props } = usePage();
    const {
        year,
        openingBalance,
        closingBalance,
        totalDeposit,
        totalInterest,
        totalWithdrawal,
        ledgerData = [],
    } = props;

    // Back button handler
    const handleBack = (e) => {
        e.preventDefault();
        if (document.referrer) {
            window.history.back();
        } else {
            router.visit(route("ledger.years"));
        }
    };

    return (
        <AppLayout title={`Ledger ${year || ""}`}>
            {/* Header */}
            <PageHeader
                title={`Ledger ${year ? `(${year})` : ""}`}
                subtitle="Financial summary from April to March"
            />

            <div className="p-3 space-y-3">
                {/* Opening Balance */}
                <div className="bg-white rounded-md shadow-sm p-3">
                    {/* <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-1 bg-white text-indigo-500 font-normal px-2 py-1 mb-1 rounded-lg shadow-sm border border-gray-200 hover:bg-indigo-300 active:bg-indigo-500 transition-all duration-150"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Back</span>
                    </button> */}
                    <div className="mb-2">
                        <Link
                            href={route("ledger.years")}
                            className="text-indigo-600 text-sm font-semibold hover:underline"
                        >
                            ← Back
                        </Link>
                    </div>
                    <h2 className="text-gray-600 text-sm font-semibold">
                        Opening Balance
                    </h2>
                    <p className="text-indigo-700 text-base font-bold mt-1">
                        ₹ {Number(openingBalance ?? 0).toLocaleString()}
                    </p>
                </div>

                {/* Ledger Table */}
                <div className="bg-white shadow-sm rounded-md overflow-hidden">
                    <table className="w-full text-xs sm:text-sm text-gray-700">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="py-2 px-3 text-left">Month</th>
                                <th className="py-2 px-3 text-left">CGR</th>
                                <th className="py-2 px-3 text-left">Mode</th>
                                <th className="py-2 px-3 text-left">
                                    Interest
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledgerData.length > 0 ? (
                                ledgerData.map((row, idx) => (
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
                                                ₹{" "}
                                                {Number(
                                                    row.cgr?.amount ?? 0
                                                ).toLocaleString()}
                                            </p>
                                            {row.cgr?.date && (
                                                <p className="text-[10px] text-gray-500">
                                                    {row.cgr.date}
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-2 px-3">
                                            {row.cgr?.mode ?? "-"}
                                        </td>
                                        <td className="py-2 px-3">
                                            ₹{" "}
                                            {Number(
                                                row.interest ?? 0
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No ledger data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Closing Balance */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-1">
                    <div className="bg-white rounded-md shadow-sm p-3">
                        <h2 className="text-gray-600 text-sm font-semibold">
                            Total Deposit
                        </h2>
                        <p className="text-indigo-700 text-base font-bold mt-1">
                            ₹ {Number(totalDeposit ?? 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-md shadow-sm p-3">
                        <h2 className="text-gray-600 text-sm font-semibold">
                            Total Interest
                        </h2>
                        <p className="text-indigo-700 text-base font-bold mt-1">
                            ₹ {Number(totalInterest ?? 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-md shadow-sm p-3">
                        <h2 className="text-gray-600 text-sm font-semibold">
                            Total Withdrawal
                        </h2>
                        <p className="text-indigo-700 text-base font-bold mt-1">
                            ₹ {Number(totalWithdrawal ?? 0).toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-md shadow-sm p-3">
                        <h2 className="text-gray-600 text-sm font-semibold">
                            Closing Balance
                        </h2>
                        <p className="text-indigo-700 text-base font-bold mt-1">
                            ₹ {Number(closingBalance ?? 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
