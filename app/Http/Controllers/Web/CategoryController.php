<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index()
    {
        $categories = Category::whereHas('articles', function($query) {
                $query->where('is_published', true)
                      ->whereNotNull('published_at')
                      ->where('published_at', '<=', now());
            })
            ->orderBy('name')
            ->select(['id', 'name', 'slug', 'description'])
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

        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Categories/Index', [
            'categories' => $categories,
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Display the specified category.
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->select(['id', 'name', 'en_name', 'slug', 'description', 'is_active', 'order'])
            ->firstOrFail();

        // Get paginated articles using the publishedArticles relationship
        $articles = $category->publishedArticles()
            ->with(['author:id,name', 'category:id,name,slug', 'featuredImage'])
            ->latest('published_at')
            ->select(['*']) // Ensure all columns are selected including is_published
            ->paginate(12);

        // Transform the articles to include the featured_image_url
        $articles->getCollection()->transform(function ($article) {
            $article->featured_image_url = $article->featured_image_url;
            return $article;
        });

        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'en_name' => $category->en_name,
                'is_active' => $category->is_active,
                'order' => $category->order,
            ],
            'articles' => $articles->items(),
            'meta' => [
                'current_page' => $articles->currentPage(),
                'from' => $articles->firstItem(),
                'last_page' => $articles->lastPage(),
                'links' => $articles->linkCollection()->toArray(),
                'path' => $articles->path(),
                'per_page' => $articles->perPage(),
                'to' => $articles->lastItem(),
                'total' => $articles->total(),
            ],
            'links' => [
                'first' => $articles->url(1),
                'last' => $articles->url($articles->lastPage()),
                'prev' => $articles->previousPageUrl(),
                'next' => $articles->nextPageUrl(),
            ],
            'navigationCategories' => $navigationCategories,
        ]);
    }
}
