<?php

namespace App\Http\Resources;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\LikeResource;
use App\Http\Resources\ReportResource;

class CommentResource extends JsonResource
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
            // Basic comment info
            'id' => $this->id,
            'content' => $this->content,
            'is_approved' => (bool) $this->is_approved,
            'is_spam' => (bool) $this->is_spam,
            'is_edited' => (bool) $this->is_edited,
            'likes_count' => (int) $this->likes_count,
            'dislikes_count' => (int) $this->dislikes_count,
            'reports_count' => (int) $this->reports_count,
            'depth' => (int) $this->depth,
            'ip_address' => $this->when($request->user()?->isAdmin(), $this->ip_address),
            'user_agent' => $this->when($request->user()?->isAdmin(), $this->user_agent),
            'referrer' => $this->when($request->user()?->isAdmin(), $this->referrer),
            
            // Timestamps
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'approved_at' => $this->when($this->is_approved, $this->approved_at?->toDateTimeString()),
            'deleted_at' => $this->when($this->trashed(), $this->deleted_at?->toDateTimeString()),
            
            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'commentable_type' => $this->commentable_type,
            'commentable_id' => $this->commentable_id,
            'parent_id' => $this->parent_id,
            'replies' => self::collection($this->whenLoaded('replies')),
            'replies_count' => $this->whenCounted('replies', $this->replies_count ?? 0),
            'likes' => LikeResource::collection($this->whenLoaded('likes')),
            'reports' => $this->when($request->user()?->isAdmin(), 
                fn() => ReportResource::collection($this->whenLoaded('reports'))
            ),
            
            // Permissions
            'can_edit' => $request->user()?->can('update', $this->resource),
            'can_delete' => $request->user()?->can('delete', $this->resource),
            'can_reply' => $request->user()?->can('create', [\App\Models\Comment::class, $this->resource]),
            'can_report' => $request->user()?->can('report', $this->resource),
            'can_like' => $request->user()?->can('like', $this->resource),
            
            // User's interaction
            'has_liked' => $this->when(
                $request->user(),
                fn() => $this->likes->contains('user_id', $request->user()->id)
            ),
            'has_reported' => $this->when(
                $request->user(),
                fn() => $this->reports->contains('user_id', $request->user()->id)
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
