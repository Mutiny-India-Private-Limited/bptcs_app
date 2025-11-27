import React from "react";

export default function PageHeader({ title, subtitle }) {
    return (
        <div className="bg-indigo-700 text-white p-6 pb-8 text-center relative overflow-hidden rounded-b-xl">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-indigo-600 opacity-90"></div>

            {/* Decorative dotted pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "15px 15px",
                }}
            ></div>

            {/* Content */}
            <h1 className="relative z-10 text-2xl font-extrabold tracking-tight">
                {title}
            </h1>

            {subtitle && (
                <p className="relative z-10 text-indigo-100 text-sm mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
