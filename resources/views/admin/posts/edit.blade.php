@extends('admin.layout')

@section('content')
<div class="space-y-6">
    <h2 class="text-2xl font-light text-gray-900 mb-6">Edit Post</h1>

    <div class="bg-white border border-gray-200 rounded-lg p-6">
        <form action="{{ route('admin.posts.update', $post) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="mb-4">
                <label for="category_id" class="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                <select name="category_id" id="category_id" required
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    @foreach($categories as $category)
                        <option value="{{ $category->id }}" {{ old('category_id', $post->category_id) == $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="mb-4">
                <label for="subcategory_id" class="block text-gray-700 text-sm font-bold mb-2">Subcategory</label>
                <select name="subcategory_id" id="subcategory_id"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="">Select Subcategory</option>
                    @foreach($subcategories as $subcategory)
                        <option value="{{ $subcategory->id }}" {{ old('subcategory_id', $post->subcategory_id) == $subcategory->id ? 'selected' : '' }}>{{ $subcategory->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="mb-4">
                <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Title *</label>
                <input type="text" name="title" id="title" value="{{ old('title', $post->title) }}" required
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-4">
                <label for="excerpt" class="block text-gray-700 text-sm font-bold mb-2">Excerpt</label>
                <textarea name="excerpt" id="excerpt" rows="3"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('excerpt', $post->excerpt) }}</textarea>
            </div>

            <div class="mb-4">
                <label for="content" class="block text-gray-700 text-sm font-bold mb-2">Content *</label>
                <textarea name="content" id="content" rows="15" required
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('content', $post->content) }}</textarea>
            </div>

            <div class="mb-4">
                <label for="featured_image" class="block text-gray-700 text-sm font-bold mb-2">Featured Image</label>
                @if($post->featured_image)
                    <img src="{{ asset('storage/'.$post->featured_image) }}" alt="{{ $post->title }}" class="h-32 w-32 rounded object-cover mb-2">
                @endif
                <input type="file" name="featured_image" id="featured_image" accept="image/*"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            </div>

            <div class="mb-4">
                <label class="flex items-center">
                    <input type="checkbox" name="is_published" value="1" {{ old('is_published', $post->is_published) ? 'checked' : '' }} class="form-checkbox">
                    <span class="ml-2 text-gray-700">Publish</span>
                </label>
            </div>

            <div class="flex items-center justify-between">
                <a href="{{ route('admin.posts.index') }}" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</a>
                <button type="submit" class="bg-[#bd9966] hover:bg-[#a88455] text-white font-bold py-2 px-4 rounded">Update Post</button>
            </div>
        </form>
    </div>
</div>
@endsection

