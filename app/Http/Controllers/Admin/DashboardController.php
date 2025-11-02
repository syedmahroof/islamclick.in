<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\User;
use App\Models\ActivityLog;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'posts' => Post::count(),
            'published_posts' => Post::where('is_published', true)->count(),
            'categories' => Category::count(),
            'subcategories' => Subcategory::count(),
            'users' => User::count(),
            'recent_posts' => Post::latest()->take(5)->get(),
            'recent_logs' => ActivityLog::with('user')->latest()->take(10)->get(),
        ];

        return view('admin.dashboard', compact('stats'));
    }
}
