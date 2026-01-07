import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function More() {
    const { auth } = usePage().props || {};

    const handleLogout = (e) => {
        e.preventDefault();

        const confirmed = window.confirm("Are you sure you want to log out?");
        if (!confirmed) return;
        if (window?.AppInterface) {
            const response = window.AppInterface.deleteLoggedInUser?.();
            console.log(response);
        }
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
        // {
        //     icon: "fa-solid fa-file-lines",
        //     label: "Privacy & Policy",
        //     href: "#",
        // },
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
                {/* <button
                    type="button"
                    id="btn-setup-biometric"
                    onClick={() => window.enableTouchID()}
                    className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-4 hover:bg-indigo-50 transition text-left focus:outline-none focus:ring-0"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-fingerprint text-indigo-600 text-lg"></i>
                        <span className="font-medium text-gray-700">
                            Enable Touch ID
                        </span>
                    </div>
                </button> */}
                <div
                    id="touch-id-item"
                    className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 hover:bg-indigo-50 transition cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <i className="fa-solid fa-fingerprint text-indigo-600 text-lg"></i>
                        <span className="font-medium text-gray-700">
                            Enable Touch ID
                        </span>
                    </div>

                    {/* Radio-style knob */}
                    {/* <div
                        id="touch-id-switch-wrapper"
                        style={{
                            width: "38px",
                            height: "22px",
                            position: "relative",
                        }}
                    >
                        <div
                            id="touch-id-switch"
                            role="switch"
                            aria-checked="false"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "11px",
                                backgroundColor: "#d1d5db", // default off
                                position: "relative",
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                            }}
                        ></div>

                        <div
                            id="touch-id-knob"
                            style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: "2px",
                                left: "2px", // default off position
                                transition: "left 0.2s ease",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                            }}
                        ></div>
                    </div> */}
                    <div
                        style={{
                            width: "38px",
                            height: "22px",
                            position: "relative",
                            opacity: 0.6, // subtle visual cue for disabled
                        }}
                    >
                        {/* Track */}
                        <div
                            role="switch"
                            aria-checked="true"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "11px",
                                backgroundColor: "#34C759", // keep green
                                position: "relative",
                                cursor: "not-allowed", // show disabled
                                transition: "background-color 0.2s ease",
                            }}
                        ></div>

                        {/* Knob */}
                        <div
                            style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: "2px",
                                left: "18px", // keep right side for "on"
                                transition: "left 0.2s ease",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-md transition logout"
                >
                    <i className="fa-solid fa-right-from-bracket mr-2"></i>
                    Logout
                </button>
            </div>
        </AppLayout>
    );
}
