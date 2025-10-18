<?php

namespace App\Http\Controllers\Admin;

use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MediaController extends AdminController
{
    /**
     * @var string
     */
    protected $modelClass = Media::class;

    /**
     * @var string
     */
    protected $resourceName = 'media';

    /**
     * Get the index query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function getIndexQuery(Request $request)
    {
        $query = parent::getIndexQuery($request);
        
        // Filter by collection
        if ($request->has('collection')) {
            $query->where('collection_name', $request->collection);
        }
        
        // Filter by type (image, video, document, etc.)
        if ($request->has('type')) {
            $query->where('mime_type', 'like', $request->type . '/%');
        }
        
        // Search in name and file name
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('file_name', 'like', $searchTerm);
            });
        }
        
        // Default sorting
        if (!$request->has('sort_by')) {
            $query->latest();
        }
        
        return $query;
    }

    /**
     * Upload a file.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|max:' . (1024 * 20), // 20MB max
            'collection' => 'nullable|string|max:255',
            'disk' => ['nullable', 'string', Rule::in(['public', 's3', 'local'])],
        ]);
        
        $file = $request->file('file');
        $disk = $validated['disk'] ?? 'public';
        $collection = $validated['collection'] ?? 'default';
        
        // Generate a unique file name
        $fileName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Store the file
        $path = $file->storeAs(
            'media/' . now()->format('Y/m/d'),
            $fileName,
            $disk
        );
        
        // Create media record
        $media = Media::create([
            'name' => $file->getClientOriginalName(),
            'file_name' => $fileName,
            'mime_type' => $file->getClientMimeType(),
            'path' => $path,
            'disk' => $disk,
            'size' => $file->getSize(),
            'collection_name' => $collection,
        ]);
        
        return response()->json([
            'data' => new \App\Http\Resources\MediaResource($media),
            'message' => 'File uploaded successfully',
        ], 201);
    }
    
    /**
     * Regenerate conversions for a media item.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function regenerate($id): JsonResponse
    {
        $media = Media::findOrFail($id);
        
        // Here you would typically regenerate conversions
        // This is a placeholder for the actual conversion logic
        
        return response()->json([
            'data' => new \App\Http\Resources\MediaResource($media->fresh()),
            'message' => 'Conversions regenerated successfully',
        ]);
    }
    
    /**
     * Download a media file.
     *
     * @param  int  $id
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download($id): StreamedResponse
    {
        $media = Media::findOrFail($id);
        
        return Storage::disk($media->disk)->download(
            $media->path,
            $media->file_name,
            [
                'Content-Type' => $media->mime_type,
                'Content-Length' => $media->size,
            ]
        );
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
        return $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'caption' => 'nullable|string',
            'collection_name' => 'sometimes|required|string|max:255',
            'custom_properties' => 'nullable|array',
            'order_column' => 'sometimes|integer',
        ]);
    }
}
