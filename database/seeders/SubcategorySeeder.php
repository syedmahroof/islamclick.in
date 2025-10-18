<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::query()->get(['id', 'name', 'slug']);

        foreach ($categories as $category) {
            $categorySlugBase = $category->slug ?: Str::slug($category->name);

            // Basics subcategory (idempotent)
            $basicsSlug = $categorySlugBase . '-basics';
            Subcategory::updateOrCreate(
                ['slug' => $basicsSlug],
                [
                    'name' => $category->name . ' Basics',
                    'description' => 'Introductory topics for ' . $category->name,
                    'category_id' => $category->id,
                    'is_active' => true,
                    'order' => 1,
                ]
            );

            // Advanced subcategory (idempotent)
            $advancedSlug = $categorySlugBase . '-advanced';
            Subcategory::updateOrCreate(
                ['slug' => $advancedSlug],
                [
                    'name' => $category->name . ' Advanced',
                    'description' => 'Advanced topics for ' . $category->name,
                    'category_id' => $category->id,
                    'is_active' => true,
                    'order' => 2,
                ]
            );
        }
    }
}


