import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { usePage, Head } from "@inertiajs/react";
import DetailRow from "@/Components/DetailRow";

export default function Profile() {
    //  Get member data passed from Laravel controller
    const { member } = usePage().props;

    return (
        <AppLayout title={`Profile - ${member.name}`}>
            <PageHeader
                title={member?.name}
                subtitle="Your profile information"
            />

            {/* Profile Details Card */}
            <div className="p-4">
                {!member ? (
                    // Case: No member data
                    <div className="text-center text-gray-500 py-10">
                        No member information found.
                    </div>
                ) : (
                    <>
                        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                                Member Information
                            </h2>

                            <DetailRow
                                label="Name"
                                value={member.name ?? "—"}
                            />
                            <DetailRow
                                label="CGR"
                                value={member.cgr_number ?? "—"}
                            />
                            <DetailRow
                                label="Member ID"
                                value={member.member_number ?? "—"}
                            />
                            <DetailRow
                                label="Father's Name"
                                value={member.fathers_name ?? "—"}
                            />
                            <DetailRow
                                label="Date of Birth"
                                value={member.date_of_birth ?? "—"}
                            />
                            <DetailRow
                                label="Phone"
                                value={member.phone_number ?? "—"}
                            />
                            <DetailRow
                                label="Permanent Address"
                                value={member.permanent_address ?? "—"}
                            />
                            <DetailRow
                                label="City"
                                value={member.permanent_city ?? "—"}
                            />
                            <DetailRow
                                label="State"
                                value={member.permanent_state ?? "—"}
                            />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                            <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                                Nominee Details
                            </h2>

                            <DetailRow
                                label="Nominee Name"
                                value={member.nominee_name ?? "—"}
                            />
                            <DetailRow
                                label="Nominee Relation"
                                value={member.nominee_relation ?? "—"}
                            />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                            <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                                Office Information
                            </h2>

                            <DetailRow
                                label="Designation"
                                value={member?.designation}
                            />
                            <DetailRow
                                label="Date of Appointment"
                                value={member?.date_of_appointment}
                            />
                            <DetailRow
                                label="Date of Retirement"
                                value={member?.date_of_retirement}
                            />
                            <DetailRow
                                label="Office Address"
                                value={member?.office_address}
                            />
                            <DetailRow
                                label="City"
                                value={member?.office_city}
                            />
                            <DetailRow
                                label="State"
                                value={member?.office_state}
                            />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mt-4">
                            <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                                Demand Office
                            </h2>

                            <DetailRow
                                label="Zone"
                                value={member.zone ?? "—"}
                            />
                            <DetailRow
                                label="District"
                                value={member.district ?? "—"}
                            />
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
