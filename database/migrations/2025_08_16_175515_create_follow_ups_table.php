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
        Schema::create('follow_ups', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['call', 'email', 'sms', 'meeting', 'other']);
            $table->text('description')->nullable();
            $table->dateTime('scheduled_at');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('outcome')->nullable();
            $table->unsignedBigInteger('followable_id');
            $table->string('followable_type');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follow_ups');
    }
};
