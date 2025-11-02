<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Islamic Blog') - {{ config('app.name', 'Islamic Blog') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        :root {
            --primary-color: #bd9966;
            --primary-hover: #a88455;
            --text-dark: #1f2937;
            --text-light: #6b7280;
            --bg-light: #f9fafb;
        }
        
        .mega-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            padding: 2.5rem;
            border-top: 2px solid var(--primary-color);
        }
        .mega-menu.active {
            display: block;
        }
        .mega-menu-container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .mega-menu-column {
            min-width: 200px;
        }
        .mega-menu-category {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 1rem;
            font-size: 1.05rem;
            transition: color 0.2s;
        }
        .mega-menu-category:hover {
            color: var(--primary-hover);
        }
        .mega-menu-subcategory {
            display: block;
            padding: 0.5rem 0;
            color: var(--text-light);
            text-decoration: none;
            transition: color 0.2s;
            font-size: 0.9rem;
        }
        .mega-menu-subcategory:hover {
            color: var(--primary-color);
        }
        @media (max-width: 768px) {
            .mega-menu {
                position: relative;
                display: none;
            }
        }
    </style>
</head>
<body class="bg-white">
    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <div class="flex items-center">
                    <a href="{{ route('home') }}" class="flex items-center">
                        <img src="{{ asset('logos/islamclick_logo-01.png') }}" alt="Islamic Blog" class="h-12 md:h-16 w-auto">
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="{{ route('home') }}" class="text-gray-700 hover:text-[#bd9966] transition font-medium {{ request()->routeIs('home') ? 'text-[#bd9966] border-b-2 border-[#bd9966] pb-1' : '' }}">Home</a>
                    
                    <!-- Categories Mega Menu -->
                    @php
                        try {
                            $menuCategories = \App\Models\Category::where('is_active', true)
                                ->with(['subcategories' => function($query) {
                                    $query->where('is_active', true)->limit(8);
                                }])
                                ->limit(6)
                                ->get();
                        } catch (\Exception $e) {
                            $menuCategories = collect([]);
                        }
                    @endphp
                    
                    <div class="relative group">
                        <a href="{{ route('posts.index') }}" class="text-gray-700 hover:text-[#bd9966] transition font-medium {{ request()->routeIs('posts.*') ? 'text-[#bd9966] border-b-2 border-[#bd9966] pb-1' : '' }}">
                            Categories
                            <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </a>
                        @if($menuCategories->count() > 0)
                        <div class="mega-menu group-hover:block">
                            <div class="mega-menu-container">
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                    @foreach($menuCategories as $category)
                                    <div class="mega-menu-column">
                                        <a href="{{ route('posts.category', $category->slug) }}" class="mega-menu-category">
                                            {{ $category->name }}
                                        </a>
                                        @if($category->subcategories->count() > 0)
                                            @foreach($category->subcategories as $subcategory)
                                                <a href="{{ route('posts.category', $category->slug) }}#{{ $subcategory->slug }}" class="mega-menu-subcategory">
                                                    {{ $subcategory->name }}
                                                </a>
                                            @endforeach
                                        @endif
                                        @if($category->subcategories->count() < 1)
                                            <a href="{{ route('posts.category', $category->slug) }}" class="mega-menu-subcategory text-sm">
                                                View all posts →
                                            </a>
                                        @endif
                                    </div>
                                    @endforeach
                                    <div class="mega-menu-column">
                                        <a href="{{ route('posts.index') }}" class="mega-menu-category">
                                            View All Posts
                                        </a>
                                        <a href="{{ route('posts.index') }}" class="mega-menu-subcategory">
                                            Browse All Categories
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endif
                    </div>
                    
                    <a href="{{ route('posts.index') }}" class="text-gray-700 hover:text-[#bd9966] transition font-medium {{ request()->routeIs('posts.index') ? 'text-[#bd9966] border-b-2 border-[#bd9966] pb-1' : '' }}">All Posts</a>
                    <a href="{{ route('about') }}" class="text-gray-700 hover:text-[#bd9966] transition font-medium {{ request()->routeIs('about') ? 'text-[#bd9966] border-b-2 border-[#bd9966] pb-1' : '' }}">About</a>
                    <a href="{{ route('contact') }}" class="text-gray-700 hover:text-[#bd9966] transition font-medium {{ request()->routeIs('contact') ? 'text-[#bd9966] border-b-2 border-[#bd9966] pb-1' : '' }}">Contact</a>
                    @auth
                        <a href="{{ route('dashboard') }}" class="text-gray-700 hover:text-[#bd9966] transition font-medium">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="bg-[#bd9966] text-white px-6 py-2 rounded-md font-medium hover:bg-[#a88455] transition">Login</a>
                    @endauth
                </div>
                
                <!-- Mobile Menu Button -->
                <button class="md:hidden text-gray-700" id="mobileMenuBtn">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Menu -->
    <div class="hidden md:hidden bg-white border-b border-gray-200" id="mobileMenu">
        <div class="px-4 py-3 space-y-1">
            <a href="{{ route('home') }}" class="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-[#bd9966] transition rounded">Home</a>
            <a href="{{ route('posts.index') }}" class="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-[#bd9966] transition rounded">All Posts</a>
            <a href="{{ route('about') }}" class="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-[#bd9966] transition rounded">About</a>
            <a href="{{ route('contact') }}" class="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-[#bd9966] transition rounded">Contact</a>
            @auth
                <a href="{{ route('dashboard') }}" class="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-[#bd9966] transition rounded">Dashboard</a>
            @else
                <a href="{{ route('login') }}" class="block py-2 px-4 bg-[#bd9966] text-white rounded hover:bg-[#a88455] transition">Login</a>
            @endauth
        </div>
    </div>

    <!-- Flash Messages -->
    @if(session('success'))
        <div class="bg-green-50 border-l-4 border-green-400 text-green-700 p-4" role="alert">
            <p>{{ session('success') }}</p>
        </div>
    @endif

    @if(session('error'))
        <div class="bg-red-50 border-l-4 border-red-400 text-red-700 p-4" role="alert">
            <p>{{ session('error') }}</p>
        </div>
    @endif

    <!-- Main Content -->
    <main class="bg-white">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div class="col-span-1 md:col-span-2">
                    <img src="{{ asset('logos/islamclick_logo-01.png') }}" alt="Islamic Blog" class="h-12 mb-4">
                    <p class="text-gray-600 mb-4 text-sm leading-relaxed">Sharing authentic Islamic knowledge, wisdom, and guidance with Muslims and non-Muslims alike. Our mission is to provide accurate and inspiring content.</p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-[#bd9966] transition">Facebook</a>
                        <a href="#" class="text-gray-400 hover:text-[#bd9966] transition">Twitter</a>
                        <a href="#" class="text-gray-400 hover:text-[#bd9966] transition">Instagram</a>
                    </div>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Quick Links</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li><a href="{{ route('home') }}" class="hover:text-[#bd9966] transition">Home</a></li>
                        <li><a href="{{ route('posts.index') }}" class="hover:text-[#bd9966] transition">All Posts</a></li>
                        <li><a href="{{ route('about') }}" class="hover:text-[#bd9966] transition">About Us</a></li>
                        <li><a href="{{ route('contact') }}" class="hover:text-[#bd9966] transition">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Contact</h3>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li>Email: info@islamicblog.com</li>
                        <li>Phone: +123 456 7890</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {{ date('Y') }} Islamic Blog. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn')?.addEventListener('click', function() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        });
    </script>
</body>
</html>
