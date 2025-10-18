import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';

interface PrivacyProps {
    meta: {
        title: string;
        description: string;
    };
    navigationCategories: {
        id: number;
        name: string;
        slug: string;
        order: number;
    }[];
}

export default function Privacy({ meta, navigationCategories }: PrivacyProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                        
                        <div className="prose prose-lg max-w-none">
                            <p className="text-lg text-gray-600 mb-8">
                                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                            </p>

                            <p className="text-gray-700 mb-8">
                                At Islamic Content, we are committed to protecting your privacy and ensuring 
                                the security of your personal information. This Privacy Policy explains how 
                                we collect, use, disclose, and safeguard your information when you visit 
                                our website.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                            
                            <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
                            <p className="text-gray-700 mb-4">
                                We may collect personal information that you voluntarily provide to us when you:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Register for an account on our website</li>
                                <li>Subscribe to our newsletter</li>
                                <li>Contact us through our contact form</li>
                                <li>Participate in surveys or feedback forms</li>
                                <li>Comment on our articles</li>
                            </ul>

                            <p className="text-gray-700 mb-6">
                                This information may include your name, email address, and any other 
                                information you choose to provide.
                            </p>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">Automatically Collected Information</h3>
                            <p className="text-gray-700 mb-4">
                                When you visit our website, we may automatically collect certain information, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>IP address and location data</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent on our site</li>
                                <li>Referring website</li>
                                <li>Device information</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">
                                We use the information we collect for various purposes, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Providing and maintaining our website services</li>
                                <li>Improving user experience and website functionality</li>
                                <li>Sending newsletters and updates (with your consent)</li>
                                <li>Responding to your inquiries and support requests</li>
                                <li>Analyzing website usage and trends</li>
                                <li>Preventing fraud and ensuring website security</li>
                                <li>Complying with legal obligations</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
                            <p className="text-gray-700 mb-4">
                                We do not sell, trade, or otherwise transfer your personal information to 
                                third parties without your consent, except in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li><strong>Service Providers:</strong> We may share information with trusted 
                                    third-party service providers who assist us in operating our website 
                                    and conducting our business.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose information when 
                                    required by law or to protect our rights, property, or safety.</li>
                                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, 
                                    or sale of assets, your information may be transferred as part of the transaction.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                            <p className="text-gray-700 mb-6">
                                We implement appropriate security measures to protect your personal information 
                                against unauthorized access, alteration, disclosure, or destruction. However, 
                                no method of transmission over the internet or electronic storage is 100% secure, 
                                and we cannot guarantee absolute security.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 mb-4">
                                We use cookies and similar tracking technologies to enhance your experience 
                                on our website. Cookies are small files that are stored on your device and 
                                help us:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website traffic and usage patterns</li>
                                <li>Provide personalized content and advertisements</li>
                                <li>Improve website performance and functionality</li>
                            </ul>

                            <p className="text-gray-700 mb-6">
                                You can control cookie settings through your browser preferences. However, 
                                disabling cookies may affect the functionality of our website.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights and Choices</h2>
                            <p className="text-gray-700 mb-4">
                                Depending on your location, you may have certain rights regarding your 
                                personal information, including:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li><strong>Access:</strong> Request access to your personal information</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
                            <p className="text-gray-700 mb-6">
                                Our website may contain links to third-party websites. We are not responsible 
                                for the privacy practices or content of these external sites. We encourage 
                                you to review the privacy policies of any third-party sites you visit.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
                            <p className="text-gray-700 mb-6">
                                Our website is not intended for children under 13 years of age. We do not 
                                knowingly collect personal information from children under 13. If you are 
                                a parent or guardian and believe your child has provided us with personal 
                                information, please contact us immediately.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
                            <p className="text-gray-700 mb-6">
                                We may update this Privacy Policy from time to time. We will notify you of 
                                any changes by posting the new Privacy Policy on this page and updating the 
                                "Last updated" date. We encourage you to review this Privacy Policy periodically 
                                for any changes.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                            <p className="text-gray-700 mb-6">
                                If you have any questions about this Privacy Policy or our privacy practices, 
                                please contact us at:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> privacy@islamiccontent.com<br />
                                    <strong>Contact Form:</strong> <a href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">Visit our Contact page</a>
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    This Privacy Policy is effective as of the date listed above and will remain 
                                    in effect except with respect to any changes in its provisions in the future, 
                                    which will be in effect immediately after being posted on this page.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
