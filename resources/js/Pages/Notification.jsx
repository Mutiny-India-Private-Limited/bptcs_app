import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function Notifications() {
    const { notifications } = usePage().props;

    const [isEnabled, setIsEnabled] = useState(false);
    const [showTip, setShowTip] = useState(false);

    // Check notification state on mount
    useEffect(() => {
        updateSwitchState();
    }, []);

    const updateSwitchState = () => {
        if (window.AppInterface) {
            const enabled = window.AppInterface.isNotificationEnabled?.();
            if (enabled !== undefined) {
                setIsEnabled(enabled);
            }
        }
    };

    const toggleNotification = () => {
        if (window.AppInterface) {
            // Open Android system notification settings
            window.AppInterface.openNotificationSettings?.();

            // Re-check state after returning to app
            setTimeout(updateSwitchState, 2000);
        }
    };

    const Description = ({ text }) => {
        const [expanded, setExpanded] = useState(false);

        const words = text.split(" ");
        const isLong = words.length > 20;

        const shownText = expanded ? text : words.slice(0, 20).join(" ");

        return (
            <p
                className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed "
                onClick={() => isLong && setExpanded(!expanded)}
            >
                {shownText}
                {isLong && !expanded && " ..."}
                {isLong && (
                    <span className="text-blue-600 ml-1 cursor-pointer">
                        {expanded ? "Show less" : "Show more"}
                    </span>
                )}
            </p>
        );
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <AppLayout title="Notifications">
            <PageHeader
                title="Notifications"
                subtitle="Stay informed with the latest updates and alerts"
            />

            <div className="px-3 sm:px-4 pb-6 py-4">
                <div
                    id="notification-card"
                    style={{
                        padding: "15px",
                        background: "#f3f4f6",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <span>Push Notifications</span>

                        <div style={{ position: "relative" }}>
                            <span
                                onClick={() => setShowTip((v) => !v)}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    borderRadius: "50%",
                                    border: "1px solid #9ca3af",
                                    color: "#6b7280",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                i
                            </span>

                            {showTip && (
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "130%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#111827",
                                        color: "#fff",
                                        padding: "6px 8px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                        zIndex: 10,
                                    }}
                                >
                                    Enable push notifications to receive
                                    important updates.
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        role="switch"
                        aria-checked={isEnabled}
                        onClick={toggleNotification}
                        style={{
                            width: "38px",
                            height: "22px",
                            borderRadius: "11px",
                            backgroundColor: isEnabled ? "#34C759" : "#d1d5db",
                            position: "relative",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        <div
                            style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: "2px",
                                left: isEnabled ? "18px" : "2px",
                                transition: "left 0.2s ease",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {notifications?.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif.id}
                                className="p-3 sm:p-5 border-b last:border-b-0 transition-all active:bg-gray-100 hover:bg-gray-50"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <i className="fa-solid fa-circle-info text-indigo-600 text-base sm:text-lg"></i>
                                            {notif.title}
                                        </h3>

                                        {notif.description && (
                                            <Description
                                                text={notif.description}
                                            />
                                        )}
                                    </div>

                                    {/* Timestamp Badge */}
                                    <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                                        {formatTime(notif.created_at)}
                                    </span>
                                </div>

                                {/* Action URL */}
                                {notif.actionUrl && (
                                    <Link
                                        href={notif.actionUrl}
                                        className="text-indigo-600 text-xs sm:text-sm mt-3 inline-flex items-center gap-1 hover:underline"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fa-solid fa-link"></i>
                                        Open Link
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-500 text-sm">
                            <i className="fa-solid fa-bell-slash text-4xl mb-3 text-gray-300"></i>
                            No notifications available
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
