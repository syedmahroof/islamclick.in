<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        $authors = [
            [ 'name' => 'Imam An-Nawawi', 'email' => 'nawawi@example.com' ],
            [ 'name' => 'Ibn Taymiyyah', 'email' => 'taymiyyah@example.com' ],
            [ 'name' => 'Shaykh Ibn Baz', 'email' => 'ibnbaz@example.com' ],
            [ 'name' => 'Shaykh Al-Albani', 'email' => 'alalbani@example.com' ],
            [ 'name' => 'Umm Aisha', 'email' => 'ummaisha@example.com' ],
        ];

        foreach ($authors as $data) {
            Author::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'slug' => Str::slug($data['name']),
                    'bio' => 'Author in Islamic studies.',
                    'is_active' => true,
                ]
            );
        }

        // Additional random authors
        Author::factory()->count(5)->create();
    }
}


