<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\LeadPriority;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

final class LeadPriorityController extends Controller
{
    /**
     * Get all lead priorities.
     */
    public function index(): JsonResponse
    {
        try {
            \Log::info('Fetching lead priorities');
            
            $priorities = LeadPriority::select(['id', 'name', 'color', 'is_default'])
                ->orderBy('id')
                ->get();

            \Log::info('Successfully retrieved ' . $priorities->count() . ' lead priorities');

            return response()->json([
                'data' => $priorities
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching lead priorities: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch lead priorities',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }
}
