import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";

export default function Toast({
    type = "success",
    message,
    duration = 4000,
    onClose,
}) {
    const [show, setShow] = useState(true);
    const [progress, setProgress] = useState(100);

    const colors = {
        success: "bg-green-50 border-green-300 text-green-800",
        error: "bg-red-50 border-red-300 text-red-800",
        info: "bg-blue-50 border-blue-300 text-blue-800",
        warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
    };

    const icons = {
        success: "fa-circle-check text-green-500",
        error: "fa-circle-xmark text-red-500",
        info: "fa-circle-info text-blue-500",
        warning: "fa-triangle-exclamation text-yellow-500",
    };

    // Auto-hide + progress animation
    useEffect(() => {
        const interval = 30;
        const steps = duration / interval;
        const stepAmount = 100 / steps;

        const timer = setInterval(() => {
            setProgress((p) => {
                if (p <= 0) {
                    clearInterval(timer);
                    setShow(false);
                    setTimeout(() => onClose?.(), 300);
                    return 0;
                }
                return p - stepAmount;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [duration, onClose]);

    return (
        <Transition
            show={show}
            appear
            enter="transform transition ease-out duration-300"
            enterFrom="translate-y-8 opacity-0 scale-95"
            enterTo="translate-y-0 opacity-100 scale-100"
            leave="transform transition ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
            as="div"
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] sm:max-w-xs px-4 py-3 border ${colors[type]} rounded-xl shadow-lg flex items-start justify-between space-x-3 z-50`}
        >
            <div className="flex items-start space-x-3 flex-1">
                <i className={`fa-solid ${icons[type]} text-lg mt-0.5`}></i>
                <span className="text-sm font-medium leading-snug break-words">
                    {message}
                </span>
            </div>
            <button
                onClick={() => {
                    setShow(false);
                    setTimeout(() => onClose?.(), 300);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
                ✕
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gray-200 rounded-b-xl overflow-hidden">
                <div
                    className={`h-full ${
                        type === "error"
                            ? "bg-red-500"
                            : type === "info"
                            ? "bg-blue-500"
                            : type === "warning"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    } transition-[width] duration-75 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </Transition>
    );
}
