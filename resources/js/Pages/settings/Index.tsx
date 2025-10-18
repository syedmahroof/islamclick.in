import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function SettingsIndex() {
    return (
        <div>
            <Head title="Settings" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-4">
                        <p className="text-gray-600">Application settings will be available here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

SettingsIndex.layout = (page: React.ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
