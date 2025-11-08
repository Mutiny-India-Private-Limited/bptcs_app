import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import DetailRow from "@/Components/DetailRow";

export default function Office() {
    return (
        <AppLayout title="Office">
            {/* Header */}
            <PageHeader title="Help and Support" subtitle="" />

            {/* Office Details */}
            <div className="p-4">
                <>
                    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                            Contact Information
                        </h2>

                        <DetailRow label="Designation" value="" />
                        <DetailRow label="Date of Appointment" value="" />
                        <DetailRow label="Date of Retirement" value="" />
                        <DetailRow label="Office Address" value="" />
                    </div>
                </>
            </div>
        </AppLayout>
    );
}
