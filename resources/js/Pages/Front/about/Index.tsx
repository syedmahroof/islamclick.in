import { Head } from '@inertiajs/react';
import MainLayout from '@/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout>
      <Head title="About Us">
        <meta name="description" content="Learn more about our Islamic blog and our mission to spread authentic Islamic knowledge." />
      </Head>

      <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              About Our Islamic Blog
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Spreading authentic Islamic knowledge with wisdom and beautiful preaching
            </p>
          </div>
          
          <div className="mt-12 prose prose-emerald prose-lg text-gray-500 mx-auto">
            <div className="aspect-w-16 aspect-h-9 lg:aspect-none">
              <img
                className="rounded-lg object-cover object-center w-full h-64 sm:h-80 lg:h-96"
                src="/images/mosque.jpg"
                alt="Beautiful mosque"
              />
            </div>
            
            <h2>Our Mission</h2>
            <p>
              Our mission is to provide authentic Islamic knowledge based on the Quran and Sunnah, 
              following the understanding of the righteous predecessors (Salaf as-Salih). We aim to 
              present Islam in its pure form, free from innovations and misconceptions.
            </p>
            
            <h2>Our Vision</h2>
            <p>
              We envision a world where Muslims have easy access to authentic Islamic knowledge, 
              enabling them to practice their religion correctly and confidently. We strive to be a 
              trusted source of Islamic education for Muslims around the globe.
            </p>
            
            <h2>Our Content</h2>
            <p>
              Our articles cover various aspects of Islam, including:
            </p>
            <ul>
              <li>Aqeedah (Islamic Creed)</li>
              <li>Fiqh (Islamic Jurisprudence)</li>
              <li>Seerah (Prophet's Biography)</li>
              <li>Tafseer (Quranic Exegesis)</li>
              <li>Hadith Studies</li>
              <li>Islamic History</li>
              <li>Contemporary Issues</li>
            </ul>
            
            <h2>Our Team</h2>
            <p>
              Our team consists of students of knowledge and scholars who are dedicated to 
              spreading authentic Islamic knowledge. We verify all our content with reliable 
              sources and references to ensure accuracy and authenticity.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              We welcome your feedback, questions, and suggestions. Please feel free to 
              <a href="/contact" className="text-emerald-600 hover:text-emerald-500"> contact us</a> 
              with any inquiries you may have.
            </p>
            
            <p className="mt-8 text-center text-emerald-600 font-medium">
              May Allah accept our efforts and make them a means of guidance for us and our readers. Ameen.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
