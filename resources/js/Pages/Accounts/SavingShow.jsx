import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { usePage, Link } from "@inertiajs/react";
import DetailRow from "@/Components/DetailRow";

export default function SavingShow() {
    const { saving, transactions } = usePage().props;
    const amount =
        transactions?.data?.length > 0 ? transactions.data[0].balance_after : 0;

    if (!saving) {
        return (
            <AppLayout title="Savings Account">
                <PageHeader title="Savings Account" subtitle="Not found" />
                <div className="p-4 text-center text-sm text-gray-500">
                    No account details available.
                </div>
            </AppLayout>
        );
    }
    const member = saving ?? "";
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
    return (
        <AppLayout title="Savings Account">
            <PageHeader
                title="Savings Account"
                subtitle={`Account #${member?.account_number}`}
            />

            <div className="p-4 max-w-5xl mx-auto space-y-6">
                {/* Back */}
                <Link
                    href={route("accounts.index")}
                    className="text-indigo-600 text-xs font-semibold hover:underline"
                >
                    ← Back to Accounts
                </Link>

                {/* Account Summary */}
                <div className="bg-indigo-600 text-white rounded-lg shadow px-6 py-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs uppercase opacity-90">
                            Current Balance
                        </p>
                        <p className="text-2xl font-semibold">
                            Rs. {amount ?? "—"}
                        </p>
                    </div>

                    <div className="text-right text-sm space-y-1">
                        <p>Status</p>
                        <p className="font-medium capitalize">
                            {member.status ?? "Active"}
                        </p>
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4 ">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Account Information
                    </h2>

                    <DetailRow
                        label="Account Number"
                        value={member?.account_number ?? "—"}
                    />
                    <DetailRow label="Account Type" value="Savings" />
                    <DetailRow
                        label="Opened On"
                        value={formatDate(member.created_at) ?? "—"}
                    />
                    <DetailRow
                        label="Account Holder"
                        value={member?.name ?? "—"}
                    />
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
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
                {/* Transactions */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Transaction History
                        </h3>
                    </div>

                    {transactions.data.length === 0 ? (
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
                                    {transactions.data.length > 0 ? (
                                        transactions.data.map((tx, idx) => {
                                            const rowBg =
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50";

                                            return (
                                                <tr
                                                    key={tx.id}
                                                    className={`${rowBg} border-b border-gray-200 text-xs sm:text-sm`}
                                                >
                                                    {/* Date */}
                                                    <td className="py-2 px-2 sm:px-3 border-r border-gray-200 whitespace-nowrap">
                                                        <p>
                                                            {formatDate(
                                                                tx.created_at ??
                                                                    "-"
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {new Date(
                                                                tx.created_at
                                                            ).toLocaleTimeString(
                                                                "en-GB"
                                                            )}
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
                                                                tx.amount
                                                            ).toLocaleString()}
                                                        </span>
                                                    </td>

                                                    {/* Balance */}
                                                    <td className="py-2 px-2 sm:px-3 text-right font-medium whitespace-nowrap">
                                                        ₹
                                                        {Number(
                                                            tx.balance_after
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

                    {/* Pagination */}
                    <div className="p-4 flex flex-wrap justify-end gap-2 text-xs">
                        {transactions.links.map((link, index) => {
                            const baseClass =
                                "px-3 py-1 rounded border text-xs";

                            const activeClass = link.active
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-white text-gray-700 border-gray-300";

                            const disabledClass =
                                "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

                            if (!link.url) {
                                // 🔒 Disabled (Prev / Next)
                                return (
                                    <span
                                        key={index}
                                        className={`${baseClass} ${disabledClass}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`${baseClass} ${activeClass} hover:bg-indigo-50`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
