<?php

namespace Database\Seeders;

use App\Helpers\ArticleCategoryHelper;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to avoid constraint issues
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        try {
            // Truncate the categories table
            Category::truncate();
            
            // Get all categories from the helper
            $categories = ArticleCategoryHelper::getAllCategories();
            
            // First pass: Create all categories without parent relationships
            $categoryMap = [];
            foreach ($categories as $categoryData) {
                $category = Category::create([
                    'id' => $categoryData['id'],
                    'name' => $categoryData['name'],
                    'slug' => $categoryData['slug'] ?? Str::slug($categoryData['en_name'] ?? $categoryData['name']),
                    'en_name' => $categoryData['en_name'] ?? $categoryData['name'],
                    'description' => $categoryData['description'] ?? null,
                    'is_active' => $categoryData['is_active'] ?? true,
                    'order' => $categoryData['order'] ?? $categoryData['id'] ?? 0,
                    'parent_id' => null, // Will be updated in second pass
                    'icon' => $categoryData['icon'] ?? null,
                ]);
                
                $categoryMap[$category->id] = $category;
            }
            
            // Second pass: Update parent-child relationships
            foreach ($categories as $categoryData) {
                if (!empty($categoryData['parent_id']) && isset($categoryMap[$categoryData['id']], $categoryMap[$categoryData['parent_id']])) {
                    $category = $categoryMap[$categoryData['id']];
                    $category->parent_id = $categoryData['parent_id'];
                    $category->save();
                }
            }
            
            $this->command->info(sprintf('Successfully seeded %d categories', count($categories)));
            
        } catch (\Exception $e) {
            $this->command->error('Error seeding categories: ' . $e->getMessage());
            throw $e;
        } finally {
            // Always re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
