import React, { ReactNode } from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    children: ReactNode;
    header?: ReactNode;
}

export default function FrontendLayout({ children, header }: Props) {
    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>Islamic Content</title>
                <meta name="description" content="Discover and learn from Islamic content" />
            </Head>

            {/* Frontend Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Islamic Content</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {header && (
                    <div className="mb-6">
                        {header}
                    </div>
                )}
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Islamic Content. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
