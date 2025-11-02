@extends('frontend.layout')

@section('title', $post->title)

@section('content')
<div class="bg-white py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-8 text-sm">
            <ol class="flex items-center space-x-2 text-gray-600">
                <li><a href="{{ route('home') }}" class="hover:text-[#bd9966] transition">Home</a></li>
                <li><span class="mx-2">/</span></li>
                <li><a href="{{ route('posts.index') }}" class="hover:text-[#bd9966] transition">Posts</a></li>
                <li><span class="mx-2">/</span></li>
                @if($post->category)
                <li><a href="{{ route('posts.category', $post->category->slug) }}" class="hover:text-[#bd9966] transition">{{ $post->category->name }}</a></li>
                <li><span class="mx-2">/</span></li>
                @endif
                <li class="text-gray-900 font-medium">{{ Str::limit($post->title, 40) }}</li>
            </ol>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Main Article -->
            <div class="lg:col-span-3">
                <article class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <!-- Featured Image -->
                    <div class="relative">
                        @if($post->featured_image)
                            <img src="{{ asset('storage/'.$post->featured_image) }}" alt="{{ $post->title }}" class="w-full h-96 object-cover">
                        @else
                            <div class="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                        @endif
                        <div class="absolute top-6 left-6">
                            <a href="{{ route('posts.category', $post->category->slug) }}" class="bg-[#bd9966] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#a88455] transition">
                                {{ $post->category->name ?? 'Uncategorized' }}
                            </a>
                        </div>
                    </div>
                    
                    <!-- Article Content -->
                    <div class="p-8 md:p-10">
                        <h1 class="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">{{ $post->title }}</h1>
                        
                        <!-- Meta Information -->
                        <div class="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-6 border-b border-gray-200 text-sm">
                            <div class="flex items-center">
                                <span class="font-medium">{{ $post->user->name ?? 'Admin' }}</span>
                            </div>
                            <div class="flex items-center">
                                <span>{{ $post->published_at->format('F d, Y') }}</span>
                            </div>
                            <div class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                </svg>
                                <span>{{ $post->views }} views</span>
                            </div>
                        </div>

                        <!-- Excerpt -->
                        @if($post->excerpt)
                            <div class="bg-gray-50 border-l-4 border-[#bd9966] p-4 mb-8 rounded">
                                <p class="text-lg text-gray-700 italic">{{ $post->excerpt }}</p>
                            </div>
                        @endif

                        <!-- Main Content -->
                        <div class="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
                            {!! nl2br(e($post->content)) !!}
                        </div>

                        <!-- Tags/Categories -->
                        <div class="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-200">
                            <span class="text-gray-600 font-medium text-sm">Tags:</span>
                            <a href="{{ route('posts.category', $post->category->slug) }}" class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#bd9966] hover:text-white transition">
                                {{ $post->category->name }}
                            </a>
                            @if($post->subcategory)
                            <a href="{{ route('posts.category', $post->category->slug) }}#{{ $post->subcategory->slug }}" class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#bd9966] hover:text-white transition">
                                {{ $post->subcategory->name }}
                            </a>
                            @endif
                        </div>
                    </div>
                </article>

                <!-- Related Posts -->
                @if($relatedPosts->count() > 0)
                <div class="mt-12">
                    <h3 class="text-2xl font-light text-gray-900 mb-6">Related Posts</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        @foreach($relatedPosts as $relatedPost)
                        <a href="{{ route('posts.show', $relatedPost->slug) }}" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group">
                            @if($relatedPost->featured_image)
                                <img src="{{ asset('storage/'.$relatedPost->featured_image) }}" alt="{{ $relatedPost->title }}" class="w-full h-40 object-cover">
                            @else
                                <div class="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                            @endif
                            <div class="p-4">
                                <span class="text-[#bd9966] text-xs font-medium">{{ $relatedPost->category->name ?? 'Uncategorized' }}</span>
                                <h4 class="font-medium text-gray-900 mt-2 mb-2 line-clamp-2 group-hover:text-[#bd9966] transition">{{ Str::limit($relatedPost->title, 60) }}</h4>
                                <p class="text-xs text-gray-500">{{ $relatedPost->published_at->format('M d, Y') }}</p>
                            </div>
                        </a>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div class="space-y-6">
                    <!-- Author Card -->
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">About Author</h4>
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-[#bd9966] rounded-full flex items-center justify-center text-white font-medium">
                                {{ substr($post->user->name ?? 'A', 0, 1) }}
                            </div>
                            <div class="ml-4">
                                <h5 class="font-medium text-gray-900">{{ $post->user->name ?? 'Admin' }}</h5>
                                <p class="text-xs text-gray-500">Author</p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed">Contributing writer sharing Islamic knowledge and wisdom.</p>
                    </div>

                    <!-- Popular Categories -->
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Categories</h4>
                        <ul class="space-y-2">
                            @php
                                $popularCats = \App\Models\Category::where('is_active', true)
                                    ->withCount('posts')
                                    ->orderBy('posts_count', 'desc')
                                    ->take(5)
                                    ->get();
                            @endphp
                            @foreach($popularCats as $cat)
                            <li>
                                <a href="{{ route('posts.category', $cat->slug) }}" class="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition group">
                                    <span class="text-gray-700 group-hover:text-[#bd9966] text-sm">{{ $cat->name }}</span>
                                    <span class="text-xs text-gray-400">{{ $cat->posts_count }}</span>
                                </a>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
