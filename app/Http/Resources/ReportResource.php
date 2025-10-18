<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
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
            'id' => $this->id,
            'reason' => $this->reason,
            'message' => $this->message,
            'status' => $this->status, // e.g., 'pending', 'reviewed', 'resolved', 'dismissed'
            'reportable_type' => $this->reportable_type,
            'reportable_id' => $this->reportable_id,
            'reported_by' => $this->user_id,
            'reviewed_by' => $this->reviewed_by,
            'reviewed_at' => $this->reviewed_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            
            // Relationships
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'reviewer' => $this->whenLoaded('reviewer', fn() => new UserResource($this->reviewer)),
            'reportable' => $this->whenLoaded('reportable'),
            
            // Additional data
            'is_resolved' => $this->status === 'resolved',
            'is_pending' => $this->status === 'pending',
            'is_dismissed' => $this->status === 'dismissed',
            'can_review' => $request->user()?->can('review', $this->resource),
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
