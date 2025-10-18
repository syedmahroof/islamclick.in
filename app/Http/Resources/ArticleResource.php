<?php

namespace App\Http\Resources;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            // Basic article information
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('articles.show'), $this->content),
            'featured_image' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'status' => $this->status,
            'is_published' => (bool) $this->is_published,
            'is_featured' => (bool) $this->is_featured,
            'published_at' => $this->published_at?->toDateTimeString(),
            'views' => (int) $this->views,
            'reading_time' => $this->reading_time,
            
            // SEO metadata
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->when($this->meta_keywords, $this->meta_keywords),
            'og_title' => $this->when($this->og_title, $this->og_title),
            'og_description' => $this->when($this->og_description, $this->og_description),
            'og_image' => $this->when($this->og_image, $this->og_image),
            'twitter_title' => $this->when($this->twitter_title, $this->twitter_title),
            'twitter_description' => $this->when($this->twitter_description, $this->twitter_description),
            'twitter_image' => $this->when($this->twitter_image, $this->twitter_image),
            
            // Timestamps
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->when($this->trashed(), $this->deleted_at?->toDateTimeString()),
            
            // URLs
            'url' => route('articles.show', $this->slug),
            
            // Relationships
            'category_id' => $this->category_id,
            'subcategory_id' => $this->subcategory_id,
            'author_id' => $this->author_id,
            
            // Loaded relationships
            'category' => new CategoryResource($this->whenLoaded('category')),
            'subcategory' => $this->whenLoaded('subcategory', fn() => new CategoryResource($this->subcategory)),
            'author' => new UserResource($this->whenLoaded('author')),
            'tags' => $this->whenLoaded('tags', fn() => TagResource::collection($this->tags)),
            'comments_count' => $this->whenCounted('comments', $this->comments_count ?? 0),
            
            // Related content
            'related_articles' => $this->when(
                $request->routeIs('articles.show'),
                fn() => self::collection($this->relatedArticles()->take(3)->get())
            ),
        ];
    }
    
    /**
     * Get related articles based on category and tags.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function relatedArticles()
    {
        return Article::query()
            ->where('id', '!=', $this->id)
            ->where('is_published', true)
            ->where('published_at', '<=', now())
            ->where(function ($query) {
                $query->where('category_id', $this->category_id);
                
                if ($this->relationLoaded('tags') && $this->tags->isNotEmpty()) {
                    $query->orWhereHas('tags', function ($q) {
                        $q->whereIn('id', $this->tags->pluck('id'));
                    });
                }
            })
            ->with('author')
            ->latest('published_at');
    }
    
    /**
     * Get any additional data that should be returned with the resource array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
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
