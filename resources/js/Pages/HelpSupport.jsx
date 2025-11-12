import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import DetailRow from "@/Components/DetailRow";

export default function HelpSupport() {
    return (
        <AppLayout title="Help and Support">
            {/* Header */}
            <PageHeader
                title="Help and Support"
                subtitle="Get assistance and contact information"
            />

            {/* Support Details */}
            <div className="p-4">
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Contact Information
                    </h2>

                    <DetailRow
                        label="Support Email"
                        value="support@example.com"
                    />
                    <DetailRow label="Support Phone" value="+91 234 567 890" />
                    <DetailRow
                        label="Operating Hours"
                        value="Mon - Fri, 9 AM - 6 PM"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
