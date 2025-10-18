<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    /**
     * Display the homepage.
     */
    public function index()
    {
        // Get featured articles
        $featuredArticles = Article::published()
            ->featured()
            ->with(['author:id,name', 'category:id,name,slug', 'featuredImage'])
            ->select(['*']) // Ensure all columns are selected
            ->latest('published_at')
            ->take(6)
            ->get();

        // Get recent articles
        $recentArticles = Article::published()
            ->with(['author:id,name', 'category:id,name,slug', 'featuredImage'])
            ->select(['*']) // Ensure all columns are selected
            ->latest('published_at')
            ->take(12)
            ->get();

        // Get categories with article counts
        $categories = Cache::remember('home_categories', 3600, function () {
            return Category::whereHas('articles', function($query) {
                    $query->where('is_published', true)
                          ->whereNotNull('published_at')
                          ->where('published_at', '<=', now());
                })
                ->where('is_active', true)
                ->orderBy('order')
                ->take(8)
                ->get()
                ->map(function($category) {
                    $articlesCount = $category->articles()
                        ->where('is_published', true)
                        ->whereNotNull('published_at')
                        ->where('published_at', '<=', now())
                        ->count();
                        
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'description' => $category->description,
                        'articles_count' => $articlesCount
                    ];
                });
        });

        // Get navigation categories (limit to 6 for navigation)
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/home/Index', [
            'featuredArticles' => $featuredArticles,
            'recentArticles' => $recentArticles,
            'categories' => $categories,
            'navigationCategories' => $navigationCategories,
        ]);
    }
}
