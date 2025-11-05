import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
export default function Profile() {
    // Example static profile data
    const profileData = {
        name: "Kunal Kumar",
        memberId: "M12345",
        phone: "+91-7004935013",
        email: "kunal@example.com",
        office: "Patna Branch",
    };

    return (
        <AppLayout title="Profile">
            {/* Header */}
            <PageHeader title="Profile" subtitle="Your profile information" />

            {/* Profile Details Card */}
            <div className="p-4">
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                            Name:
                        </span>
                        <span className="text-gray-800">
                            {profileData.name}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                            Member ID:
                        </span>
                        <span className="text-gray-800">
                            {profileData.memberId}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                            Phone:
                        </span>
                        <span className="text-gray-800">
                            {profileData.phone}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                            Email:
                        </span>
                        <span className="text-gray-800">
                            {profileData.email}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                            Office:
                        </span>
                        <span className="text-gray-800">
                            {profileData.office}
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
