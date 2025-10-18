<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\AdminController;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Inertia\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class CategoryController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = Category::class;

    /**
     * @var string
     */
    protected $resourceName = 'category';

    /**
     * The number of models to return for pagination.
     *
     * @var int
     */
    protected $perPage = 15;

    /**
     * Get the index query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = parent::getIndexQuery($request);
        
        // Only show top-level categories by default
        $query->whereNull('parent_id');
        
        // Eager load children with ordering
        $query->with(['children' => function($q) {
            $q->orderBy('order');
        }]);
        
        // Apply search if search parameter is provided
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('en_name', 'like', $searchTerm);
            });
        }
        
        return $query;
    }
    
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
        
        // Format categories with children for the view
        $formattedItems = $items->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'is_active' => (bool)$category->is_active,
                'order' => $category->order,
                'parent_id' => $category->parent_id,
                'created_at' => $category->created_at->toDateTimeString(),
                'updated_at' => $category->updated_at->toDateTimeString(),
                'children' => $category->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => $child->name,
                        'slug' => $child->slug,
                        'description' => $child->description,
                        'is_active' => (bool)$child->is_active,
                        'order' => $child->order,
                        'parent_id' => $child->parent_id,
                        'created_at' => $child->created_at->toDateTimeString(),
                        'updated_at' => $child->updated_at->toDateTimeString(),
                    ];
                })->toArray()
            ];
        });
        
        return inertia('Admin/Categories/Index', [
            'categories' => $formattedItems
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        // Get all categories that can be parents (only top-level categories)
        $categories = Category::whereNull('parent_id')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);
            
        return Inertia::render('Admin/Categories/Create', [
            'categories' => $categories->map(function($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'parent_id' => $cat->parent_id
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'en_name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        // Generate slug from name if not provided
        if (empty($validated['en_name'])) {
            $validated['en_name'] = Str::slug($validated['name']);
        }
        
        // Generate slug from name if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['en_name'] ?? $validated['name']);
        }

        $category = Category::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Category created successfully',
                'data' => $category
            ], 201);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Category  $category
     * @return \Inertia\Response
     */
    public function edit(Category $category)
    {
        // Get all categories that can be parents (exclude self and its children)
        $categories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->whereNotIn('id', $category->getDescendantIds())
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);
            
        // Format the category data
        $categoryData = [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'description' => $category->description,
            'is_active' => (bool)$category->is_active,
            'order' => $category->order,
            'parent_id' => $category->parent_id,
            'created_at' => $category->created_at->toDateTimeString(),
            'updated_at' => $category->updated_at->toDateTimeString(),
        ];
        
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $categoryData,
            'categories' => $categories->map(function($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'parent_id' => $cat->parent_id
                ];
            })
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'en_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'nullable|integer',
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value == $category->id) {
                        $fail('A category cannot be its own parent.');
                    }
                    
                    if ($value && $category->children()->count() > 0) {
                        $fail('Cannot change parent of a category that has children.');
                    }
                },
            ]
        ]);

        // Generate slug from name if not provided
        if (empty($validated['en_name'])) {
            $validated['en_name'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function destroy($id): JsonResponse
    {
        // Prevent deletion if category has children
        if ($category->children()->count() > 0) {
            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Cannot delete category with subcategories',
                    'errors' => [
                        'children' => ['Cannot delete a category that has subcategories. Please delete or move the subcategories first.']
                    ]
                ], 422);
            }
            
            return back()->withErrors([
                'children' => 'Cannot delete a category that has subcategories. Please delete or move the subcategories first.'
            ]);
        }
        
        // Prevent deletion if category is in use by articles
        if ($category->articles()->count() > 0) {
            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Cannot delete category with articles',
                    'errors' => [
                        'articles' => ['Cannot delete a category that has articles. Please reassign or delete the articles first.']
                    ]
                ], 422);
            }
            
            return back()->withErrors([
                'articles' => 'Cannot delete a category that has articles. Please reassign or delete the articles first.'
            ]);
        }

        $category->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Category deleted successfully'
            ]);
        }

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully');
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
            'name' => 'required|string|max:255|unique:categories,name',
            'en_name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer|min:0',
            'icon' => 'nullable|string|max:50',
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($id) {
                    // Convert empty string to null
                    if ($value === '') {
                        $value = null;
                    }
                    
                    if ($id && $value == $id) {
                        $fail('A category cannot be a parent of itself.');
                    }
                    
                    if ($id && $value) {
                        $category = Category::findOrFail($id);
                        $descendantIds = $category->getDescendantIds();
                        
                        if (in_array((int)$value, $descendantIds)) {
                            $fail('Cannot set a child category as parent (circular reference).');
                        }
                        
                        // Prevent changing parent if category has children
                        if ($category->children()->count() > 0 && $value != $category->parent_id) {
                            $fail('Cannot change parent: This category has child categories.');
                        }
                    }
                    
                    // Ensure we return the properly typed value
                    return $value === null ? null : (int)$value;
                },
            ],
        ];

        // Update unique rules if editing
        if ($id) {
            $rules['name'] .= ",{$id}";
            $rules['slug'] .= ",{$id}";
        }

        // Validate the request
        $validated = $request->validate($rules);

        // Generate slug if not provided
        if ((!$request->has('slug') || empty($validated['slug'])) && isset($validated['en_name'])) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['en_name']);
        }
        
        // Ensure parent_id is null if empty
        if (empty($validated['parent_id'])) {
            $validated['parent_id'] = null;
        }

        return $validated;
    }

    /**
     * Get all active categories for dropdown/select with hierarchical structure.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dropdown(Request $request)
    {
        // Get all active categories with their children
        $categories = Category::query()
            ->with(['children' => function($query) {
                $query->where('is_active', true)
                      ->orderBy('name')
                      ->select(['id', 'name', 'parent_id']);
            }])
            ->where('is_active', true)
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        // Format the categories for the dropdown
        $formattedCategories = $categories->map(function ($category) {
            $result = [
                'id' => $category->id,
                'name' => $category->name,
                'parent_id' => $category->parent_id,
            ];

            // Add children if they exist
            if ($category->children->isNotEmpty()) {
                $result['children'] = $category->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'name' => '— ' . $child->name, // Add a dash for visual hierarchy
                        'parent_id' => $child->parent_id,
                    ];
                })->toArray();
            }

            return $result;
        });

        return response()->json([
            'data' => $formattedCategories,
            'flat' => $categories->flatMap(function ($category) {
                $items = [[
                    'id' => $category->id,
                    'name' => $category->name,
                    'parent_id' => $category->parent_id,
                ]];

                // Add children to flat list
                foreach ($category->children as $child) {
                    $items[] = [
                        'id' => $child->id,
                        'name' => $child->name,
                        'parent_id' => $child->parent_id,
                    ];
                }

                return $items;
            })->values()
        ]);
    }
}
