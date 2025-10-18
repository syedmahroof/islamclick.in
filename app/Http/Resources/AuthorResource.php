<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class AuthorResource extends BaseResource
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
            'email' => $this->when($request->user()?->isAdmin(), $this->email),
            'bio' => $this->when($this->bio, $this->bio),
            'website' => $this->when($this->website, $this->website),
            'facebook' => $this->when($this->facebook, $this->facebook),
            'twitter' => $this->when($this->twitter, $this->twitter),
            'instagram' => $this->when($this->instagram, $this->instagram),
            'linkedin' => $this->when($this->linkedin, $this->linkedin),
            'youtube' => $this->when($this->youtube, $this->youtube),
            'is_active' => (bool) $this->is_active,
            'articles_count' => $this->whenCounted('articles'),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'deleted_at' => $this->when($this->trashed(), $this->formatDate($this->deleted_at)),
            'profile_image' => $this->when($this->relationLoaded('profileImage'), function () {
                return $this->profileImage ? new MediaResource($this->profileImage) : null;
            }),
            'articles' => ArticleResource::collection($this->whenLoaded('articles')),
        ];
    }
}
