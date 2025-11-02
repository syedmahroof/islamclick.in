<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin - {{ config('app.name', 'Islamic Blog') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        :root {
            --primary-color: #bd9966;
            --primary-hover: #a88455;
            --sidebar-width: 280px;
            --sidebar-collapsed-width: 80px;
        }
        
        .sidebar {
            transition: all 0.3s ease;
        }
        
        .sidebar.collapsed {
            width: var(--sidebar-collapsed-width);
        }
        
        .sidebar.collapsed .sidebar-text,
        .sidebar.collapsed .sidebar-logo-text {
            display: none;
        }
        
        .sidebar.collapsed .menu-item {
            justify-content: center;
        }
        
        .main-content {
            transition: margin-left 0.3s ease;
        }
        
        .sidebar.collapsed ~ .main-content {
            margin-left: var(--sidebar-collapsed-width);
        }
        
        .sidebar.collapsed ~ nav {
            left: var(--sidebar-collapsed-width);
        }
        
        .menu-item-icon {
            flex-shrink: 0;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <aside id="sidebar" class="sidebar fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm" style="width: var(--sidebar-width);">
            <div class="h-full flex flex-col">
                <!-- Logo Section -->
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div class="flex items-center">
                        <img src="{{ asset('logos/islamclick_logo-01.png') }}" alt="Logo" class="h-10 w-auto sidebar-logo">
                        <span class="ml-3 text-lg font-semibold text-gray-900 sidebar-logo-text">Admin</span>
                    </div>
                    <button id="toggleSidebar" class="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-[#bd9966] transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
                
                <!-- Navigation Menu -->
                <nav class="flex-1 overflow-y-auto px-4 py-6">
                    <ul class="space-y-1">
                        <li>
                            <a href="{{ route('admin.dashboard') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.dashboard') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.categories.index') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.categories.*') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Categories</span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.subcategories.index') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.subcategories.*') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Subcategories</span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.posts.index') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.posts.*') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Posts</span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.users.index') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.users.*') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Users</span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.leads.index') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.leads.*') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Leads</span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.logs.index') }}" class="menu-item flex items-center p-3 rounded-lg transition {{ request()->routeIs('admin.logs.*') ? 'bg-[#bd9966] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-[#bd9966]' }}">
                                <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.707a1 1 0 00-1.414 1.414L10.586 10l-1.293 1.293a1 1 0 101.414 1.414L12 11.414l1.293 1.293a1 1 0 001.414-1.414L13.414 10l1.293-1.293a1 1 0 00-1.414-1.414L12 8.586l-1.293-1.293z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="ml-3 sidebar-text font-medium">Activity Logs</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <!-- Bottom Section -->
                <div class="p-4 border-t border-gray-200 space-y-2">
                    <a href="{{ route('home') }}" class="menu-item flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#bd9966] transition">
                        <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        <span class="ml-3 sidebar-text font-medium">View Site</span>
                    </a>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="menu-item flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#bd9966] transition">
                            <svg class="w-5 h-5 menu-item-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="ml-3 sidebar-text font-medium">Logout</span>
                        </button>
                    </form>
                    <div class="px-3 py-2 text-xs text-gray-500 sidebar-text">
                        <p class="font-medium">{{ Auth::user()->name }}</p>
                        <p class="text-xs">{{ Auth::user()->email }}</p>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Top Bar -->
        <nav class="fixed top-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm transition-all duration-300" style="left: var(--sidebar-width);">
            <div class="px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <!-- Left side - Page Title or Breadcrumb -->
                    <div class="flex items-center">
                        <h2 class="text-xl font-semibold text-gray-800">
                            @yield('page-title', 'Dashboard')
                        </h2>
                    </div>

                    <!-- Right side - User menu and actions -->
                    <div class="flex items-center space-x-4">
                        <!-- View Site Link -->
                        <a href="{{ route('home') }}" class="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#bd9966] hover:bg-gray-50 rounded-lg transition-colors" title="View Site">
                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                            </svg>
                            <span class="hidden lg:inline">View Site</span>
                        </a>

                        <!-- User Dropdown -->
                        <div class="relative" x-data="{ open: false }">
                            <button @click="open = !open" class="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#bd9966] focus:ring-offset-2">
                                <div class="flex items-center space-x-2">
                                    <div class="hidden sm:block text-right">
                                        <p class="text-sm font-semibold text-gray-900">{{ auth()->user()->name }}</p>
                                        <p class="text-xs text-gray-500 capitalize">{{ auth()->user()->role }}</p>
                                    </div>
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold" style="background: var(--primary-color);">
                                        {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                                    </div>
                                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </button>

                            <!-- Dropdown Menu -->
                            <div x-show="open" @click.away="open = false" x-transition:enter="transition ease-out duration-100" x-transition:enter-start="transform opacity-0 scale-95" x-transition:enter-end="transform opacity-100 scale-100" x-transition:leave="transition ease-in duration-75" x-transition:leave-start="transform opacity-100 scale-100" x-transition:leave-end="transform opacity-0 scale-95" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5" style="display: none;">
                                <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    Profile
                                </a>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                        </svg>
                                        Logout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <div class="main-content flex-1" style="margin-left: var(--sidebar-width);">
            <!-- Content Area -->
            <main class="p-6" style="margin-top: 64px;">
                @if(session('success'))
                    <div class="mb-6 bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
                        <span class="block sm:inline">{{ session('success') }}</span>
                    </div>
                @endif

                @if(session('error'))
                    <div class="mb-6 bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                        <span class="block sm:inline">{{ session('error') }}</span>
                    </div>
                @endif

                @yield('content')
            </main>
        </div>
    </div>

    <script>
        // Sidebar toggle functionality
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggleSidebar');
        const mainContent = document.querySelector('.main-content');
        
        // Check localStorage for saved state
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const collapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
        });
        
        // Mobile menu handling
        if (window.innerWidth < 768) {
            sidebar.classList.add('collapsed');
        }
    </script>
</body>
</html>
