<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class ArticleCategoryHelper
{
    // Category IDs
    const ISLAM = 1;
    const FAITH = 2;
    const CULTURE = 3;
    const FIQH = 4;
    const HISTORY = 5;
    const FATWA = 6;

    // Category slugs
    const SLUG_ISLAM = 'islam';
    const SLUG_FAITH = 'vishwasam';
    const SLUG_CULTURE = 'samskaram';
    const SLUG_FIQH = 'fiqh';
    const SLUG_HISTORY = 'charithram';
    const SLUG_FATWA = 'fathwa';

    /**
     * Get all categories with their details
     *
     * @return array
     */
    public static function getAllCategories()
    {
        return [
            self::ISLAM => [
                'id' => self::ISLAM,
                'name' => 'ഇസ്ലാം',
                'slug' => self::SLUG_ISLAM,
                'en_name' => 'Islam'
            ],
            self::FAITH => [
                'id' => self::FAITH,
                'name' => 'വിശ്വാസം',
                'slug' => self::SLUG_FAITH,
                'en_name' => 'Faith'
            ],
            self::CULTURE => [
                'id' => self::CULTURE,
                'name' => 'സംസ്കാരം',
                'slug' => self::SLUG_CULTURE,
                'en_name' => 'Culture'
            ],
            self::FIQH => [
                'id' => self::FIQH,
                'name' => 'ഫിഖ്ഹ്',
                'slug' => self::SLUG_FIQH,
                'en_name' => 'Fiqh'
            ],
            self::HISTORY => [
                'id' => self::HISTORY,
                'name' => 'ചരിത്രം',
                'slug' => self::SLUG_HISTORY,
                'en_name' => 'History'
            ],
            self::FATWA => [
                'id' => self::FATWA,
                'name' => 'ഫത്വ',
                'slug' => self::SLUG_FATWA,
                'en_name' => 'Fatwa'
            ]
        ];
    }

    /**
     * Get category by ID
     *
     * @param int $id
     * @return array|null
     */
    public static function getCategoryById(int $id)
    {
        $categories = self::getAllCategories();
        return $categories[$id] ?? null;
    }

    /**
     * Get category by slug
     *
     * @param string $slug
     * @return array|null
     */
    public static function getCategoryBySlug(string $slug)
    {
        foreach (self::getAllCategories() as $category) {
            if ($category['slug'] === $slug) {
                return $category;
            }
        }
        return null;
    }

    /**
     * Get all category IDs
     *
     * @return array
     */
    public static function getCategoryIds()
    {
        return array_keys(self::getAllCategories());
    }

    /**
     * Get all category slugs
     *
     * @return array
     */
    public static function getCategorySlugs()
    {
        return array_column(self::getAllCategories(), 'slug');
    }

    /**
     * Get category name by ID
     *
     * @param int $id
     * @return string
     */
    public static function getCategoryName(int $id): string
    {
        $category = self::getCategoryById($id);
        return $category['name'] ?? 'Unknown';
    }

    /**
     * Get category English name by ID
     *
     * @param int $id
     * @return string
     */
    public static function getCategoryEnglishName(int $id): string
    {
        $category = self::getCategoryById($id);
        return $category['en_name'] ?? 'Unknown';
    }

    /**
     * Get category slug by ID
     *
     * @param int $id
     * @return string
     */
    public static function getCategorySlug(int $id): string
    {
        $category = self::getCategoryById($id);
        return $category['slug'] ?? '';
    }

    /**
     * Get category ID by slug
     *
     * @param string $slug
     * @return int|null
     */
    public static function getCategoryIdBySlug(string $slug): ?int
    {
        $category = self::getCategoryBySlug($slug);
        return $category['id'] ?? null;
    }
}
