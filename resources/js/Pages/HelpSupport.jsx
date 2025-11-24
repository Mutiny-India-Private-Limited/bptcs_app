import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import DetailRow from "@/Components/DetailRow";
import { usePage } from "@inertiajs/react";

export default function HelpSupport() {
    const { base_url } = usePage().props;
    return (
        <AppLayout title="Help and Support">
            {/* Header */}
            <PageHeader
                title="Help and Support"
                subtitle="Get assistance and contact information"
            />

            {/* Support Details */}
            <div className="p-4">
                <div className="bg-white shadow-md rounded-lg p-6 space-y-4 mb-4">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        Contact Information
                    </h2>

                    {/* <DetailRow
                        label="Support Email"
                        value="support@example.com"
                    /> */}
                    <DetailRow
                        label="Support Phone"
                        value="0612-2221344"
                        type="tel"
                    />
                </div>
                <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-100">
                    <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">
                        📌 <span>NOTE</span>
                    </h2>

                    <ul className="space-y-3 text-gray-700 leading-relaxed">
                        <li className="flex gap-2">
                            <span className="text-blue-600 font-semibold">
                                •
                            </span>
                            यदि आपको उपरोक्त डेटा में कोई त्रुटि मिलती है, तो
                            कृपया BP&TCS पटना से तुरंत संपर्क करें।
                        </li>

                        <li className="flex gap-2">
                            <span className="text-blue-600 font-semibold">
                                •
                            </span>
                            अपना डेटा ऑनलाइन देखने के लिए https://bptcspatna.com
                            वेबसाइट पर जाएं। अपना सदस्य नंबर (यूज़रनेम) और अपना
                            मोबाइल नंबर (पासवर्ड) दर्ज करें।
                        </li>

                        <li className="flex gap-2">
                            <span className="text-blue-600 font-semibold">
                                •
                            </span>
                            यदि आप अपना डेटा ऑनलाइन नहीं देख पा रहे हैं, तो
                            कृपया सुनिश्चित करें कि आपका मोबाइल नंबर सही है।
                        </li>

                        <li className="flex gap-2">
                            <span className="text-blue-600 font-semibold">
                                •
                            </span>
                            समय पर नवीनतम अपडेट प्राप्त करने के लिए आपको अपना
                            डेटा अपडेट करना होगा।
                        </li>

                        <li className="flex gap-2">
                            <span className="text-blue-600 font-semibold">
                                •
                            </span>
                            जिन सदस्यों ने अपना मोबाइल नंबर समिति में दर्ज नहीं
                            कराया है, वे सदस्य यथाशीघ्र अपना मोबाइल नंबर समिति
                            कार्यालय में दर्ज कराएं ताकि ऑनलाइन सुविधा का लाभ
                            मिल सके।
                        </li>
                    </ul>
                    <p align="right">
                        <img
                            src={`${base_url}/assets/images/logo2.png`}
                            className="h-12 w-auto"
                        />
                        <br />
                        अवैतनिक सचिव
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
