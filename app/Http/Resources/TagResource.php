<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TagResource extends JsonResource
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
            // Basic tag info
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->when($this->description, $this->description),
            'is_active' => (bool) $this->is_active,
            'meta_title' => $this->when($this->meta_title, $this->meta_title),
            'meta_description' => $this->when($this->meta_description, $this->meta_description),
            'type' => $this->type ?? 'general', // e.g., 'topic', 'category', 'keyword'
            'order' => (int) $this->order,
            'icon' => $this->when($this->icon, $this->icon),
            'color' => $this->when($this->color, $this->color),
            'is_featured' => (bool) $this->is_featured,
            'featured_at' => $this->when($this->featured_at, $this->featured_at?->toDateTimeString()),
            
            // Counts
            'articles_count' => $this->whenCounted('articles', $this->articles_count ?? 0),
            'followers_count' => $this->whenCounted('followers', $this->followers_count ?? 0),
            
            // Timestamps
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->when($this->trashed(), $this->deleted_at?->toDateTimeString()),
            
            // URLs
            'url' => route('tags.show', $this->slug),
            'api_url' => route('api.v1.tags.show', $this->slug),
            
            // Relationships
            'articles' => ArticleResource::collection($this->whenLoaded('articles')),
            'related_tags' => $this->when(
                $request->routeIs('tags.show'),
                fn() => self::collection($this->relatedTags()->get())
            ),
            
            // SEO
            'meta' => [
                'title' => $this->meta_title ?? $this->name,
                'description' => $this->meta_description ?? $this->description,
                'keywords' => $this->meta_keywords ?? [],
            ],
        ];
    }
    
    /**
     * Get related tags based on articles in common.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function relatedTags()
    {
        return $this->where('id', '!=', $this->id)
            ->whereHas('articles', function ($query) {
                $query->whereIn('id', $this->articles()->pluck('id'));
            })
            ->withCount('articles')
            ->orderByDesc('articles_count')
            ->take(5);
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
