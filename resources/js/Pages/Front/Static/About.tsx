import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';
import WhatsAppShare from '@/components/WhatsAppShare';
import { 
    BookOpenIcon, 
    AcademicCapIcon, 
    ShieldCheckIcon, 
    HeartIcon,
    UsersIcon,
    GlobeAltIcon,
    StarIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface AboutProps {
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

export default function About({ meta, navigationCategories }: AboutProps) {
    return (
        <MainLayout categories={navigationCategories}>
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="relative bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                        <div className="text-center">
                            {/* Logo */}
                            <div className="flex justify-center mb-12">
                                <div className="p-4 bg-primary rounded-2xl shadow-lg">
                                    <BookOpenIcon className="h-16 w-16 text-primary-foreground" />
                                </div>
                            </div>
                            
                            {/* Main Heading */}
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary mb-8 leading-tight">
                                ഞങ്ങളെ കുറിച്ച്
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                                ഇസ്ലാമിക് കോണ്ടന്റിലേക്ക് സ്വാഗതം. ശരിയായ ഇസ്ലാമിക് അറിവ്, 
                                മാർഗദർശനം, ആത്മീയ സമ്പന്നത എന്നിവയുടെ വിശ്വസനീയമായ ഉറവിടം.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-primary mb-6">ഞങ്ങളുടെ ദൗത്യം</h2>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-xl text-gray-700 leading-relaxed text-center">
                                ഇസ്ലാമിന്റെ മനോഹരമായ ഉപദേശങ്ങൾ മുസ്ലിംകളും മുസ്ലിമല്ലാത്തവരും 
                                മനസ്സിലാക്കാൻ സഹായിക്കുന്ന കൃത്യവും ശരിയായതും സമഗ്രവുമായ ഇസ്ലാമിക് 
                                ഉള്ളടക്കം നൽകുക എന്നതാണ് ഞങ്ങളുടെ ദൗത്യം. ഖുർആനും ശരിയായ ഹദീസും 
                                അടിസ്ഥാനമാക്കി, ഞങ്ങളുടെ പൂർവികരുടെ ധാരണയാൽ നയിക്കപ്പെട്ട 
                                അറിവ് പങ്കിടാൻ ഞങ്ങൾ പ്രതിബദ്ധരാണ്.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-primary mb-6">ഞങ്ങൾ നൽകുന്നത്</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                ഇസ്ലാമിക് അറിവിന്റെ എല്ലാ മേഖലകളിലും സമഗ്രവും ശരിയായതുമായ ഉള്ളടക്കം
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">ഇസ്ലാമിക് ലേഖനങ്ങൾ</div>
                                <div className="text-gray-600 font-medium">ഫിഖ്, അഖീദ, സീറ, തഫ്സീർ, ഹദീസ് എന്നിവയുൾപ്പെടെ ഇസ്ലാമിക് വിശ്വാസത്തിന്റെ വിവിധ വശങ്ങൾ ഉൾക്കൊള്ളുന്ന സമഗ്ര ലേഖനങ്ങൾ.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">ശരിയായ ഉറവിടങ്ങൾ</div>
                                <div className="text-gray-600 font-medium">ഞങ്ങളുടെ എല്ലാ ഉള്ളടക്കവും ശരിയായ ഇസ്ലാമിക് ഉറവിടങ്ങളിൽ നിന്നും പണ്ഡിതന്മാരുടെ കൃതികളിൽ നിന്നും ശ്രദ്ധാപൂർവ്വം ഗവേഷണം ചെയ്ത് അവലംബിച്ചിരിക്കുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">വിദഗ്ധ രചയിതാക്കൾ</div>
                                <div className="text-gray-600 font-medium">ഞങ്ങളുടെ ഉള്ളടക്കം ഉചിതമായ യോഗ്യതകളുള്ള അറിവുള്ള പണ്ഡിതന്മാരും ഇസ്ലാമിക് ഗവേഷകരും എഴുതിയിരിക്കുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">നിരന്തരമായ അപ്ഡേറ്റുകൾ</div>
                                <div className="text-gray-600 font-medium">കൃത്യതയും പ്രസക്തിയും ഉറപ്പാക്കാൻ ഞങ്ങൾ തുടർച്ചയായി പുതിയ ഉള്ളടക്കം ചേർത്തും നിലവിലുള്ള ലേഖനങ്ങൾ അപ്ഡേറ്റ് ചെയ്തും കൊണ്ടിരിക്കുന്നു.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-primary mb-6">ഞങ്ങളുടെ മൂല്യങ്ങൾ</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                ഞങ്ങളുടെ എല്ലാ പ്രവർത്തനങ്ങളും നയിക്കുന്ന അടിസ്ഥാന തത്വങ്ങൾ
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">ശരിയായത്</div>
                                <div className="text-gray-600 font-medium">ഞങ്ങൾ ശരിയായ ഇസ്ലാമിക് ഉറവിടങ്ങളും പണ്ഡിത സമ്മതവും മുൻഗണന നൽകുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">കൃത്യത</div>
                                <div className="text-gray-600 font-medium">എല്ലാ ഉള്ളടക്കവും ശ്രദ്ധാപൂർവ്വം വസ്തുത പരിശോധിച്ച് അവലോകനം ചെയ്യുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">ലഭ്യത</div>
                                <div className="text-gray-600 font-medium">എല്ലാ പശ്ചാത്തലത്തിലുള്ള ആളുകൾക്കും ഇസ്ലാമിക് അറിവ് ലഭ്യമാക്കുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">ബഹുമാനം</div>
                                <div className="text-gray-600 font-medium">ഇസ്ലാമിക് പാരമ്പര്യത്തിനും പണ്ഡിതത്വത്തിനും ബഹുമാനത്തോടെ എല്ലാ വിഷയങ്ങളും സമീപിക്കുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">സമൂഹം</div>
                                <div className="text-gray-600 font-medium">പഠിതാക്കളുടെയും അറിവിന്റെ തേട്ടക്കാരുടെയും പിന്തുണയുള്ള സമൂഹത്തെ പ്രോത്സാഹിപ്പിക്കുന്നു.</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">ഗുണനിലവാരം</div>
                                <div className="text-gray-600 font-medium">ഉയർന്ന ഗുണനിലവാരമുള്ള ഉള്ളടക്കം നൽകാൻ ഞങ്ങൾ പ്രതിബദ്ധരാണ്.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Commitment Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-primary mb-6">ഞങ്ങളുടെ പ്രതിബദ്ധത</h2>
                        </div>
                        
                        <div className="max-w-4xl mx-auto text-center">
                            <p className="text-xl text-gray-700 leading-relaxed mb-12">
                                ബിദ്അത്തിൽ നിന്ന് (പുതുക്കം) മുക്തവും പൂർവികർ
                                രീതിശാസ്ത്രം പിന്തുടരുന്ന ഉള്ളടക്കം നൽകാൻ ഞങ്ങൾ പ്രതിബദ്ധരാണ്. 
                                നബി മുഹമ്മദ് (സല്ലല്ലാഹു അലൈഹി വസല്ലം) അവരുടെ സഹാബികൾ 
                                മനസ്സിലാക്കിയതും പ്രയോഗിച്ചതുമായ രീതിയിൽ ഇസ്ലാമിനെ ആളുകൾ 
                                മനസ്സിലാക്കാൻ സഹായിക്കുക എന്നതാണ് ഞങ്ങളുടെ ലക്ഷ്യം.
                            </p>
                            
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <div className="flex items-center justify-center mb-6">
                                    <BookOpenIcon className="w-12 h-12 text-primary" />
                                </div>
                                <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                                    "അവൻ നിങ്ങളെ ഭൂമിയിൽ അനന്തരാവകാശികളാക്കുകയും നിങ്ങളിൽ 
                                    ചിലരെ ചിലരെക്കാൾ ഉയർന്ന ബഹുമതികളിൽ ഉയർത്തുകയും ചെയ്തിരിക്കുന്നു. 
                                    അവൻ നിങ്ങൾക്ക് നൽകിയതിലൂടെ നിങ്ങളെ പരീക്ഷിക്കാൻ വേണ്ടി. 
                                    തീർച്ചയായും നിങ്ങളുടെ രക്ഷിതാവ് ശിക്ഷയിൽ വേഗതയുള്ളവനാണ്. 
                                    എന്നാൽ തീർച്ചയായും അവൻ ക്ഷമിക്കുന്നവനും കരുണാനിധിയുമാണ്."
                                </blockquote>
                                <cite className="text-gray-600 text-sm mt-4 block">- ഖുർആൻ 6:165</cite>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-primary mb-6">ഞങ്ങളുടെ നേട്ടങ്ങൾ</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                                <div className="text-gray-600 font-medium">ഇസ്ലാമിക് ലേഖനങ്ങൾ</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                                <div className="text-gray-600 font-medium">വിദഗ്ധ രചയിതാക്കൾ</div>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl">
                                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                                <div className="text-gray-600 font-medium">വായനക്കാർ</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-primary mb-6">ഞങ്ങളുമായി ബന്ധപ്പെടുക</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                                ഞങ്ങളുടെ ഉള്ളടക്കത്തെ കുറിച്ച് നിങ്ങൾക്ക് എന്തെങ്കിലും ചോദ്യങ്ങൾ 
                                ഉണ്ടെങ്കിലോ ഞങ്ങളുടെ ദൗത്യത്തിൽ സംഭാവന നൽകാൻ ആഗ്രഹിക്കുന്നുവെങ്കിലോ, 
                                ഞങ്ങളെ ബന്ധപ്പെടുക.
                            </p>
                            <a 
                                href="/contact" 
                                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition-colors shadow-lg hover:shadow-xl"
                            >
                                ഞങ്ങളെ ബന്ധപ്പെടുക
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* WhatsApp Chat Button */}
            <WhatsAppShare 
                mode="chat"
                phoneNumber="9946911916"
                defaultMessage="Welcome to IslamicClick"
            />
        </MainLayout>
    );
}
