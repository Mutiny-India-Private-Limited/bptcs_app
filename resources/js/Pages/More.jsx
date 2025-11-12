import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function More() {
    const { auth } = usePage().props || {};

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route("logout"));
    };

    const menuItems = [
        {
            icon: "fa-solid fa-refresh",
            label: "Refresh",
            href: route("refresh"),
        },
        // { icon: "fa-solid fa-gear", label: "Settings", href: "/settings" },
        {
            icon: "fa-solid fa-circle-question",
            label: "Help & Support",
            href: route("help_support"),
        },
        {
            icon: "fa-solid fa-blog",
            label: "Blogs",
            href: route("blogs"),
        },
        {
            icon: "fa-solid fa-bell",
            label: "Notification",
            href: route("notification"),
        },
    ];

    return (
        <AppLayout title="More">
            {/* Header */}
            <PageHeader
                title="More"
                subtitle="Additional options and settings"
            />

            {/* Menu List */}
            <div className="p-4 space-y-2 flex-1">
                {menuItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 hover:bg-indigo-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <i
                                className={`${item.icon} text-indigo-600 text-lg`}
                            ></i>
                            <span className="font-medium text-gray-700">
                                {item.label}
                            </span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
                    </Link>
                ))}
            </div>

            {/* Logout Button */}
            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
                >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Logout
                </button>
            </div>
        </AppLayout>
    );
}
