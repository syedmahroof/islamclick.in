<?php

namespace App\Http\Controllers\Admin;

use App\Models\Subcategory;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubcategoryController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = Subcategory::class;

    /**
     * @var string
     */
    protected $resourceName = 'subcategory';

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
            'name' => 'required|string|max:255|unique:subcategories,name',
            'category_id' => 'required|exists:categories,id',
            'parent_id' => 'nullable|exists:subcategories,id',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer|min:0',
            'icon' => 'nullable|string|max:50',
        ];

        if ($id) {
            $rules['name'] .= ",{$id}";
            
            // Prevent setting a subcategory as its own parent
            $rules['parent_id'] .= ",{$id},id";
        }

        $validated = $request->validate($rules);

        // Generate slug if not provided
        if (!$request->has('slug') || empty($request->slug)) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        return $validated;
    }

    /**
     * Get subcategories by category ID.
     *
     * @param  int  $categoryId
     * @return \Illuminate\Http\JsonResponse
     */
    public function byCategory($categoryId): JsonResponse
    {
        $subcategories = Subcategory::query()
            ->where('category_id', $categoryId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        return response()->json(['data' => $this->formatNested($subcategories)]);
    }

    /**
     * Format subcategories in a nested structure.
     *
     * @param  \Illuminate\Database\Eloquent\Collection  $subcategories
     * @param  int|null  $parentId
     * @return array
     */
    protected function formatNested($subcategories, $parentId = null): array
    {
        $result = [];
        
        foreach ($subcategories->where('parent_id', $parentId) as $subcategory) {
            $result[] = [
                'id' => $subcategory->id,
                'name' => $subcategory->name,
                'children' => $this->formatNested($subcategories, $subcategory->id)
            ];
        }
        
        return $result;
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
        
        // Eager load relationships
        $query->with(['category', 'parent']);
        
        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Filter by parent if provided
        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        } else if ($request->boolean('only_parents', false)) {
            $query->whereNull('parent_id');
        }
        
        return $query;
    }
}
