import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { usePage, Link } from "@inertiajs/react";
import {
    getAmount,
    parseAmount,
    sumAmounts,
    formatAmount,
} from "@/Components/depositHelpers";

export default function Deposits() {
    const { fd = [], rd = [], savings = [], totals = [] } = usePage().props;

    const [open, setOpen] = useState({
        fd: false,
        rd: false,
        savings: false,
    });

    const toggle = (key) =>
        setOpen({
            fd: false,
            rd: false,
            savings: false,
            [key]: !open[key],
        });

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
    /* -------------------- Helpers -------------------- */

    // const getAmount = (item, type) => {
    //     if (type === "fd") return item.transaction?.amount ?? item.amount ?? 0;
    //     return item.amount ?? item.transaction?.amount ?? 0;
    // };

    // const parseAmount = (val) => {
    //     if (!val) return 0;
    //     const n = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
    //     return isNaN(n) ? 0 : n;
    // };

    // const sumAmounts = (items, type) =>
    //     items.reduce((s, it) => s + parseAmount(getAmount(it, type)), 0);

    // const formatAmount = (n) =>
    //     n.toLocaleString(undefined, { maximumFractionDigits: 2 });

    const totalFd = sumAmounts(fd, "fd");
    const totalRd = rd?.[0]?.amount ?? 0;
    const totalSavings = savings?.[0]?.amount ?? 0;
    const cgrAmount = totals?.closing ?? 0;
    /* -------------------- UI Parts -------------------- */
    const SECTION_ICONS = {
        fd: "fa-piggy-bank",
        rd: "fa-repeat",
        savings: "fa-wallet",
    };

    const SectionHeader = ({ type, title, count, total, open }) => (
        <div className="flex items-center justify-between w-full">
            {/* Left */}
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <i className={`fa-solid ${SECTION_ICONS[type]} text-sm`} />
                </div>

                <div>
                    <div className="text-sm font-semibold text-gray-800">
                        {title}
                    </div>
                    <div className="text-xs text-gray-500">
                        {count} accounts
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-indigo-700">
                    Rs. {total}
                </div>

                <i
                    className={`fa-solid fa-chevron-down text-xs text-gray-500 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </div>
        </div>
    );

    const LedgerRow = ({ item, type }) => (
        <Link
            href={route(`${type}.show`, item.id)}
            className="flex items-center justify-between px-6 py-3 hover:bg-indigo-50 transition"
        >
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="text-indigo-500">
                    <i className="fa-solid fa-file-invoice text-xs" />
                </div>

                <div className="min-w-0">
                    <div className="text-xs font-medium  truncate text-indigo-700">
                        Account :{" "}
                        {item.account?.account_number ??
                            item.name ??
                            "Deposit Account"}{" "}
                        (#
                        {item.transaction?.reference ?? "-"})
                    </div>
                    <div className="text-[11px] text-gray-500">
                        Start: {formatDate(item.start_date) ?? "—"}
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="text-right shrink-0">
                {type === "fd" && (
                    <div className="text-xs font-semibold text-gray-800">
                        Rs. {formatAmount(parseAmount(getAmount(item, type)))}
                    </div>
                )}
                <div className="text-[11px] text-gray-500 capitalize">
                    {item.status ?? "Active"}
                </div>
            </div>
        </Link>
    );

    /* -------------------- Render -------------------- */

    return (
        <AppLayout title="Deposits">
            <PageHeader
                title="Deposits"
                subtitle="Fixed, Recurring & Savings Accounts"
            />

            <div className="p-4 max-w-4xl mx-auto space-y-4">
                {/* Summary */}

                {/* Summary – Overflow Banking Cards */}
                <div className="-mx-4 px-4 overflow-x-auto">
                    <div className="flex gap-4 min-w-max pb-2">
                        {[
                            {
                                label: "Fixed Deposits",
                                value: totalFd,
                                gradient: "from-indigo-600 to-indigo-500",
                            },
                            {
                                label: "Recurring Deposits",
                                value: totalRd,
                                gradient: "from-emerald-600 to-emerald-500",
                            },
                            {
                                label: "Savings",
                                value: totalSavings,
                                gradient: "from-amber-600 to-amber-500",
                            },
                            {
                                label: "CGR",
                                value: cgrAmount,
                                gradient: "from-sky-600 to-sky-500",
                            },
                        ].map((c) => (
                            <div
                                key={c.label}
                                className={`relative w-64 shrink-0 overflow-hidden rounded-xl p-4 text-white shadow-md bg-gradient-to-br ${c.gradient}`}
                            >
                                {/* Decorative bubble */}
                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />

                                <div className="relative z-10">
                                    <div className="text-xs uppercase tracking-wide opacity-90">
                                        {c.label}
                                    </div>

                                    <div className="mt-2 text-2xl font-bold">
                                        ₹ {formatAmount(c.value)}{" "}
                                        {c.label == "CGR" ? "*" : ""}
                                    </div>

                                    <div className="mt-1 text-[11px] opacity-80">
                                        Total Balance
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Banking Accordions */}
                <div className="space-y-3">
                    {[
                        {
                            key: "fd",
                            index: 1,
                            title: "Fixed Deposits",
                            items: fd,
                            total: formatAmount(totalFd),
                        },
                        {
                            key: "rd",
                            index: 2,
                            title: "Recurring Deposits",
                            items: rd,
                            total: formatAmount(totalRd),
                        },
                        {
                            key: "savings",
                            index: 3,
                            title: "Savings Accounts",
                            items: savings,
                            total: formatAmount(totalSavings),
                        },
                    ].map(({ key, index, title, items, total }) => (
                        <div
                            key={key}
                            className="bg-white border rounded-lg shadow-sm overflow-hidden"
                        >
                            {/* Header */}
                            <button
                                onClick={() => toggle(key)}
                                className="w-full px-4 py-3 border-b bg-gray-50"
                            >
                                <SectionHeader
                                    type={key}
                                    title={title}
                                    count={items.length}
                                    total={total}
                                    open={open[key]}
                                />
                            </button>

                            {/* Body */}
                            {open[key] && (
                                <div className="divide-y">
                                    {items.length ? (
                                        items.map((item) => (
                                            <LedgerRow
                                                key={item.id}
                                                item={item}
                                                type={key}
                                            />
                                        ))
                                    ) : (
                                        <div className="py-6 text-center text-sm text-gray-500">
                                            No records available
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="">
                    <span className="text-red-900 text-xs">
                        * All the interest amount shown above are for reference
                        only. The interest amount is valid only after end of
                        financial year/maturity period.
                    </span>
                </div>
            </div>
        </AppLayout>
    );
}
