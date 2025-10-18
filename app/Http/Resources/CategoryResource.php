<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'en_name' => $this->en_name,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'order' => $this->order,
            'icon' => $this->icon,
            'parent_id' => $this->parent_id,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'articles_count' => $this->whenCounted('articles'),
            'url' => $this->url,
            'description' => $this->description,
            'is_active' => (bool) $this->is_active,
            'order' => (int) $this->order,
            'icon' => $this->icon,
            'subcategories_count' => $this->whenCounted('subcategories'),
            'articles_count' => $this->whenCounted('articles'),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'deleted_at' => $this->when($this->trashed(), $this->formatDate($this->deleted_at)),
            'subcategories' => SubcategoryResource::collection($this->whenLoaded('subcategories')),
            // Relationships
            'parent' => new self($this->whenLoaded('parent')),
            'children' => self::collection($this->whenLoaded('children')),
            'articles' => ArticleResource::collection($this->whenLoaded('articles')),
            
            // Conditional includes
            'latest_article' => $this->when(
                $this->relationLoaded('articles') && $this->articles->isNotEmpty(),
                function () {
                    return new ArticleResource($this->articles->sortByDesc('published_at')->first());
                }
            ),
        ];
    }
    
    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function with($request)
    {
        return [
            'meta' => [
                'version' => '1.0',
                'api_version' => 'v1',
            ],
        ];
    }
}
