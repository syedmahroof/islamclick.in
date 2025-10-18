<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = \App\Models\Tag::class;

    /**
     * @var string
     */
    protected $resourceName = 'tag';

    /**
     * Get the index query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = parent::getIndexQuery($request);
        
        // Search in name
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('name', 'like', $searchTerm);
        }
        
        // Filter by active status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
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
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tags,slug',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ];

        if ($id) {
            $rules['slug'] .= ",{$id}";
        }

        $validated = $request->validate($rules);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        return $validated;
    }
    
    /**
     * Get tags for dropdown/select.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dropdown(Request $request): JsonResponse
    {
        $query = $this->modelClass::query()
            ->where('is_active', true)
            ->orderBy('name');
            
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('name', 'like', $searchTerm);
        }
        
        $tags = $query->get(['id', 'name']);
        
        return response()->json(['data' => $tags]);
    }
}
