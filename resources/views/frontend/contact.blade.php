@extends('frontend.layout')

@section('title', 'Contact Us')

@section('content')
<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-white">
        <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-6">Contact Us</h1>
        <p class="text-gray-600 mb-8 leading-relaxed">
            Have a question or want to get in touch? Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <form action="{{ route('contact.store') }}" method="POST" class="space-y-6">
            @csrf

            <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" name="name" id="name" required value="{{ old('name') }}"
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bd9966] focus:border-transparent text-gray-900">
                @error('name')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" id="email" required value="{{ old('email') }}"
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bd9966] focus:border-transparent text-gray-900">
                @error('email')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input type="text" name="subject" id="subject" required value="{{ old('subject') }}"
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bd9966] focus:border-transparent text-gray-900">
                @error('subject')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea name="message" id="message" rows="6" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#bd9966] focus:border-transparent text-gray-900">{{ old('message') }}</textarea>
                @error('message')
                    <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <button type="submit" class="w-full bg-[#bd9966] hover:bg-[#a88455] text-white font-medium py-3 px-6 rounded-md transition">
                    Send Message
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
