<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Basic info
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->whenNotNull($this->email_verified_at?->toDateTimeString()),
            'username' => $this->username,
            'bio' => $this->bio,
            'website' => $this->website,
            'location' => $this->location,
            'twitter_handle' => $this->twitter_handle,
            'github_username' => $this->github_username,
            'avatar' => $this->avatar ? Storage::url($this->avatar) : null,
            'is_public' => (bool) $this->is_public,
            'receive_newsletter' => (bool) $this->receive_newsletter,
            'last_login_at' => $this->whenNotNull($this->last_login_at?->toDateTimeString()),
            'last_login_ip' => $this->when($request->user()?->isAdmin(), $this->last_login_ip),
            
            // Timestamps
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->whenNotNull($this->deleted_at?->toDateTimeString()),
            
            // Relationships
            'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('name')),
            'permissions' => $this->when(
                $request->user()?->can('viewPermissions', $this->resource),
                fn() => $this->getAllPermissions()->pluck('name')
            ),
            'social_links' => $this->whenLoaded('socialLinks', fn() => $this->socialLinks->keyBy('provider')),
            'preferences' => $this->whenLoaded('preferences', fn() => $this->preferences),
            
            // Counts
            'articles_count' => $this->whenCounted('articles'),
            'comments_count' => $this->whenCounted('comments'),
            'likes_count' => $this->whenCounted('likes'),
            
            // URLs
            'profile_url' => route('users.show', $this->username),
            'avatar_url' => $this->avatar ? Storage::url($this->avatar) : null,
            // Additional metadata
            'is_admin' => $this->when($request->user()?->isAdmin(), $this->isAdmin()),
            'is_verified' => (bool) $this->hasVerifiedEmail(),
            'two_factor_enabled' => $this->when(
                $request->user()?->is($this->resource),
                (bool) $this->two_factor_secret
            ),
        ];
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
