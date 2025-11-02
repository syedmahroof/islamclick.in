<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;

class HomeController extends Controller
{
    public function index()
    {
        // Featured posts - most viewed or manually featured (you can add a featured field later)
        $featuredPosts = Post::published()
            ->with(['user', 'category', 'subcategory'])
            ->orderBy('views', 'desc')
            ->latest('published_at')
            ->take(4)
            ->get();

        // Latest posts
        $latestPosts = Post::published()
            ->with(['user', 'category', 'subcategory'])
            ->latest('published_at')
            ->take(12)
            ->get();

        // Categories with subcategories for mega menu
        $categories = Category::where('is_active', true)
            ->with(['subcategories' => function($query) {
                $query->where('is_active', true);
            }])
            ->withCount('posts')
            ->get();

        // Popular categories
        $popularCategories = Category::where('is_active', true)
            ->withCount('posts')
            ->orderBy('posts_count', 'desc')
            ->take(6)
            ->get();

        return view('frontend.home', compact('featuredPosts', 'latestPosts', 'categories', 'popularCategories'));
    }
}
