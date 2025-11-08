import React, { useEffect, useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import Toast, { showToast } from "@/Components/Toast";

export default function AppLayout({ children, ...meta }) {
    const title = meta.title || "BPTCS";
    const [loading, setLoading] = useState(false);
    const { flash } = usePage().props;
    const isActive = (routeName) => route().current(routeName);
    useEffect(() => {
        const start = () => {
            setLoading(true);
            showToast.dismiss(); // remove any toasts when navigating
        };
        const stop = () => setLoading(false);

        const removeStart = router.on("start", start);
        const removeFinish = router.on("finish", stop);
        const removeError = router.on("error", stop);

        return () => {
            removeStart();
            removeFinish();
            removeError();
        };
    }, []);

    useEffect(() => {
        if (flash?.success) showToast.success(flash.success);
        else if (flash?.error) showToast.error(flash.error);
    }, [flash]);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="bg-gray-50 font-sans min-h-screen flex flex-col items-center">
                <div className="w-full max-w-md bg-white shadow-2xl min-h-screen flex flex-col relative">
                    {/* Header is rendered by the page component itself (PageHeader) */}

                    {/* ✅ Main content area (relative for spinner positioning) */}
                    <div className="flex-1 w-full overflow-y-auto pb-24 relative">
                        {children}

                        {/* Spinner overlay only inside content (below header) */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-30">
                                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ✅ Fixed bottom navigation */}
                <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md h-16 bg-white border-t border-gray-200 shadow-lg flex items-center justify-around z-40 text-xs z-[10000]">
                    <NavLink
                        name="home"
                        icon="fa-house"
                        label="Home"
                        active={isActive("home")}
                    />
                    <NavLink
                        name="profile"
                        icon="fa-user"
                        label="Profile"
                        active={isActive("profile")}
                    />
                    <NavLink
                        name="office"
                        icon="fa-building"
                        label="Office"
                        active={isActive("office")}
                    />
                    <NavLink
                        name="ledger.years"
                        icon="fa-book"
                        label="Ledger"
                        active={isActive("ledger.years")}
                    />
                    <NavLink
                        name="more"
                        icon="fa-ellipsis-h"
                        label="More"
                        active={isActive("more")}
                    />
                </nav>

                {/* Toast */}
                <Toast />
            </div>
        </>
    );
}

function NavLink({ name, icon, label, active }) {
    return (
        <Link
            href={route(name)}
            className={`flex flex-col items-center justify-center w-1/5 p-2 transition-colors ${
                active
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600 hover:text-indigo-600"
            }`}
        >
            <i className={`fa-solid ${icon} text-lg`}></i>
            <span className="mt-1">{label}</span>
        </Link>
    );
}
