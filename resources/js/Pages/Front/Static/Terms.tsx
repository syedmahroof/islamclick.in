import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';

interface TermsProps {
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

export default function Terms({ meta, navigationCategories }: TermsProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
                        
                        <div className="prose prose-lg max-w-none">
                            <p className="text-lg text-gray-600 mb-8">
                                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                            </p>

                            <p className="text-gray-700 mb-8">
                                Welcome to Islamic Content. These Terms and Conditions ("Terms") govern your 
                                use of our website and services. By accessing or using our website, you agree 
                                to be bound by these Terms.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 mb-6">
                                By accessing and using this website, you accept and agree to be bound by the 
                                terms and provision of this agreement. If you do not agree to abide by the 
                                above, please do not use this service.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                            <p className="text-gray-700 mb-4">
                                Permission is granted to temporarily download one copy of the materials on 
                                Islamic Content's website for personal, non-commercial transitory viewing only. 
                                This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose or for any public display</li>
                                <li>Attempt to reverse engineer any software contained on the website</li>
                                <li>Remove any copyright or other proprietary notations from the materials</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Content and Intellectual Property</h2>
                            <p className="text-gray-700 mb-4">
                                All content on this website, including but not limited to text, graphics, 
                                logos, images, and software, is the property of Islamic Content or its 
                                content suppliers and is protected by copyright and other intellectual 
                                property laws.
                            </p>
                            <p className="text-gray-700 mb-6">
                                You may not reproduce, distribute, modify, or create derivative works from 
                                our content without explicit written permission. However, you may share 
                                links to our articles and quote brief excerpts for educational or 
                                non-commercial purposes, provided you give proper attribution.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
                            <p className="text-gray-700 mb-4">
                                You agree to use our website in a manner that is lawful and respectful. 
                                You agree not to:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Post or transmit any unlawful, threatening, defamatory, or obscene content</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe upon the rights of others</li>
                                <li>Distribute viruses or other harmful computer code</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with the proper functioning of the website</li>
                                <li>Use automated systems to access the website without permission</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User-Generated Content</h2>
                            <p className="text-gray-700 mb-4">
                                If you submit comments, feedback, or other content to our website, you grant 
                                us a non-exclusive, royalty-free, perpetual, and worldwide license to use, 
                                modify, and display such content in connection with our services.
                            </p>
                            <p className="text-gray-700 mb-6">
                                You are responsible for ensuring that any content you submit does not violate 
                                these Terms or infringe upon the rights of others. We reserve the right to 
                                remove any content that we deem inappropriate or in violation of these Terms.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Disclaimer</h2>
                            <p className="text-gray-700 mb-4">
                                The information on this website is provided on an "as is" basis. To the fullest 
                                extent permitted by law, Islamic Content:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Excludes all representations and warranties relating to this website and its contents</li>
                                <li>Does not warrant that the website will be constantly available or available at all</li>
                                <li>Does not warrant that the information on this website is complete, true, or accurate</li>
                                <li>Does not warrant that the website or its server are free of viruses or other harmful components</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                            <p className="text-gray-700 mb-6">
                                In no event shall Islamic Content or its suppliers be liable for any damages 
                                (including, without limitation, damages for loss of data or profit, or due 
                                to business interruption) arising out of the use or inability to use the 
                                materials on Islamic Content's website, even if Islamic Content or an 
                                authorized representative has been notified orally or in writing of the 
                                possibility of such damage.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Religious Content Disclaimer</h2>
                            <p className="text-gray-700 mb-4">
                                While we strive to provide accurate Islamic content based on authentic sources, 
                                we acknowledge that:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                                <li>Islamic scholarship is vast and interpretations may vary among scholars</li>
                                <li>We encourage users to consult with qualified Islamic scholars for specific religious guidance</li>
                                <li>Our content is for educational purposes and should not replace personal consultation with religious authorities</li>
                                <li>We are not responsible for individual interpretations or applications of the content</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Privacy Policy</h2>
                            <p className="text-gray-700 mb-6">
                                Your privacy is important to us. Please review our Privacy Policy, which also 
                                governs your use of the website, to understand our practices. You can find 
                                our Privacy Policy at <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">/privacy</a>.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications</h2>
                            <p className="text-gray-700 mb-6">
                                Islamic Content may revise these Terms at any time without notice. By using 
                                this website, you are agreeing to be bound by the then current version of 
                                these Terms and Conditions of Use.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
                            <p className="text-gray-700 mb-6">
                                These Terms shall be governed by and construed in accordance with applicable 
                                laws, without regard to conflict of law principles. Any disputes arising 
                                from these Terms or your use of the website shall be subject to the 
                                jurisdiction of the appropriate courts.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Severability</h2>
                            <p className="text-gray-700 mb-6">
                                If any provision of these Terms is found to be unenforceable or invalid, 
                                that provision will be limited or eliminated to the minimum extent necessary 
                                so that the remaining Terms will remain in full force and effect.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
                            <p className="text-gray-700 mb-6">
                                If you have any questions about these Terms and Conditions, please contact us:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700">
                                    <strong>Email:</strong> legal@islamiccontent.com<br />
                                    <strong>Contact Form:</strong> <a href="/contact" className="text-emerald-600 hover:text-emerald-700 underline">Visit our Contact page</a>
                                </p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    By using our website, you acknowledge that you have read and understood 
                                    these Terms and Conditions and agree to be bound by them.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
