import React from "react";

export default function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-start text-sm sm:text-base">
            <span className="font-semibold text-gray-600 w-1/3">{label}:</span>
            <span className="text-gray-800 w-2/3 text-right">{value}</span>
        </div>
    );
}
