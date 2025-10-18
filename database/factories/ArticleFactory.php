<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(6, true);
        $isPublished = $this->faker->boolean(80);

        $categoryId = Category::inRandomOrder()->value('id') ?? Category::factory();
        $subcategoryId = Subcategory::where('category_id', $categoryId)->inRandomOrder()->value('id');

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1000, 9999),
            'body' => $this->faker->paragraphs(6, true),
            'seo_title' => $this->faker->optional()->sentence(6, true),
            'seo_description' => $this->faker->optional()->text(150),
            'category_id' => $categoryId,
            'subcategory_id' => $subcategoryId,
            'author_id' => Author::inRandomOrder()->value('id') ?? Author::factory(),
            'is_published' => $isPublished,
            'published_at' => $isPublished ? $this->faker->dateTimeBetween('-1 year', 'now') : null,
            'views' => $this->faker->numberBetween(0, 5000),
        ];
    }
}


