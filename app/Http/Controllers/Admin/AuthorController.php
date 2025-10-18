<?php

namespace App\Http\Controllers\Admin;

use App\Models\Author;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthorController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = Author::class;

    /**
     * @var string
     */
    protected $resourceName = 'author';

    /**
     * Get the index query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = parent::getIndexQuery($request);
        
        // Eager load profile image
        $query->with('profileImage');
        
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
            'slug' => 'nullable|string|max:255|unique:authors,slug',
            'bio' => 'nullable|string',
            'email' => 'nullable|email|unique:authors,email',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|string|max:100',
            'twitter' => 'nullable|string|max:100',
            'instagram' => 'nullable|string|max:100',
            'linkedin' => 'nullable|string|max:100',
            'youtube' => 'nullable|string|max:100',
            'profile_image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
        ];

        if ($id) {
            $rules['slug'] .= ",{$id}";
            $rules['email'] .= ",{$id}";
        }

        $validated = $request->validate($rules);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        return $validated;
    }

    /**
     * Upload a profile image for the author.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
            'author_id' => 'nullable|exists:authors,id',
        ]);
        
        $file = $request->file('image');
        $path = $file->store('authors/profile-images', 'public');
        
        // Create media record
        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'file_name' => $file->hashName(),
            'mime_type' => $file->getClientMimeType(),
            'path' => $path,
            'disk' => 'public',
            'size' => $file->getSize(),
            'collection_name' => 'author_profile_images',
        ]);
        
        // Associate with author if provided
        if (!empty($validated['author_id'])) {
            $author = Author::find($validated['author_id']);
            if ($author) {
                $author->profileImage()->associate($media);
                $author->save();
            }
        }
        
        return response()->json([
            'url' => Storage::url($path),
            'id' => $media->id,
            'name' => $media->name,
        ]);
    }
    
    /**
     * Get authors for dropdown/select.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dropdown(Request $request): JsonResponse
    {
        $query = Author::query()
            ->where('is_active', true)
            ->orderBy('name');
            
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('name', 'like', $searchTerm);
        }
        
        $authors = $query->get(['id', 'name']);
        
        return response()->json(['data' => $authors]);
    }
}
