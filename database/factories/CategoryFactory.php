<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->unique()->word;
        
        return [
            'name' => $name,
            'en_name' => $name, // Same as name for simplicity in tests
            'slug' => \Illuminate\Support\Str::slug($name),
            'description' => $this->faker->sentence,
            'is_active' => true,
            'order' => $this->faker->numberBetween(1, 100),
            'parent_id' => null,
        ];
    }

    /**
     * Indicate that the category is inactive.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inactive()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_active' => false,
            ];
        });
    }

    /**
     * Indicate that the category has a parent.
     *
     * @param  int  $parentId
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withParent($parentId = null)
    {
        return $this->state(function (array $attributes) use ($parentId) {
            return [
                'parent_id' => $parentId ?? Category::factory(),
            ];
        });
    }
}
