import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';

interface ContactProps {
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

export default function Contact({ meta, navigationCategories }: ContactProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
                        
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Information */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                                <p className="text-gray-600 mb-8">
                                    We'd love to hear from you. Whether you have questions about our content, 
                                    suggestions for improvement, or need support, we're here to help.
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                            <p className="text-gray-600">info@islamiccontent.com</p>
                                            <p className="text-gray-600">support@islamiccontent.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
                                            <p className="text-gray-600">We typically respond within 24-48 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Location</h3>
                                            <p className="text-gray-600">Global Islamic Content Platform</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-emerald-50 rounded-lg">
                                    <h3 className="text-lg font-semibold text-emerald-800 mb-3">Before You Contact Us</h3>
                                    <ul className="text-emerald-700 space-y-2 text-sm">
                                        <li>• Check our <a href="/articles" className="underline hover:no-underline">articles</a> for answers to common questions</li>
                                        <li>• Review our <a href="/about" className="underline hover:no-underline">About page</a> for more information</li>
                                        <li>• For content suggestions, please provide specific details</li>
                                        <li>• For technical issues, please describe the problem clearly</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="content">Content Question</option>
                                            <option value="suggestion">Content Suggestion</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={6}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Please provide as much detail as possible..."
                                        ></textarea>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            id="privacy"
                                            name="privacy"
                                            required
                                            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="privacy" className="text-sm text-gray-600">
                                            I agree to the{' '}
                                            <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">
                                                Privacy Policy
                                            </a>{' '}
                                            and consent to the processing of my personal data.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200"
                                    >
                                        Send Message
                                    </button>
                                </form>

                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <strong>Note:</strong> This is a demo contact form. In a real application, 
                                        you would need to implement the backend functionality to handle form submissions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
