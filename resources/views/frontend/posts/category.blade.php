@extends('frontend.layout')

@section('title', $category->name . ' - Category')

@section('content')
<div class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Category Header -->
        <div class="bg-white border-b border-gray-200 pb-8 mb-8">
            <nav class="text-sm mb-4 text-gray-500">
                <a href="{{ route('home') }}" class="hover:text-[#bd9966]">Home</a>
                <span class="mx-2">/</span>
                <a href="{{ route('posts.index') }}" class="hover:text-[#bd9966]">Posts</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">{{ $category->name }}</span>
            </nav>
            <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-4">{{ $category->name }}</h1>
            @if($category->description)
                <p class="text-gray-600 text-lg">{{ $category->description }}</p>
            @endif
        </div>

        <!-- Posts Grid -->
        @if($posts->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @foreach($posts as $post)
            <article class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <div class="relative">
                    @if($post->featured_image)
                        <img src="{{ asset('storage/'.$post->featured_image) }}" alt="{{ $post->title }}" class="w-full h-56 object-cover">
                    @else
                        <div class="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    @endif
                    <div class="absolute top-3 left-3">
                        <span class="bg-[#bd9966] text-white px-3 py-1 rounded text-xs font-medium">{{ $post->category->name ?? 'Uncategorized' }}</span>
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                        <a href="{{ route('posts.show', $post->slug) }}" class="hover:text-[#bd9966] transition">{{ $post->title }}</a>
                    </h3>
                    @if($post->excerpt)
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ Str::limit($post->excerpt, 120) }}</p>
                    @endif
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div class="flex items-center">
                            <span>{{ $post->published_at->format('M d, Y') }}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <a href="{{ route('posts.show', $post->slug) }}" class="text-[#bd9966] hover:text-[#a88455] font-medium text-sm flex items-center">
                            Read More
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                        <span class="text-gray-400 text-xs flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                            </svg>
                            {{ $post->views }} views
                        </span>
                    </div>
                </div>
            </article>
            @endforeach
        </div>

        <!-- Pagination -->
        @if($posts->hasPages())
        <div class="mt-8">
            {{ $posts->links() }}
        </div>
        @endif
        @else
        <div class="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p class="text-gray-500 mb-2">No posts available in this category yet.</p>
            <p class="text-gray-400 text-sm mb-6">Check back soon for new content!</p>
            <a href="{{ route('posts.index') }}" class="inline-block bg-[#bd9966] text-white px-6 py-3 rounded-md font-medium hover:bg-[#a88455] transition">
                Browse All Posts
            </a>
        </div>
        @endif
    </div>
</div>
@endsection
