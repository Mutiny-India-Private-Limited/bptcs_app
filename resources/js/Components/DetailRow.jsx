import React from "react";

export default function DetailRow({ label, value, type }) {
    const hrefMap = {
        tel: `tel:${value}`,
        email: `mailto:${value}`,
    };

    const href = type ? hrefMap[type] : null;

    return (
        <div className="flex justify-between items-start text-sm sm:text-base">
            <span className="font-semibold text-gray-600 w-1/3">{label}:</span>
            <span className="text-gray-800 w-2/3 text-right">
                {href ? (
                    <a href={href} className="text-blue-600 hover:underline">
                        {value}
                    </a>
                ) : (
                    value
                )}
            </span>
        </div>
    );
}
