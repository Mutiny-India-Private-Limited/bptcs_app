import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function Notifications() {
    const { notifications } = usePage().props;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <AppLayout title="Notificationsa">
            <PageHeader
                title="Notifications"
                subtitle="Stay informed with the latest updates and alerts"
            />

            <div className="px-3 sm:px-4 pb-6 py-4">
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
                                            <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                                                {notif.description}
                                            </p>
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
