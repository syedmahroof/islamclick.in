<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class SubcategoryResource extends BaseResource
{
    /**
     * Get the resource's attributes as an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function getResourceAttributes($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'parent_id' => $this->parent_id,
            'is_active' => (bool) $this->is_active,
            'order' => (int) $this->order,
            'icon' => $this->icon,
            'articles_count' => $this->whenCounted('articles'),
            'children_count' => $this->whenCounted('children'),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'deleted_at' => $this->when($this->trashed(), $this->formatDate($this->deleted_at)),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'parent' => new self($this->whenLoaded('parent')),
            'children' => self::collection($this->whenLoaded('children')),
            'articles' => ArticleResource::collection($this->whenLoaded('articles')),
        ];
    }
}
