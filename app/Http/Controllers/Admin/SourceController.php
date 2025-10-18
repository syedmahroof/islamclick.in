<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\AdminController;
use App\Models\Source;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SourceController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = Source::class;

    /**
     * @var string
     */
    protected $resourceName = 'source';

    /**
     * Get the index query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = parent::getIndexQuery($request);
        
        // Search in title and author
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('author', 'like', $searchTerm)
                  ->orWhere('publisher', 'like', $searchTerm);
            });
        }
        
        // Default sorting
        if (!$request->has('sort_by')) {
            $query->latest('published_date')
                  ->latest('created_at');
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
            'url' => 'required|url|max:255',
            'author' => 'nullable|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'published_date' => 'nullable|date',
            'description' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        // Generate a slug for the source
        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['title']);
            $slug = $baseSlug;
            $count = 1;
            
            while (Source::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $baseSlug . '-' . $count++;
            }
            
            $validated['slug'] = $slug;
        }

        return $validated;
    }
    
    /**
     * Get sources for dropdown/select.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dropdown(Request $request): JsonResponse
    {
        $query = Source::query()
            ->orderBy('title');
            
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('title', 'like', $searchTerm);
        }
        
        $sources = $query->get(['id', 'title', 'author'])
            ->map(function($source) {
                return [
                    'id' => $source->id,
                    'text' => $source->title . ($source->author ? ' - ' . $source->author : '')
                ];
            });
        
        return response()->json(['data' => $sources]);
    }
}
