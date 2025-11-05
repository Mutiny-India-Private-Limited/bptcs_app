import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function Office() {
    // Example office data
    const officeData = {
        name: "Patna Branch",
        address:
            "G0/0, H/o, Kailash Prasad, Harnichak, Anisabad, Patna, Bihar 800002",
        phone: "+91-022-45678900",
        email: "mipl@company.com",
        manager: "Vikash Mishra",
        established: "2015",
        timings: "Mon - Sat, 9:00 AM - 6:00 PM",
        totalEmployees: 42,
        departments: ["Finance", "HR", "Sales", "Support", "IT"],
    };

    return (
        <AppLayout title="Office">
            {/* Header */}
            <PageHeader
                title={officeData.name}
                subtitle="Official branch details"
            />

            {/* Office Details */}
            <div className="p-4">
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Office Information
                    </h2>

                    <DetailRow label="Address" value={officeData.address} />
                    <DetailRow label="Phone" value={officeData.phone} />
                    <DetailRow label="Email" value={officeData.email} />
                    <DetailRow label="Manager" value={officeData.manager} />
                    <DetailRow
                        label="Established Year"
                        value={officeData.established}
                    />
                    <DetailRow
                        label="Office Timings"
                        value={officeData.timings}
                    />
                    <DetailRow
                        label="Total Employees"
                        value={officeData.totalEmployees}
                    />

                    <div>
                        <span className="font-semibold text-gray-600">
                            Departments:
                        </span>
                        <ul className="list-disc ml-5 mt-1 text-gray-800">
                            {officeData.departments.map((dept) => (
                                <li key={dept}>{dept}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// ✅ Reusable detail row
function DetailRow({ label, value }) {
    return (
        <div className="flex justify-between items-start text-sm sm:text-base">
            <span className="font-semibold text-gray-600 w-1/3">{label}:</span>
            <span className="text-gray-800 w-2/3 text-right">{value}</span>
        </div>
    );
}
