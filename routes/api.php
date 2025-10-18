<?php

declare(strict_types=1);

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\LeadFollowUpController;
use App\Http\Controllers\Api\LeadNoteController;
use App\Http\Controllers\Api\LeadPriorityController;
use App\Http\Controllers\Api\LeadSourceController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\DocumentController;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/documents/upload', [DocumentController::class, 'upload']);

// Lead Management Routes
Route::middleware('web')->group(function () {
    
    
    // Task routes
    Route::prefix('tasks')->group(function () {
        Route::post('/', [\App\Http\Controllers\Api\TaskController::class, 'store']);
        Route::put('/{task}/complete', [\App\Http\Controllers\Api\TaskController::class, 'complete']);
    });
});


