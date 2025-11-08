import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { usePage } from "@inertiajs/react";
import DetailRow from "@/Components/DetailRow";

export default function Office() {
    const { member } = usePage().props;
    return (
        <AppLayout title="Office">
            {/* Header */}
            <PageHeader
                title={member?.designation}
                subtitle="Official branch details"
            />

            {/* Office Details */}
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
