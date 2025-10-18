import React, { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Head } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';

interface Props {
    children: ReactNode;
    header?: ReactNode;
}

export default function AdminLayout({ children, header }: Props) {
    return (
        <>
            <Head>
                <title>Admin - Islamic Content</title>
                <meta name="description" content="Islamic Content Management System" />
            </Head>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <main className="p-6">
                        {header && (
                            <div className="mb-6">
                                {header}
                            </div>
                        )}
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}
