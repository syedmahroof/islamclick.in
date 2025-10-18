<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class SourceResource extends BaseResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'url' => $this->url,
            'author' => $this->when($this->author, $this->author),
            'publisher' => $this->when($this->publisher, $this->publisher),
            'description' => $this->when($this->description, $this->description),
            'published_date' => $this->formatDate($this->published_date),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'deleted_at' => $this->when($this->trashed(), $this->formatDate($this->deleted_at)),
            'articles' => ArticleResource::collection($this->whenLoaded('articles')),
        ];
    }
}
