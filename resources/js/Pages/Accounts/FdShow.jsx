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
    const amount = deposit.get_amount?.amount ?? deposit.amount ?? "—";
    const withdrawals = Array.isArray(deposit.withdrawals)
        ? deposit.withdrawals
        : deposit.withdrawals
        ? [deposit.withdrawals]
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
                            {deposit.status ?? "—"}
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
                    <DetailRow
                        label="Status"
                        value={toAllCaps(member?.status) ?? "—"}
                    />
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
                {/* <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Withdrawn History
                        </h3>
                    </div>

                    {withdrawals.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">
                            No withdrawals found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr className="text-left text-xs text-gray-600 uppercase">
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawals.map((wd, index) => (
                                        <tr
                                            key={index}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-2">
                                                {wd.created_at
                                                    ? new Date(
                                                          wd.created_at
                                                      ).toLocaleDateString(
                                                          "en-GB"
                                                      )
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-2">
                                                Rs. {wd.amount ?? "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div> */}
            </div>
        </AppLayout>
    );
}
