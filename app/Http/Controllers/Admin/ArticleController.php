<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\AdminController;
use App\Models\Article;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Author;
use App\Models\Source;
use App\Models\Media;
use App\Models\Reference;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ArticleController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = Article::class;

    /**
     * @var string
     */
    protected $resourceName = 'article';

    /**
     * The number of models to return for pagination.
     *
     * @var int
     */
    protected $perPage = 10;

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = $this->getIndexQuery($request);
        $items = $query->paginate($request->input('per_page', $this->perPage));
        
        if ($request->wantsJson()) {
            return response()->json([
                'data' => $items->items(),
                'meta' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ]
            ]);
        }
        
        // Return Inertia response for web requests
        return inertia('Admin/Articles/Index', [
            'articles' => [
                'data' => $items->items(),
                'meta' => [
                    'current_page' => $items->currentPage(),
                    'last_page' => $items->lastPage(),
                    'per_page' => $items->perPage(),
                    'total' => $items->total(),
                ]
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $subcategories = Subcategory::orderBy('name')
            ->get(['id', 'name', 'category_id']);

        $authors = Author::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return inertia('Admin/Articles/Create', [
            'formData' => [
                'categories' => $categories,
                'subcategories' => $subcategories,
                'authors' => $authors,
            ],
        ]);
    }

    /**
     * Get the index query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = parent::getIndexQuery($request);
        
        // Select all necessary fields
        $query->select([
            'id', 'title', 'slug', 'seo_title', 'seo_description', 'body', 'category_id',
            'subcategory_id', 'author_id', 'featured_image_id', 'is_published', 'published_at',
            'views', 'created_at', 'updated_at', 'deleted_at'
        ]);
        
        // Eager load relationships
        $query->with([
            'category:id,name,slug',
            'subcategory:id,name,slug',
            'author:id,name',
            'featuredImage:id,path,disk'
        ]);
        
        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Filter by subcategory if provided
        if ($request->has('subcategory_id')) {
            $query->where('subcategory_id', $request->subcategory_id);
        }
        
        // Filter by author if provided
        if ($request->has('author_id')) {
            $query->where('author_id', $request->author_id);
        }
        
        // Filter by publication status
        if ($request->has('is_published')) {
            $query->where('is_published', filter_var($request->is_published, FILTER_VALIDATE_BOOLEAN));
        }
        
        // Search in title and body
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('body', 'like', $searchTerm);
            });
        }
        
        // Default sorting
        if (!$request->has('sort_by')) {
            $query->orderBy('published_at', 'desc')
                  ->orderBy('created_at', 'desc');
        }
        
        return $query;
    }

    /**
     * Validate the request data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int|null  $id
     * @return array
     */
    protected function validateRequest(Request $request, $id = null): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:articles,slug',
            'seo_title' => 'nullable|string|max:70',
            'seo_description' => 'nullable|string|max:160',
            'body' => 'nullable|string',
            'content' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => [
                'nullable',
                Rule::exists('subcategories', 'id')->where('category_id', $request->category_id)
            ],
            'author_id' => 'required|exists:authors,id',
            'featured_image_id' => 'nullable|exists:media,id',
            'featured_image' => 'nullable|image|max:10240', // 10MB max
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
            'source_ids' => 'nullable|array',
            'source_ids.*' => 'exists:sources,id',
            'source_contexts' => 'nullable|array',
            'source_contexts.*' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'references' => 'nullable|array',
            'references.*.title' => 'required_with:references|string|max:255',
            'references.*.link' => 'required_with:references|url|max:500',
            'references.*.description' => 'nullable|string|max:1000',
        ];

        if ($id) {
            $rules['slug'] = 'nullable|string|max:255|unique:articles,slug,' . $id;
        } else {
            $rules['slug'] = 'nullable|string|max:255|unique:articles,slug';
        }

        $validated = $request->validate($rules);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // Support frontends that send `content` instead of `body`
        if (empty($validated['body']) && !empty($validated['content'])) {
            $validated['body'] = $validated['content'];
        }

        // Ensure body is present
        if (empty($validated['body'])) {
            validator($validated, [ 'body' => 'required|string' ])->validate();
        }

        // Set published_at if not provided and article is being published
        if ($validated['is_published'] ?? false && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        return $validated;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $this->validateRequest($request);
            
            // Handle featured image upload if provided
            $featuredImageId = null;
            if ($request->hasFile('featured_image')) {
                $file = $request->file('featured_image');
                $path = $file->store('articles/featured', 'public');
                
                $media = Media::create([
                    'name' => $file->getClientOriginalName(),
                    'file_name' => $file->hashName(),
                    'mime_type' => $file->getClientMimeType(),
                    'path' => $path,
                    'disk' => 'public',
                    'size' => $file->getSize(),
                    'collection_name' => 'featured_images',
                ]);
                
                $featuredImageId = $media->id;
            }

            // Create the article
            $articleData = collect($validated)
                ->except(['source_ids', 'source_contexts', 'tags', 'references', 'featured_image'])
                ->toArray();
            
            if ($featuredImageId) {
                $articleData['featured_image_id'] = $featuredImageId;
            }
            
            $article = Article::create($articleData);
            
            // Sync sources if provided
            if (isset($validated['source_ids']) && is_array($validated['source_ids'])) {
                $sources = [];
                foreach ($validated['source_ids'] as $index => $sourceId) {
                    $context = $validated['source_contexts'][$index] ?? null;
                    $sources[$sourceId] = ['context' => $context];
                }
                $article->sources()->sync($sources);
            }
            
            // Sync tags if provided
            if (isset($validated['tags']) && is_array($validated['tags'])) {
                $article->syncTags($validated['tags']);
            }

            // Create references if provided
            if (isset($validated['references']) && is_array($validated['references'])) {
                foreach ($validated['references'] as $index => $referenceData) {
                    $article->references()->create([
                        'title' => $referenceData['title'],
                        'link' => $referenceData['link'],
                        'description' => $referenceData['description'] ?? null,
                        'order' => $index,
                    ]);
                }
            }

            // Load relationships for the response
            $article->load(['category', 'subcategory', 'author', 'featuredImage', 'references']);

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Article created successfully.',
                    'data' => $article
                ], HttpResponse::HTTP_CREATED);
            }

            return redirect()->route('admin.articles.index')
                ->with('success', 'Article created successfully.');
        });
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse|\Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $article = Article::findOrFail($id);
            
            // Debug: Log the request data
            \Log::info('=== UPDATE REQUEST DEBUG ===');
            \Log::info('Request method: ' . $request->method());
            \Log::info('Content type: ' . $request->header('Content-Type'));
            \Log::info('Has featured_image file: ' . ($request->hasFile('featured_image') ? 'true' : 'false'));
            \Log::info('All request data: ' . json_encode($request->all()));
            \Log::info('Title: ' . $request->input('title'));
            \Log::info('Category ID: ' . $request->input('category_id'));
            \Log::info('Author ID: ' . $request->input('author_id'));
            \Log::info('=============================');
            
            $validated = $this->validateRequest($request, $id);
            
            // Handle featured image upload if provided
            if ($request->hasFile('featured_image')) {
                // Delete old featured image if exists
                if ($article->featuredImage) {
                    $article->featuredImage->delete();
                }
                
                $file = $request->file('featured_image');
                $path = $file->store('articles/featured', 'public');
                
                $media = Media::create([
                    'name' => $file->getClientOriginalName(),
                    'file_name' => $file->hashName(),
                    'mime_type' => $file->getClientMimeType(),
                    'path' => $path,
                    'disk' => 'public',
                    'size' => $file->getSize(),
                    'collection_name' => 'featured_images',
                ]);
                
                $validated['featured_image_id'] = $media->id;
            }
            
            // Update the article
            $article->update(collect($validated)
                ->except(['source_ids', 'source_contexts', 'tags', 'references', 'featured_image', 'remove_featured_image'])
                ->toArray()
            );
            
            // Sync sources if provided
            if (array_key_exists('source_ids', $validated)) {
                $sources = [];
                if (is_array($validated['source_ids'])) {
                    foreach ($validated['source_ids'] as $index => $sourceId) {
                        $context = $validated['source_contexts'][$index] ?? null;
                        $sources[$sourceId] = ['context' => $context];
                    }
                }
                $article->sources()->sync($sources);
            }
            
            // Sync tags if provided
            if (array_key_exists('tags', $validated)) {
                $article->syncTags($validated['tags'] ?? []);
            }

            // Update references if provided
            if (array_key_exists('references', $validated)) {
                // Delete existing references
                $article->references()->delete();
                
                // Create new references
                if (is_array($validated['references'])) {
                    foreach ($validated['references'] as $index => $referenceData) {
                        $article->references()->create([
                            'title' => $referenceData['title'],
                            'link' => $referenceData['link'],
                            'description' => $referenceData['description'] ?? null,
                            'order' => $index,
                        ]);
                    }
                }
            }
            
            // Load relationships for response
            $article->load(['category', 'subcategory', 'author', 'featuredImage', 'sources', 'references']);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Article updated successfully.',
                    'data' => $article
                ]);
            }
            
            return redirect()->route('admin.articles.index')
                ->with('success', 'Article updated successfully.');
        });
    }
    
    /**
     * Upload an image for the article.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|max:10240', // 10MB max
            'article_id' => 'nullable|exists:articles,id',
        ]);
        
        $file = $request->file('image');
        $path = $file->store('articles/images', 'public');
        
        // Create media record
        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'file_name' => $file->hashName(),
            'mime_type' => $file->getClientMimeType(),
            'path' => $path,
            'disk' => 'public',
            'size' => $file->getSize(),
            'collection_name' => 'article_images',
        ]);
        
        // Associate with article if provided
        if (!empty($validated['article_id'])) {
            $article = Article::find($validated['article_id']);
            if ($article) {
                $article->images()->save($media);
            }
        }
        
        return response()->json([
            'url' => $media->url,
            'id' => $media->id,
            'name' => $media->name,
        ]);
    }
    
    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $article = Article::with(['category', 'subcategory', 'author', 'featuredImage', 'sources', 'tags', 'references'])
            ->findOrFail($id);
            
        return response()->json(['data' => $article]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        $article = Article::with(['category', 'subcategory', 'author', 'featuredImage', 'sources', 'tags', 'references'])
            ->findOrFail($id);
            
        $formData = $this->formData();
        
        // Get subcategories for the article's category
        if ($article->category_id) {
            $formData['subcategories'] = Subcategory::where('category_id', $article->category_id)
                ->orderBy('name')
                ->get(['id', 'name', 'category_id']);
        }
        
        return inertia('Admin/Articles/Edit', [
            'article' => $article,
            'formData' => $formData
        ]);
    }
    
    /**
     * Get data for the article form.
     */
    public function formData(): array
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);
            
        $authors = Author::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);
            
        $sources = Source::orderBy('title')
            ->get(['id', 'title', 'author']);
            
        return [
            'categories' => $categories,
            'authors' => $authors,
            'sources' => $sources,
            'subcategories' => collect() // Initialize empty subcategories collection
        ];
    }
}
