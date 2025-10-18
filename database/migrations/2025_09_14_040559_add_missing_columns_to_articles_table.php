<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->text('excerpt')->nullable()->after('body');
            $table->string('featured_image')->nullable()->after('featured_image_id');
            $table->string('status')->nullable()->after('is_published');
            $table->string('meta_title')->nullable()->after('seo_description');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->boolean('is_featured')->default(false)->after('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn([
                'excerpt',
                'featured_image',
                'status',
                'meta_title',
                'meta_description',
                'is_featured'
            ]);
        });
    }
};
