import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { usePage, Link } from "@inertiajs/react";
import DetailRow from "@/Components/DetailRow";

export default function Show() {
    const { deposit, report_url } = usePage().props;

    const [imgSrc, setImgSrc] = useState(
        deposit.account?.document
            ? `${report_url}/storage/${deposit.account?.document}`
            : "",
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

    const member = deposit?.account ?? "";

    if (!deposit) {
        return (
            <AppLayout title="Deposit Details">
                <PageHeader title="Deposit Details" subtitle="Not found" />
                <div className="p-4">
                    <div className="bg-white rounded-md shadow p-4 text-center text-gray-500 text-sm">
                        No details available.
                    </div>
                </div>
            </AppLayout>
        );
    }
    const amount = deposit.account?.amount ?? deposit.get_amount?.amount ?? "—";
    const transactions = Array.isArray(deposit.transactions)
        ? deposit.transactions
        : deposit.transactions
          ? [deposit.transactions]
          : [];

    return (
        <AppLayout title="Deposit Details">
            <PageHeader
                title="Deposit Details"
                subtitle={`Account #${deposit.account?.account_number}`}
            />

            <div className="p-4 max-w-3xl mx-auto space-y-4">
                {/* Back Button */}
                <Link
                    href={route("accounts.index")}
                    className="text-indigo-600 text-xs font-semibold hover:underline"
                >
                    ← Back to Accounts
                </Link>

                {/* Compact FD Summary */}
                <div className="bg-indigo-600 text-white rounded-lg shadow px-4 py-3 flex justify-between items-center">
                    <div>
                        <p className="text-xs uppercase opacity-90">
                            Fixed Deposit
                        </p>
                        <p className="text-xl font-semibold">Rs. {amount}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-90">Status</p>
                        <p className="text-sm font-medium capitalize">
                            {deposit.account?.status ?? "—"}
                        </p>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Deposit Information
                    </h2>

                    <DetailRow
                        label="Type"
                        value={toAllCaps(deposit.type) ?? "—"}
                    />

                    <DetailRow
                        label="Interest Rate"
                        value={
                            deposit.interest_rate
                                ? `${deposit.interest_rate}%`
                                : "—"
                        }
                    />
                    <DetailRow
                        label="Pre-mature Interest"
                        value={deposit.pre_mature_interest ?? "—"}
                    />
                    <DetailRow
                        label="Start Date"
                        value={formatDate(deposit.start_date)}
                    />
                    <DetailRow
                        label="Maturity Date"
                        value={formatDate(deposit.end_date) ?? "—"}
                    />
                    {/* <DetailRow
                        label="Status"
                        value={toAllCaps(member?.status) ?? "—"}
                    /> */}
                    {imgSrc ? (
                        <div className="bg-white rounded-lg shadow p-2">
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

                {/* Withdrawn History */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Transaction History
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
                                    <tr>
                                        <th className="py-2 px-3 text-left border-r border-indigo-400">
                                            Date
                                        </th>
                                        <th className="py-2 px-3 text-left border-r border-indigo-400">
                                            Reference
                                        </th>
                                        <th className="py-2 px-3 text-left border-r border-indigo-400">
                                            Type
                                        </th>
                                        <th className="py-2 px-3 text-right border-r border-indigo-400">
                                            Amount
                                        </th>
                                        <th className="py-2 px-3 text-right">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.length > 0 ? (
                                        transactions.map((tx, idx) => {
                                            const rowBg =
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50";

                                            const dateValue =
                                                tx.type === "deposit"
                                                    ? (deposit?.start_date ??
                                                      "-")
                                                    : (tx.created_at ?? "-");

                                            return (
                                                <tr
                                                    key={tx.id}
                                                    className={`${rowBg} border-b border-gray-200 text-xs sm:text-sm`}
                                                >
                                                    {/* Date */}
                                                    <td className="py-2 px-2 sm:px-3 border-r border-gray-200 whitespace-nowrap">
                                                        <p>
                                                            {formatDate(
                                                                dateValue,
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {dateValue !== "-"
                                                                ? new Date(
                                                                      dateValue,
                                                                  ).toLocaleTimeString(
                                                                      "en-GB",
                                                                  )
                                                                : "-"}
                                                        </p>
                                                    </td>

                                                    {/* Reference */}
                                                    <td className="py-2 px-2 sm:px-3 border-r border-gray-200 whitespace-nowrap">
                                                        {tx.reference ?? "-"}
                                                    </td>

                                                    {/* Type */}
                                                    <td className="py-2 px-2 sm:px-3 border-r border-gray-200 capitalize whitespace-nowrap">
                                                        {tx.direction}
                                                    </td>

                                                    {/* Amount */}
                                                    <td
                                                        className={`py-2 px-2 sm:px-3 text-right border-r border-gray-200 font-semibold whitespace-nowrap ${
                                                            tx.direction ===
                                                            "credit"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        <span>
                                                            {tx.direction ===
                                                            "credit"
                                                                ? "+"
                                                                : "-"}{" "}
                                                            ₹
                                                            {Number(
                                                                tx.amount,
                                                            ).toLocaleString()}
                                                        </span>
                                                    </td>

                                                    {/* Balance */}
                                                    <td className="py-2 px-2 sm:px-3 text-right font-medium whitespace-nowrap">
                                                        ₹
                                                        {Number(
                                                            tx.balance_after,
                                                        ).toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-gray-500 py-4 border-t border-gray-200"
                                            >
                                                No transactions available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
