<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::published()->with(['user', 'category'])->latest('published_at')->paginate(12);
        $categories = Category::where('is_active', true)->get();

        return view('frontend.posts.index', compact('posts', 'categories'));
    }

    public function show($slug)
    {
        $post = Post::published()->where('slug', $slug)->with(['user', 'category', 'subcategory'])->firstOrFail();
        
        // Increment views
        $post->increment('views');

        $relatedPosts = Post::published()
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('frontend.posts.show', compact('post', 'relatedPosts'));
    }

    public function category($slug)
    {
        $category = Category::where('slug', $slug)->where('is_active', true)->firstOrFail();
        $posts = Post::published()
            ->where('category_id', $category->id)
            ->with(['user', 'category'])
            ->latest('published_at')
            ->paginate(12);

        return view('frontend.posts.category', compact('category', 'posts'));
    }
}
