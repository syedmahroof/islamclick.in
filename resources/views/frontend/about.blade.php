@extends('frontend.layout')

@section('title', 'About Us')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-white">
        <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-8">About Us</h1>
        
        <div class="prose prose-lg max-w-none">
            <p class="text-lg text-gray-700 mb-6 leading-relaxed">
                Welcome to our Islamic Blog, a platform dedicated to sharing authentic Islamic knowledge, 
                wisdom, and guidance with Muslims and non-Muslims alike.
            </p>
            
            <h2 class="text-2xl font-light text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p class="text-gray-700 mb-6 leading-relaxed">
                Our mission is to provide accurate, reliable, and inspiring Islamic content that helps 
                readers deepen their understanding of Islam, strengthen their faith, and apply Islamic 
                principles in their daily lives.
            </p>

            <h2 class="text-2xl font-light text-gray-900 mt-8 mb-4">What We Offer</h2>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6 leading-relaxed">
                <li>Articles on Islamic teachings and principles</li>
                <li>Quranic reflections and Hadith explanations</li>
                <li>Islamic history and biographies</li>
                <li>Contemporary issues from an Islamic perspective</li>
                <li>Spiritual guidance and personal development</li>
            </ul>

            <h2 class="text-2xl font-light text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p class="text-gray-700 leading-relaxed">
                If you have any questions, suggestions, or would like to contribute, please don't hesitate 
                to <a href="{{ route('contact') }}" class="text-[#bd9966] hover:text-[#a88455] transition underline">contact us</a>.
            </p>
        </div>
    </div>
</div>
@endsection
