<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ArticleController extends Controller
{
    /**
     * Display the specified article.
     */
    public function show(string $slug)
    {
        $article = Article::with([
                'author:id,name,profile_image_id',
                'author.profileImage',
                'category:id,name,slug',
                'subcategory:id,name,slug',
                'tags:id,name,slug',
                'featuredImage',
                'references'
            ])
            ->published()
            ->select(['*']) // Ensure all columns are selected including is_published
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $article->increment('views');

        // Get related articles (articles from the same category, excluding current article)
        $relatedArticles = Article::published()
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->with(['author:id,name,profile_image_id', 'author.profileImage', 'category:id,name,slug', 'featuredImage'])
            ->select(['*']) // Ensure all columns are selected including is_published
            ->latest('published_at')
            ->take(3)
            ->get();

        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Articles/Show', [
            'article' => array_merge($article->toArray(), [
                'featured_image_url' => $article->featured_image_url,
                'published_date' => $article->published_at->format('F j, Y'),
                'read_time' => $article->read_time ?? ceil(str_word_count(strip_tags($article->body)) / 200) . ' min read',
                'comments' => [], // Add empty comments array since comments table doesn't exist
                'author' => [
                    'id' => $article->author->id,
                    'name' => $article->author->name,
                    'profile_photo_url' => $article->author->profile_photo_url
                ],
            ]),
            'relatedArticles' => $relatedArticles->map(function($related) {
                return [
                    'id' => $related->id,
                    'title' => $related->title,
                    'slug' => $related->slug,
                    'excerpt' => $related->excerpt,
                    'featured_image_url' => $related->featured_image_url,
                    'published_at' => $related->published_at->format('M d, Y'),
                    'read_time' => $related->read_time,
                    'author' => [
                        'id' => $related->author->id,
                        'name' => $related->author->name,
                        'profile_photo_url' => $related->author->profile_photo_url
                    ],
                    'category' => $related->category->only(['id', 'name', 'slug']),
                ];
            }),
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Display a listing of articles.
     */
    public function index(Request $request)
    {
        $query = Article::published()
            ->with(['author', 'category', 'featuredImage'])
            ->select(['*']) // Ensure all columns are selected
            ->latest('published_at');

        // Search functionality
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($category = $request->input('category')) {
            $query->whereHas('category', function($q) use ($category) {
                $q->where('slug', $category);
            });
        }

        // Filter by tag
        if ($tag = $request->input('tag')) {
            $query->whereHas('tags', function($q) use ($tag) {
                $q->where('slug', $tag);
            });
        }

        $articles = $query->paginate(12)
            ->appends($request->query());

        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'category', 'tag']),
            'categories' => fn() => Cache::remember('categories', 3600, function () {
                return Category::whereHas('articles', function($query) {
                        $query->where('is_published', true)
                              ->whereNotNull('published_at')
                              ->where('published_at', '<=', now());
                    })
                    ->orderBy('name')
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
            }),
            'popularTags' => fn() => Cache::remember('popular_tags', 3600, function () {
                return Tag::withCount('articles')
                    ->orderBy('articles_count', 'desc')
                    ->limit(10)
                    ->get();
            }),
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        $article = $request->user()->articles()->create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'content' => $validated['content'],
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
        ]);

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        $this->authorize('update', $article);

        return Inertia::render('Articles/Edit', [
            'article' => $article->only(['id', 'title', 'content', 'status']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        $article->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'content' => $validated['content'],
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' && !$article->published_at 
                ? now() 
                : $article->published_at,
        ]);

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);
        
        $article->delete();

        return redirect()
            ->route('articles.index')
            ->with('success', 'Article deleted successfully!');
    }
}
