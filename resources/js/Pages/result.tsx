import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Diagnostics',
        href: '/diagnostics',
    },
];

type Inventory = {
    id: number;
    imei: string;
    status: string;
};

type PageProps = {
    inventories: Inventory[];
};

export default function Diagnostics() {
    const { props } = usePage<PageProps>();
    const { inventories } = props; // Fetching inventories from Inertia
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diagnostics" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    {inventories.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {inventories.map((inventory) => (
                                <div
                                    key={inventory.id}
                                    className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border flex flex-col items-center justify-center p-4"
                                >
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                                        {inventory.imei}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Status: {inventory.status}
                                    </span>
                                    <button
                                        className="mt-2 rounded-sm border border-black bg-[#1b1b18] px-4 py-1.5 text-sm text-white hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                        onClick={() => handleDiagnose(inventory.imei)}
                                    >
                                        Diagnose
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border"
                                >
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Function to handle IMEI diagnosis
const handleDiagnose = (imei: string) => {
    console.log(`Diagnosing ${imei}`);
};
