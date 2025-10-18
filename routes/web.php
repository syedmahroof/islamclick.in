<?php

declare(strict_types=1);

use App\Http\Controllers\Web\ArticleController;
use App\Http\Controllers\Web\CategoryController;
use App\Http\Controllers\Web\AuthorController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\StaticPageController;
use App\Http\Controllers\Web\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Frontend Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Public Routes
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{article:slug}', [ArticleController::class, 'show'])->name('articles.show');

// Category routes - support both singular and plural forms
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/category/{category:slug}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// Author routes
Route::get('/authors', [AuthorController::class, 'index'])->name('authors.index');
Route::get('/authors/{author:slug}', [AuthorController::class, 'show'])->name('authors.show');

// Static pages
Route::get('/about', [StaticPageController::class, 'about'])->name('about');
Route::get('/contact', [StaticPageController::class, 'contact'])->name('contact');
Route::get('/privacy', [StaticPageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [StaticPageController::class, 'terms'])->name('terms');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
