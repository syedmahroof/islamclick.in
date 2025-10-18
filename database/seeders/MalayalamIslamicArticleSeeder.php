<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MalayalamIslamicArticleSeeder extends Seeder
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
        if (Subcategory::count() === 0) {
            $this->call(SubcategorySeeder::class);
        }

        $this->createMalayalamAuthors();
        $this->createIslamicArticles();
    }

    private function createMalayalamAuthors(): void
    {
        $malayalamAuthors = [
            ['name' => 'ഡോ. ഖാലിദ് അബൂ ബക്ര്', 'email' => 'khalid@islamic.com', 'slug' => 'dr-khalid-abu-bakr'],
            ['name' => 'ശൈഖ് അബ്ദുല്ല ഇബ്നു ഹമീദ്', 'email' => 'abdullah@islamic.com', 'slug' => 'sheikh-abdullah-ibn-hameed'],
            ['name' => 'ഡോ. മുഹമ്മദ് ഇബ്രാഹിം', 'email' => 'ibrahim@islamic.com', 'slug' => 'dr-muhammad-ibrahim'],
            ['name' => 'ശൈഖ് അഹമ്മദ് ഖാലിദ്', 'email' => 'ahmad@islamic.com', 'slug' => 'sheikh-ahmad-khalid'],
            ['name' => 'ഡോ. യൂസുഫ് അൽ-ഖരദാവി', 'email' => 'qaradawi@islamic.com', 'slug' => 'dr-yusuf-al-qaradawi'],
            ['name' => 'ശൈഖ് ഇബ്നു തൈമിയ്യ', 'email' => 'taymiyyah@islamic.com', 'slug' => 'sheikh-ibn-taymiyyah'],
            ['name' => 'ഡോ. സലാഹുദ്ദീൻ അൽ-അയ്യൂബി', 'email' => 'salahuddin@islamic.com', 'slug' => 'dr-salahuddin-al-ayyubi'],
            ['name' => 'ശൈഖ് അൽ-ബുഖാരി', 'email' => 'bukhari@islamic.com', 'slug' => 'sheikh-al-bukhari'],
            ['name' => 'ഡോ. ഉമർ സുലൈമാൻ', 'email' => 'umar@islamic.com', 'slug' => 'dr-umar-sulaiman'],
            ['name' => 'ശൈഖ് അൽ-ഗസാലി', 'email' => 'ghazali@islamic.com', 'slug' => 'sheikh-al-ghazali'],
        ];

        foreach ($malayalamAuthors as $authorData) {
            Author::updateOrCreate(
                ['email' => $authorData['email']],
                [
                    'name' => $authorData['name'],
                    'slug' => $authorData['slug'],
                    'bio' => 'മലയാള ഇസ്ലാമിക പണ്ഡിതൻ',
                    'is_active' => true,
                ]
            );
        }
    }

    private function createIslamicArticles(): void
    {
        $categories = Category::all();
        $authors = Author::all();
        $subcategories = Subcategory::all();

        foreach ($categories as $category) {
            $this->createArticlesForCategory($category, $authors, $subcategories);
        }
    }

    private function createArticlesForCategory($category, $authors, $subcategories): void
    {
        $categoryArticles = $this->getCategoryArticles($category->id);
        $categorySubcategories = $subcategories->where('category_id', $category->id);

        foreach ($categoryArticles as $index => $articleData) {
            $subcategory = $categorySubcategories->random();
            $author = $authors->random();
            $isPublished = rand(1, 10) <= 8; // 80% published

            Article::create([
                'title' => $articleData['title'],
                'slug' => Str::slug($articleData['title']) . '-' . rand(1000, 9999),
                'body' => $articleData['body'],
                'excerpt' => $articleData['excerpt'],
                'seo_title' => $articleData['title'],
                'seo_description' => $articleData['excerpt'],
                'category_id' => $category->id,
                'subcategory_id' => $subcategory->id,
                'author_id' => $author->id,
                'is_published' => $isPublished,
                'published_at' => $isPublished ? now()->subDays(rand(1, 365)) : null,
                'views' => rand(10, 5000),
            ]);
        }
    }

    private function getCategoryArticles($categoryId): array
    {
        $articles = [
            1 => $this->getIslamArticles(),      // ഇസ്ലാം
            2 => $this->getFaithArticles(),      // വിശ്വാസം
            3 => $this->getCultureArticles(),    // സംസ്കാരം
            4 => $this->getFiqhArticles(),       // ഫിഖ്ഹ്
            5 => $this->getHistoryArticles(),    // ചരിത്രം
            6 => $this->getFatwaArticles(),      // ഫത്വ
        ];

        return $articles[$categoryId] ?? [];
    }

    private function getIslamArticles(): array
    {
        $articles = [];
        $titles = [
            'ഇസ്ലാമിന്റെ അടിസ്ഥാന തത്വങ്ങൾ', 'തൗഹീദിന്റെ പ്രാധാന്യം', 'നബി മുഹമ്മദിന്റെ ജീവിതം', 'ഖുർആനിന്റെ അത്ഭുതങ്ങൾ', 'ഹദീസിന്റെ പ്രാധാന്യം',
            'ഇസ്ലാമിക ആചാരങ്ങൾ', 'ഇസ്ലാമിക ധാർമ്മികത', 'ഇസ്ലാമിക സമൂഹം', 'ഇസ്ലാമിക വിദ്യാഭ്യാസം', 'ഇസ്ലാമിക കുടുംബം',
            'ഇസ്ലാമിക ജീവിത രീതി', 'ഇസ്ലാമിക നീതി', 'ഇസ്ലാമിക സമാധാനം', 'ഇസ്ലാമിക സഹിഷ്ണുത', 'ഇസ്ലാമിക സ്നേഹം',
            'ഇസ്ലാമിക സത്യം', 'ഇസ്ലാമിക ധർമ്മം', 'ഇസ്ലാമിക കർമ്മം', 'ഇസ്ലാമിക ഭക്തി', 'ഇസ്ലാമിക പ്രാർത്ഥന',
            'ഇസ്ലാമിക ഉപവാസം', 'ഇസ്ലാമിക ഹജ്ജ്', 'ഇസ്ലാമിക സകാത്ത്', 'ഇസ്ലാമിക ശുഹൂർ', 'ഇസ്ലാമിക റമദാൻ',
            'ഇസ്ലാമിക ഈദ്', 'ഇസ്ലാമിക ബക്രീദ്', 'ഇസ്ലാമിക മുഹറം', 'ഇസ്ലാമിക ശബ് ബറത്ത്', 'ഇസ്ലാമിക ലൈലത്തുൽ ഖദർ',
            'ഇസ്ലാമിക ജിഹാദ്', 'ഇസ്ലാമിക ശരീഅത്ത്', 'ഇസ്ലാമിക ഫിഖ്ഹ്', 'ഇസ്ലാമിക ഉസൂല്', 'ഇസ്ലാമിക ഹദീസ്',
            'ഇസ്ലാമിക സീറത്ത്', 'ഇസ്ലാമിക തഫ്സീർ', 'ഇസ്ലാമിക അക്വീദ', 'ഇസ്ലാമിക തസവ്വുഫ്', 'ഇസ്ലാമിക ഫലസഫ',
            'ഇസ്ലാമിക ശാസ്ത്രം', 'ഇസ്ലാമിക ഗണിതം', 'ഇസ്ലാമിക ജ്യോതിഷം', 'ഇസ്ലാമിക വൈദ്യം', 'ഇസ്ലാമിക രസതന്ത്രം',
            'ഇസ്ലാമിക ഭൗതികശാസ്ത്രം', 'ഇസ്ലാമിക ജീവശാസ്ത്രം', 'ഇസ്ലാമിക ഭൂമിശാസ്ത്രം', 'ഇസ്ലാമിക ചരിത്രം', 'ഇസ്ലാമിക സാഹിത്യം',
            'ഇസ്ലാമിക കല', 'ഇസ്ലാമിക സംഗീതം', 'ഇസ്ലാമിക വാസ്തുവിദ്യ', 'ഇസ്ലാമിക ചിത്രകല', 'ഇസ്ലാമിക ശില്പകല',
            'ഇസ്ലാമിക ഭാഷ', 'ഇസ്ലാമിക ഭാഷാശാസ്ത്രം', 'ഇസ്ലാമിക വ്യാകരണം', 'ഇസ്ലാമിക കവിത', 'ഇസ്ലാമിക ഗദ്യം',
            'ഇസ്ലാമിക നാടകം', 'ഇസ്ലാമിക കഥ', 'ഇസ്ലാമിക നോവൽ', 'ഇസ്ലാമിക ഉപന്യാസം', 'ഇസ്ലാമിക ആത്മകഥ',
            'ഇസ്ലാമിക യാത്രാവിവരണം', 'ഇസ്ലാമിക ചരിത്രഗ്രന്ഥം', 'ഇസ്ലാമിക ജീവചരിത്രം', 'ഇസ്ലാമിക ആത്മചരിത്രം', 'ഇസ്ലാമിക യാത്രാചരിത്രം',
            'ഇസ്ലാമിക ഭൂമിശാസ്ത്രഗ്രന്ഥം', 'ഇസ്ലാമിക ശാസ്ത്രഗ്രന്ഥം', 'ഇസ്ലാമിക ഗണിതഗ്രന്ഥം', 'ഇസ്ലാമിക ജ്യോതിഷഗ്രന്ഥം', 'ഇസ്ലാമിക വൈദ്യഗ്രന്ഥം',
            'ഇസ്ലാമിക രസതന്ത്രഗ്രന്ഥം', 'ഇസ്ലാമിക ഭൗതികഗ്രന്ഥം', 'ഇസ്ലാമിക ജീവശാസ്ത്രഗ്രന്ഥം', 'ഇസ്ലാമിക ചരിത്രഗ്രന്ഥം', 'ഇസ്ലാമിക സാഹിത്യഗ്രന്ഥം',
            'ഇസ്ലാമിക കലാഗ്രന്ഥം', 'ഇസ്ലാമിക സംഗീതഗ്രന്ഥം', 'ഇസ്ലാമിക വാസ്തുഗ്രന്ഥം', 'ഇസ്ലാമിക ചിത്രകലാഗ്രന്ഥം', 'ഇസ്ലാമിക ശില്പകലാഗ്രന്ഥം',
            'ഇസ്ലാമിക ഭാഷാഗ്രന്ഥം', 'ഇസ്ലാമിക ഭാഷാശാസ്ത്രഗ്രന്ഥം', 'ഇസ്ലാമിക വ്യാകരണഗ്രന്ഥം', 'ഇസ്ലാമിക കവിതാഗ്രന്ഥം', 'ഇസ്ലാമിക ഗദ്യഗ്രന്ഥം',
            'ഇസ്ലാമിക നാടകഗ്രന്ഥം', 'ഇസ്ലാമിക കഥാഗ്രന്ഥം', 'ഇസ്ലാമിക നോവൽഗ്രന്ഥം', 'ഇസ്ലാമിക ഉപന്യാസഗ്രന്ഥം', 'ഇസ്ലാമിക ആത്മകഥാഗ്രന്ഥം'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $title = $titles[array_rand($titles)] . ' - ഭാഗം ' . $i;
            $articles[] = [
                'title' => $title,
                'excerpt' => $title . ' എന്ന വിഷയത്തെക്കുറിച്ചുള്ള വിശദമായ വിശകലനം',
                'body' => $this->generateIslamicContent($title)
            ];
        }

        return $articles;
    }

    private function getFaithArticles(): array
    {
        $articles = [];
        $titles = [
            'അല്ലാഹുവിൽ വിശ്വാസം', 'ദൈവദൂതന്മാരിൽ വിശ്വാസം', 'പരലോകത്തിൽ വിശ്വാസം', 'ഖദറിൽ വിശ്വാസം', 'അന്ത്യദിനത്തിൽ വിശ്വാസം',
            'ഇമാനിന്റെ അടിസ്ഥാനം', 'ഇസ്ലാമിക വിശ്വാസം', 'ദൈവീക വിശ്വാസം', 'പ്രവാചക വിശ്വാസം', 'ഖുർആൻ വിശ്വാസം',
            'ഹദീസ് വിശ്വാസം', 'അംഗീലിക വിശ്വാസം', 'സുന്നി വിശ്വാസം', 'ശിയാ വിശ്വാസം', 'സൂഫി വിശ്വാസം',
            'ഇസ്ലാമിക ദർശനം', 'ദൈവീക ജ്ഞാനം', 'ആത്മീയ വിശ്വാസം', 'ധാർമ്മിക വിശ്വാസം', 'ആധ്യാത്മിക വിശ്വാസം'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $title = $titles[array_rand($titles)] . ' - ഭാഗം ' . $i;
            $articles[] = [
                'title' => $title,
                'excerpt' => $title . ' എന്ന വിഷയത്തെക്കുറിച്ചുള്ള വിശദമായ വിശകലനം',
                'body' => $this->generateIslamicContent($title)
            ];
        }

        return $articles;
    }

    private function getCultureArticles(): array
    {
        $articles = [];
        $titles = [
            'ഇസ്ലാമിക സംസ്കാരം', 'മലയാള ഇസ്ലാമിക സംസ്കാരം', 'അറബി സംസ്കാരം', 'പേർഷ്യൻ സംസ്കാരം', 'തുർക്കി സംസ്കാരം',
            'ഇസ്ലാമിക കല', 'ഇസ്ലാമിക സാഹിത്യം', 'ഇസ്ലാമിക സംഗീതം', 'ഇസ്ലാമിക വാസ്തുവിദ്യ', 'ഇസ്ലാമിക ചിത്രകല',
            'ഇസ്ലാമിക ഭാഷ', 'അറബി ഭാഷ', 'ഉർദു ഭാഷ', 'പേർഷ്യൻ ഭാഷ', 'തുർക്കി ഭാഷ',
            'ഇസ്ലാമിക ഉത്സവങ്ങൾ', 'ഈദ് ഉത്സവം', 'ബക്രീദ് ഉത്സവം', 'മുഹറം ഉത്സവം', 'ശബ് ബറത്ത് ഉത്സവം'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $title = $titles[array_rand($titles)] . ' - ഭാഗം ' . $i;
            $articles[] = [
                'title' => $title,
                'excerpt' => $title . ' എന്ന വിഷയത്തെക്കുറിച്ചുള്ള വിശദമായ വിശകലനം',
                'body' => $this->generateIslamicContent($title)
            ];
        }

        return $articles;
    }

    private function getFiqhArticles(): array
    {
        $articles = [];
        $titles = [
            'ഇസ്ലാമിക നിയമം', 'ഹനഫി മദ്ഹബ്', 'മാലികി മദ്ഹബ്', 'ശാഫിഈ മദ്ഹബ്', 'ഹൻബലി മദ്ഹബ്',
            'ഇസ്ലാമിക ആചാരങ്ങൾ', 'നമസ്കാര നിയമങ്ങൾ', 'ഉപവാസ നിയമങ്ങൾ', 'ഹജ്ജ് നിയമങ്ങൾ', 'സകാത്ത് നിയമങ്ങൾ',
            'ഇസ്ലാമിക കുടുംബ നിയമം', 'വിവാഹ നിയമങ്ങൾ', 'വിവാഹമോചന നിയമങ്ങൾ', 'കുട്ടികളുടെ അവകാശങ്ങൾ', 'സ്ത്രീകളുടെ അവകാശങ്ങൾ',
            'ഇസ്ലാമിക വ്യാപാര നിയമം', 'ഇസ്ലാമിക ബാങ്കിംഗ്', 'ഇസ്ലാമിക ഇൻഷുറൻസ്', 'ഇസ്ലാമിക നിക്ഷേപം', 'ഇസ്ലാമിക ധനകാര്യം'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $title = $titles[array_rand($titles)] . ' - ഭാഗം ' . $i;
            $articles[] = [
                'title' => $title,
                'excerpt' => $title . ' എന്ന വിഷയത്തെക്കുറിച്ചുള്ള വിശദമായ വിശകലനം',
                'body' => $this->generateIslamicContent($title)
            ];
        }

        return $articles;
    }

    private function getHistoryArticles(): array
    {
        $articles = [];
        $titles = [
            'ഇസ്ലാമിക ചരിത്രം', 'നബി മുഹമ്മദിന്റെ ചരിത്രം', 'ഖലീഫമാരുടെ ചരിത്രം', 'ഉമ്മയ്യദ് രാജവംശം', 'അബ്ബാസിദ് രാജവംശം',
            'അൻഡാലൂസ് ചരിത്രം', 'ഒട്ടോമൻ സാമ്രാജ്യം', 'മുഗൾ സാമ്രാജ്യം', 'സൽജൂക് സാമ്രാജ്യം', 'സഫാവിദ് സാമ്രാജ്യം',
            'ഇസ്ലാമിക സാമ്രാജ്യങ്ങൾ', 'അറബ് സാമ്രാജ്യം', 'പേർഷ്യൻ സാമ്രാജ്യം', 'തുർക്കി സാമ്രാജ്യം', 'മലയാള ഇസ്ലാമിക ചരിത്രം',
            'ഇസ്ലാമിക പണ്ഡിതന്മാർ', 'ഇസ്ലാമിക ശാസ്ത്രജ്ഞന്മാർ', 'ഇസ്ലാമിക കവികൾ', 'ഇസ്ലാമിക ചിത്രകാരന്മാർ', 'ഇസ്ലാമിക സംഗീതജ്ഞന്മാർ'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $title = $titles[array_rand($titles)] . ' - ഭാഗം ' . $i;
            $articles[] = [
                'title' => $title,
                'excerpt' => $title . ' എന്ന വിഷയത്തെക്കുറിച്ചുള്ള വിശദമായ വിശകലനം',
                'body' => $this->generateIslamicContent($title)
            ];
        }

        return $articles;
    }

    private function getFatwaArticles(): array
    {
        $articles = [];
        $titles = [
            'ഇസ്ലാമിക ഫത്വ', 'ഹനഫി ഫത്വ', 'മാലികി ഫത്വ', 'ശാഫിഈ ഫത്വ', 'ഹൻബലി ഫത്വ',
            'ഇസ്ലാമിക നിയമ വിധികൾ', 'ധാർമ്മിക ഫത്വ', 'സാമൂഹിക ഫത്വ', 'ആരോഗ്യ ഫത്വ', 'വിദ്യാഭ്യാസ ഫത്വ',
            'വ്യാപാര ഫത്വ', 'കുടുംബ ഫത്വ', 'സ്ത്രീകളുടെ ഫത്വ', 'കുട്ടികളുടെ ഫത്വ', 'യുവാക്കളുടെ ഫത്വ',
            'ഇസ്ലാമിക ബാങ്കിംഗ് ഫത്വ', 'ഇസ്ലാമിക ഇൻഷുറൻസ് ഫത്വ', 'ഇസ്ലാമിക നിക്ഷേപ ഫത്വ', 'ഇസ്ലാമിക ധനകാര്യ ഫത്വ', 'ഇസ്ലാമിക സാങ്കേതിക ഫത്വ'
        ];

        for ($i = 1; $i <= 100; $i++) {
            $title = $titles[array_rand($titles)] . ' - ഭാഗം ' . $i;
            $articles[] = [
                'title' => $title,
                'excerpt' => $title . ' എന്ന വിഷയത്തെക്കുറിച്ചുള്ള വിശദമായ വിശകലനം',
                'body' => $this->generateIslamicContent($title)
            ];
        }

        return $articles;
    }

    private function generateIslamicContent($title): string
    {
        $paragraphs = [
            "ഇസ്ലാമിക പഠനങ്ങളുടെ അടിസ്ഥാനത്തിൽ, {$title} എന്ന വിഷയം വളരെ പ്രാധാന്യമർഹിക്കുന്ന ഒന്നാണ്. ഇസ്ലാമിക ധർമ്മത്തിന്റെ അടിസ്ഥാന തത്വങ്ങളുമായി ബന്ധപ്പെട്ട ഈ വിഷയം എല്ലാ മുസ്ലിംകൾക്കും അറിഞ്ഞിരിക്കേണ്ടതാണ്.",
            
            "ഖുർആനിലും ഹദീസിലും ഈ വിഷയത്തെക്കുറിച്ച് വിശദമായി പരാമർശിക്കപ്പെട്ടിരിക്കുന്നു. അല്ലാഹുവിന്റെ പ്രവാചകനായ മുഹമ്മദ് (സ) ഈ വിഷയത്തെക്കുറിച്ച് വിശദമായി വിവരിച്ചിരിക്കുന്നു.",
            
            "ഇസ്ലാമിക പണ്ഡിതന്മാരായ ഇമാമുകൾ ഈ വിഷയത്തെക്കുറിച്ച് വിശദമായ വിശകലനങ്ങൾ നടത്തിയിരിക്കുന്നു. അവരുടെ അഭിപ്രായങ്ങൾ ഇന്നും ഇസ്ലാമിക സമൂഹത്തിൽ പ്രാധാന്യമർഹിക്കുന്നു.",
            
            "ആധുനിക കാലത്ത് ഈ വിഷയത്തിന്റെ പ്രാധാന്യം കൂടുതൽ വർദ്ധിച്ചിരിക്കുന്നു. ഇസ്ലാമിക മൂല്യങ്ങളും ആധുനിക ജീവിതവും തമ്മിലുള്ള ബന്ധം മനസ്സിലാക്കാൻ ഈ വിഷയം സഹായിക്കുന്നു.",
            
            "ഇസ്ലാമിക സമൂഹത്തിൽ ഈ വിഷയത്തിന്റെ പ്രയോഗം വളരെ പ്രാധാന്യമർഹിക്കുന്നു. ദൈനംദിന ജീവിതത്തിൽ ഈ തത്വങ്ങൾ പ്രയോഗിക്കുന്നതിലൂടെ മുസ്ലിംകൾക്ക് ഉത്തമ ജീവിതം നയിക്കാൻ കഴിയും."
        ];

        return implode("\n\n", $paragraphs);
    }
}
