import React from "react";

export default function MetricCard({
    title,
    value,
    color = "blue",
    size = "md", // "sm", "md", "lg"
    align = "left", // "left", "center", "right"
    hover = true,
    valueSize, // optional override for value text
}) {
    const sizeClasses = {
        sm: {
            title: "text-xs",
            value: "text-lg",
            padding: "p-3",
        },
        md: {
            title: "text-sm",
            value: "text-2xl",
            padding: "p-4",
        },
        lg: {
            title: "text-base",
            value: "text-3xl",
            padding: "p-6",
        },
    }[size];

    const colorMap = {
        blue: "text-blue-600 border-blue-400",
        red: "text-red-600 border-red-400",
        green: "text-emerald-600 border-emerald-400",
        indigo: "text-indigo-700 border-indigo-400",
        yellow: "text-amber-600 border-amber-400",
        gray: "text-gray-600 border-gray-400",
        cyan: "text-cyan-600 border-cyan-400",
        violet: "text-violet-600 border-violet-400",
    };

    return (
        <div
            className={`bg-white ${
                sizeClasses.padding
            } rounded-lg shadow-md border-l-4 ${
                colorMap[color] || colorMap.blue
            } ${
                hover
                    ? "hover:shadow-lg transition-transform hover:-translate-y-1"
                    : ""
            } text-${align}`}
        >
            <p
                className={`${sizeClasses.title} font-medium text-gray-500 uppercase truncate`}
            >
                {title}
            </p>
            <p
                className={`${valueSize || sizeClasses.value} font-bold ${
                    colorMap[color]?.split(" ")[0]
                } mt-1`}
            >
                {value}
            </p>
        </div>
    );
}
