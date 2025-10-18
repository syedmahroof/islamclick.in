<?php

namespace Database\Factories;

use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Author>
 */
class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->name();

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'bio' => $this->faker->optional()->paragraphs(2, true),
            'email' => $this->faker->unique()->safeEmail(),
            'website' => $this->faker->optional()->url(),
            'twitter_handle' => $this->faker->optional()->userName(),
            'facebook_username' => $this->faker->optional()->userName(),
            'linkedin_profile' => $this->faker->optional()->url(),
            'is_active' => true,
        ];
    }
}


