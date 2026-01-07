import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { usePage, Link } from "@inertiajs/react";
import DetailRow from "@/Components/DetailRow";

export default function Show() {
    const { rd, report_url } = usePage().props;

    const [imgSrc, setImgSrc] = useState(
        rd.account?.document
            ? `${report_url}/storage/${rd.account?.document}`
            : ""
    );
    const toAllCaps = (value) => {
        if (typeof value !== "string") return value;
        return value.toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) return "—";

        const d = new Date(date);
        if (isNaN(d)) return "—";

        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });
    };

    const member = rd?.account ?? "";
    if (!rd) {
        return (
            <AppLayout title="RD Details">
                <PageHeader title="RD Details" subtitle="Not found" />
                <div className="p-4">
                    <div className="bg-white rounded-md shadow p-4 text-center text-gray-500 text-sm">
                        No details available.
                    </div>
                </div>
            </AppLayout>
        );
    }

    const transactions = Array.isArray(rd.transactions)
        ? rd.transactions
        : rd.transactions
        ? [rd.transactions]
        : [];
    const totalAmount =
        transactions.length > 0
            ? transactions.reduce(
                  (sum, tx) => sum + (parseFloat(tx.amount) || 0),
                  0
              )
            : 0;
    return (
        <AppLayout title="RD Details">
            <PageHeader
                title="Recurring rd"
                subtitle={`Account #${rd.account?.account_number}`}
            />

            <div className="p-4 max-w-4xl mx-auto space-y-4">
                {/* Back */}
                <Link
                    href={route("accounts.index")}
                    className="text-indigo-600 text-xs font-semibold hover:underline"
                >
                    ← Back to Accounts
                </Link>

                {/* RD Summary */}
                <div className="bg-emerald-600 text-white rounded-lg shadow px-4 py-3 flex justify-between items-center">
                    <div>
                        <p className="text-xs uppercase opacity-90">
                            Recurring Deposit
                        </p>
                        <p className="text-xl font-semibold">
                            Rs. {totalAmount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs opacity-90 mt-1">Total deposit</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-90">Status</p>
                        <p className="text-sm font-medium capitalize">
                            {rd.status ?? "—"}
                        </p>
                    </div>
                </div>

                {/* RD Details */}
                <div className="bg-white rounded-lg shadow">
                    <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                        <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                            RD Information
                        </h2>

                        <DetailRow
                            label="Type"
                            value={toAllCaps(rd.type) ?? "—"}
                        />
                        {/* <DetailRow
                            label="Monthly Amount"
                            value={rd.amount ?? "—"}
                        /> */}
                        <DetailRow
                            label="Interest Rate"
                            value={
                                rd.interest_rate ? `${rd.interest_rate}%` : "—"
                            }
                        />
                        <DetailRow
                            label="Start Date"
                            value={formatDate(rd.start_date) ?? "—"}
                        />
                        <DetailRow
                            label="Maturity Date"
                            value={formatDate(rd.end_date) ?? "—"}
                        />
                        <DetailRow
                            label="Account No"
                            value={rd.account?.account_number ?? "—"}
                        />
                    </div>
                    {imgSrc ? (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                Attachment
                            </h3>

                            <img
                                src={imgSrc}
                                alt="Account Document"
                                className="global-preview-image cursor-pointer w-36 h-auto rounded border hover:opacity-90"
                            />
                        </div>
                    ) : (
                        <span className="text-sm text-gray-400 italic">
                            No attachment
                        </span>
                    )}
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Member Information
                    </h2>

                    <DetailRow
                        label="Member S.No"
                        value={member?.member_sno ?? "—"}
                    />
                    <DetailRow label="Name" value={member?.name ?? "—"} />
                    <DetailRow label="Address" value={member?.address ?? "—"} />
                    <DetailRow
                        label="Phone Number"
                        value={member?.phone_number ?? "—"}
                    />
                    <DetailRow
                        label="PAN Number"
                        value={member?.pan_number ?? "—"}
                    />
                    <DetailRow
                        label="Opening Date"
                        value={formatDate(member?.opening_date) ?? "—"}
                    />
                    <DetailRow
                        label="Status"
                        value={toAllCaps(member?.status) ?? "—"}
                    />
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Nominee Information
                    </h2>

                    <DetailRow
                        label="Name"
                        value={member?.nominee_name ?? "—"}
                    />
                    <DetailRow
                        label="Address"
                        value={member?.nominee_address ?? "—"}
                    />
                    <DetailRow
                        label="DOB"
                        value={formatDate(member?.nominee_dob) ?? "—"}
                    />
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Installment Transactions
                        </h3>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                            No transactions found.
                        </div>
                    ) : (
                        <div className="bg-white shadow-sm rounded-md overflow-auto">
                            <table className="w-full text-xs sm:text-sm text-gray-700 border-collapse border border-gray-200">
                                <thead className="bg-indigo-600 text-white">
                                    <tr className="">
                                        <th className="py-2 px-3 text-left border-r border-indigo-400">
                                            #
                                        </th>
                                        <th className="py-2 px-3 text-left border-r border-indigo-400">
                                            Date
                                        </th>
                                        <th className="py-2 px-3 text-left border-r border-indigo-400">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, index) => (
                                        <tr
                                            key={index}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-2 px-3 border-r border-gray-200 text-xs">
                                                {index + 1}
                                            </td>
                                            <td className="py-2 px-3 border-r border-gray-200 text-xs">
                                                {formatDate(tx.created_at) ??
                                                    "—"}
                                            </td>
                                            <td className="py-2 px-3 border-r border-gray-200 text-xs">
                                                Rs. {tx.amount ?? "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
