// resources/js/Components/Toast.jsx
import React from "react";
import { Toaster, toast } from "react-hot-toast";

/**
 * Helper functions for default toasts
 */
export const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    info: (message) => toast(message),
    custom: (message) => toast(message),
    dismiss: () => toast.dismiss(),
};

/**
 * Global Toaster configuration
 */
export default function Toast() {
    return (
        <Toaster
            position="bottom-center"
            gutter={12}
            containerStyle={{
                bottom: "5rem", // move it above your bottom nav
            }}
            toastOptions={{
                duration: 4000,
                style: {
                    borderRadius: "8px",
                    background: "#fff",
                    color: "#333",
                    fontSize: "0.9rem",
                    padding: "10px 14px",
                },
                success: {
                    iconTheme: {
                        primary: "#16a34a", // Tailwind green-600
                        secondary: "#fff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#dc2626", // Tailwind red-600
                        secondary: "#fff",
                    },
                },
            }}
        />
    );
}
