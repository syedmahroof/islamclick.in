<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\AuthorController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RolesController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\SourceController;
use App\Http\Controllers\Admin\SubcategoryController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| All admin routes are prefixed with /admin and are protected by auth middleware
| These routes are loaded by the RouteServiceProvider within the 'web' middleware group
|
*/

// Admin Web Routes
Route::name('admin.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        // Admin Dashboard - Accessible at /admin
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        
        // For backward compatibility
        Route::get('/dashboard', function () {
            return redirect()->route('admin.dashboard');
        });
        
        // Admin Resources
        Route::resource('categories', CategoryController::class);
        Route::resource('articles', ArticleController::class);
        Route::resource('tags', TagController::class);
        Route::resource('media', MediaController::class);
        Route::resource('authors', AuthorController::class);
        
        // Settings
        Route::get('settings', [SettingsController::class, 'index'])->name('settings');
        
        // User Management
        Route::middleware(['can:manage_users'])->group(function () {
            Route::resource('users', UserController::class)->except(['show']);
            Route::resource('roles', RolesController::class)->except(['show']);
            Route::resource('permissions', PermissionController::class)->except(['show']);
            Route::get('roles-permissions', [RolesController::class, 'index'])->name('roles-permissions.index');
        });
    });

// Admin API Routes
Route::prefix('admin/api')
    ->name('admin.api.')
    ->middleware(['auth:sanctum', 'verified'])
    ->group(function () {
        // Categories API
        Route::get('categories-dropdown', [CategoryController::class, 'dropdown']);
        Route::get('categories/{category}/subcategories', [CategoryController::class, 'subcategories']);
        
        // Articles API
        Route::post('articles/{article}/publish', [ArticleController::class, 'publish']);
        Route::post('articles/{article}/unpublish', [ArticleController::class, 'unpublish']);
        Route::post('articles/{article}/feature', [ArticleController::class, 'feature']);
        Route::post('articles/{article}/unfeature', [ArticleController::class, 'unfeature']);
        Route::post('articles/{article}/upload-image', [ArticleController::class, 'uploadImage']);
        Route::get('articles-form-data', [ArticleController::class, 'formData']);
        
        // Authors API
        Route::post('authors/{author}/upload-image', [AuthorController::class, 'uploadImage']);
        Route::get('authors-dropdown', [AuthorController::class, 'dropdown']);
        
        // Subcategories API
        Route::get('subcategories-dropdown', [SubcategoryController::class, 'dropdown']);
        Route::get('categories/{category}/subcategories-list', [SubcategoryController::class, 'byCategory']);
        
        // Sources API
        Route::apiResource('sources', SourceController::class);
        Route::get('sources-dropdown', [SourceController::class, 'dropdown']);
        
        // Tags API
        Route::get('tags-dropdown', [TagController::class, 'dropdown']);
    Route::apiResource('media', MediaController::class);
    Route::post('media/upload', [MediaController::class, 'upload']);
    Route::post('media/{media}/regenerate', [MediaController::class, 'regenerate']);
    
    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
});
