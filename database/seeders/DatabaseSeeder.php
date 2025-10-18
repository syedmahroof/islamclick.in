<?php

declare(strict_types=1);

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Core system seeders
            RoleAndPermissionSeeder::class,
            CategorySeeder::class,
            SubcategorySeeder::class,
            AuthorSeeder::class,
            ArticleSeeder::class,
            // Malayalam Islamic content
            MalayalamIslamicArticleSeeder::class,
        ]);
    }
}
