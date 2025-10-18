import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/reports/analatics',
    },
];


export default function Analatics() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Islamc Click" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                
        </div>
        </AppLayout>
    );
}
