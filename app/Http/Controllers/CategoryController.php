<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Helpers\ArticleCategoryHelper;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the main categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $categories = collect(ArticleCategoryHelper::getAllCategories())->map(function($category) {
            return [
                'id' => $category['id'],
                'name' => $category['name'],
                'en_name' => $category['en_name'],
                'slug' => $category['slug']
            ];
        })->values();

        return Inertia::render('Categories/Index', [
            'categories' => $categories->toArray()
        ]);
    }

    /**
     * Get subcategories for a specific category.
     *
     * @param  int  $categoryId
     * @return \Illuminate\Http\JsonResponse
     */
    public function subcategories($categoryId)
    {
        $subcategories = [];
        // This is a simplified example. In a real app, you'd fetch from your database
        if ($categoryId == 1) { // Islam
            $subcategories = [
                ['id' => 1, 'name' => 'Tawheed', 'slug' => 'tawheed'],
                ['id' => 2, 'name' => 'Sunnah', 'slug' => 'sunnah'],
            ];
        } elseif ($categoryId == 4) { // Fiqh
            $subcategories = [
                ['id' => 3, 'name' => 'Prayer', 'slug' => 'prayer'],
                ['id' => 4, 'name' => 'Fasting', 'slug' => 'fasting'],
            ];
        }

        return response()->json($subcategories);
    }

    /**
     * Store a newly created category in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'en_name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'en_name' => $request->en_name,
            'slug' => $request->slug,
            'parent_id' => $request->parent_id
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified category.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    /**
     * Update the specified category in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'en_name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:categories,slug,' . $id,
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $category->update($request->all());

        return response()->json($category);
    }

    /**
     * Remove the specified category from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        
        // Prevent deletion if category has articles or subcategories
        if ($category->articles()->count() > 0 || $category->children()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with articles or subcategories'
            ], 422);
        }
        
        $category->delete();
        
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
