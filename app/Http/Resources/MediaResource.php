<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            // Basic file info
            'id' => $this->id,
            'name' => $this->name,
            'file_name' => $this->file_name,
            'mime_type' => $this->mime_type,
            'size' => (int) $this->size,
            'human_readable_size' => $this->humanReadableSize(),
            'extension' => strtolower(pathinfo($this->file_name, PATHINFO_EXTENSION)),
            'type' => $this->getTypeFromMime($this->mime_type),
            'is_image' => str_starts_with($this->mime_type, 'image/'),
            'is_video' => str_starts_with($this->mime_type, 'video/'),
            'is_audio' => str_starts_with($this->mime_type, 'audio/'),
            'is_document' => in_array($this->mime_type, [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'text/csv',
            ]),
            'is_archive' => in_array($this->mime_type, [
                'application/zip',
                'application/x-rar-compressed',
                'application/x-7z-compressed',
                'application/x-tar',
                'application/gzip',
            ]),
            
            // URLs
            'url' => $this->getFullUrl(),
            'temporary_url' => $this->temporary_url ?? null,
            'preview_url' => $this->preview_url ?? null,
            'thumbnail_url' => $this->getFullUrl('thumb'),
            
            // Storage info
            'disk' => $this->disk,
            'conversions_disk' => $this->conversions_disk,
            'collection_name' => $this->collection_name,
            'order_column' => $this->order_column,
            'responsive_images' => $this->when(
                $this->isResponsiveImage(),
                $this->responsive_images
            ),
            'custom_properties' => $this->custom_properties,
            'generated_conversions' => $this->generated_conversions ?? [],
            
            // Dimensions (for images)
            'width' => $this->when(
                $this->isImage(),
                $this->getCustomProperty('width')
            ),
            'height' => $this->when(
                $this->isImage(),
                $this->getCustomProperty('height')
            ),
            'aspect_ratio' => $this->when(
                $this->isImage() && $this->getCustomProperty('width') && $this->getCustomProperty('height'),
                round($this->getCustomProperty('width') / $this->getCustomProperty('height'), 2)
            ),
            
            // Video specific
            'duration' => $this->when(
                str_starts_with($this->mime_type, 'video/'),
                $this->getCustomProperty('duration')
            ),
            
            // Timestamps
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->when($this->trashed(), $this->deleted_at?->toDateTimeString()),
            
            // Permissions
            'can_view' => $request->user()?->can('view', $this->resource),
            'can_download' => $request->user()?->can('download', $this->resource),
            'can_update' => $request->user()?->can('update', $this->resource),
            'can_delete' => $request->user()?->can('delete', $this->resource),
        ];
    }
    
    /**
     * Get the human-readable file size.
     */
    protected function humanReadableSize(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
    
    /**
     * Get the media type from MIME type.
     */
    protected function getTypeFromMime(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) return 'image';
        if (str_starts_with($mimeType, 'video/')) return 'video';
        if (str_starts_with($mimeType, 'audio/')) return 'audio';
        
        return 'file';
    }
    
    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function with($request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'api_version' => 'v1',
            ],
        ];
    }
}
