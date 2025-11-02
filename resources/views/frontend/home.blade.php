@extends('frontend.layout')

@section('title', 'Home')

@section('content')
<!-- Hero Section - Minimal -->
<div class="bg-white border-b border-gray-100 py-16 md:py-24">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">Welcome to Islamic Blog</h1>
        <p class="text-lg md:text-xl text-gray-600 mb-10 font-light">Sharing Islamic knowledge, wisdom, and guidance</p>
        <div class="flex justify-center space-x-4">
            <a href="{{ route('posts.index') }}" class="bg-[#bd9966] text-white px-8 py-3 rounded-md font-medium hover:bg-[#a88455] transition">Explore Posts</a>
            <a href="{{ route('about') }}" class="bg-white border-2 border-[#bd9966] text-[#bd9966] px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition">Learn More</a>
        </div>
    </div>
</div>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <!-- Featured Posts Section -->
    @if($featuredPosts->count() > 0)
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10">
            <div>
                <h2 class="text-3xl font-light text-gray-900 mb-2">Featured Posts</h2>
                <p class="text-gray-500 text-sm">Most popular and important articles</p>
            </div>
            <a href="{{ route('posts.index') }}" class="text-[#bd9966] hover:text-[#a88455] font-medium hidden md:block text-sm">View All →</a>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            @foreach($featuredPosts->take(2) as $post)
            <article class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div class="relative">
                    @if($post->featured_image)
                        <img src="{{ asset('storage/'.$post->featured_image) }}" alt="{{ $post->title }}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500">
                    @else
                        <div class="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    @endif
                    <div class="absolute top-4 left-4">
                        <span class="bg-[#bd9966] text-white px-3 py-1 rounded text-xs font-medium">{{ $post->category->name ?? 'Uncategorized' }}</span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-medium text-gray-900 mb-3 leading-tight">
                        <a href="{{ route('posts.show', $post->slug) }}" class="hover:text-[#bd9966] transition">{{ $post->title }}</a>
                    </h3>
                    @if($post->excerpt)
                        <p class="text-gray-600 text-sm mb-4 leading-relaxed">{{ Str::limit($post->excerpt, 120) }}</p>
                    @endif
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <div class="flex items-center space-x-3">
                            <span>{{ $post->user->name ?? 'Admin' }}</span>
                            <span>•</span>
                            <span>{{ $post->published_at->format('M d, Y') }}</span>
                        </div>
                        <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                            </svg>
                            {{ $post->views }}
                        </span>
                    </div>
                </div>
            </article>
            @endforeach
        </div>

        @if($featuredPosts->count() > 2)
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @foreach($featuredPosts->skip(2)->take(2) as $post)
            <article class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                @if($post->featured_image)
                    <img src="{{ asset('storage/'.$post->featured_image) }}" alt="{{ $post->title }}" class="w-full h-48 object-cover">
                @else
                    <div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                @endif
                <div class="p-5">
                    <span class="text-[#bd9966] text-xs font-medium mb-2 inline-block">{{ $post->category->name ?? 'Uncategorized' }}</span>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                        <a href="{{ route('posts.show', $post->slug) }}" class="hover:text-[#bd9966] transition">{{ Str::limit($post->title, 60) }}</a>
                    </h3>
                    <div class="flex items-center text-xs text-gray-500">
                        <span>{{ $post->published_at->format('M d, Y') }}</span>
                    </div>
                </div>
            </article>
            @endforeach
        </div>
        @endif
    </section>
    @endif

    <!-- Latest Posts Section -->
    <section class="mb-20">
        <div class="flex items-center justify-between mb-10">
            <div>
                <h2 class="text-3xl font-light text-gray-900 mb-2">Latest Posts</h2>
                <p class="text-gray-500 text-sm">Most recent articles and updates</p>
            </div>
            <a href="{{ route('posts.index') }}" class="text-[#bd9966] hover:text-[#a88455] font-medium hidden md:block text-sm">View All →</a>
        </div>

        @if($latestPosts->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($latestPosts as $post)
            <article class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <div class="relative">
                    @if($post->featured_image)
                        <img src="{{ asset('storage/'.$post->featured_image) }}" alt="{{ $post->title }}" class="w-full h-48 object-cover">
                    @else
                        <div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    @endif
                    <div class="absolute top-3 left-3">
                        <span class="bg-[#bd9966] text-white px-2 py-1 rounded text-xs font-medium">{{ $post->category->name ?? 'Uncategorized' }}</span>
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-lg font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                        <a href="{{ route('posts.show', $post->slug) }}" class="hover:text-[#bd9966] transition">{{ $post->title }}</a>
                    </h3>
                    @if($post->excerpt)
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ Str::limit($post->excerpt, 100) }}</p>
                    @endif
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>{{ $post->published_at->format('M d, Y') }}</span>
                        <a href="{{ route('posts.show', $post->slug) }}" class="text-[#bd9966] hover:text-[#a88455] font-medium">Read More →</a>
                    </div>
                </div>
            </article>
            @endforeach
        </div>
        @else
        <div class="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p class="text-gray-500">No posts available yet. Check back soon!</p>
        </div>
        @endif

        <div class="text-center mt-10">
            <a href="{{ route('posts.index') }}" class="inline-block bg-[#bd9966] text-white px-8 py-3 rounded-md font-medium hover:bg-[#a88455] transition">View All Posts</a>
        </div>
    </section>

    <!-- Popular Categories Section -->
    @if($popularCategories->count() > 0)
    <section class="mb-16">
        <div class="text-center mb-10">
            <h2 class="text-3xl font-light text-gray-900 mb-2">Browse by Category</h2>
            <p class="text-gray-500 text-sm">Explore posts by topics</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            @foreach($popularCategories as $category)
            <a href="{{ route('posts.category', $category->slug) }}" class="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-[#bd9966] hover:shadow-md transition-all group">
                <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                <h3 class="font-medium text-gray-900 mb-1 group-hover:text-[#bd9966] transition">{{ $category->name }}</h3>
                <p class="text-xs text-gray-500">{{ $category->posts_count ?? 0 }} posts</p>
            </a>
            @endforeach
        </div>
    </section>
    @endif

    <!-- Newsletter Section - Minimal -->
    <section class="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12 text-center mb-16">
        <h2 class="text-2xl font-light text-gray-900 mb-2">Stay Updated</h2>
        <p class="text-gray-600 mb-6 text-sm">Subscribe to our newsletter and never miss an update</p>
        <form class="max-w-md mx-auto flex gap-2">
            <input type="email" placeholder="Enter your email" class="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#bd9966] focus:border-transparent">
            <button type="submit" class="bg-[#bd9966] text-white px-6 py-3 rounded-md font-medium hover:bg-[#a88455] transition">Subscribe</button>
        </form>
    </section>
</div>
@endsection
