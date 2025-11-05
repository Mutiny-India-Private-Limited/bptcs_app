import React from "react";
import { usePage } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="bg-gray-50 font-sans min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden relative flex flex-col">
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
