<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Models\LeadSource;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

final class LeadSourceController extends Controller
{
    /**
     * Get all lead sources.
     */
    public function index(): JsonResponse
    {
        try {
            \Log::info('Fetching lead sources');
            
            $sources = LeadSource::select(['id', 'name'])
                ->orderBy('name')
                ->get();

            \Log::info('Successfully retrieved ' . $sources->count() . ' lead sources');

            return response()->json([
                'data' => $sources
            ]);
        } catch (\Exception $e) {
            \Log::error('Error fetching lead sources: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to fetch lead sources',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }
}
