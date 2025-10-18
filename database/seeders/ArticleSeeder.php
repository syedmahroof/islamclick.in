<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure authors and categories exist
        if (Author::count() === 0) {
            $this->call(AuthorSeeder::class);
        }
        if (Category::count() === 0) {
            $this->call(CategorySeeder::class);
        }

        // Create a handful of articles
        Article::factory()->count(13)->create();
    }
}


