<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * Display a listing of authors.
     */
    public function index()
    {
        $authors = Author::withCount(['articles' => function ($query) {
                $query->published();
            }])
            ->having('articles_count', '>', 0)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Authors/Index', [
            'authors' => $authors,
            'navigationCategories' => $navigationCategories,
        ]);
    }

    /**
     * Display the specified author.
     */
    public function show(string $slug)
    {
        $author = Author::where('slug', $slug)
            ->where('is_active', true)
            ->with(['profileImage'])
            ->firstOrFail();

        $articles = $author->articles()
            ->published()
            ->with(['category:id,name,slug', 'featuredImage'])
            ->select(['*']) // Ensure all columns are selected
            ->latest('published_at')
            ->paginate(10);

        // Get navigation categories
        $navigationCategories = Category::where('is_active', true)
            ->orderBy('order')
            ->take(6)
            ->get(['id', 'name', 'slug', 'order']);

        return Inertia::render('Front/Authors/Show', [
            'author' => $author,
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
