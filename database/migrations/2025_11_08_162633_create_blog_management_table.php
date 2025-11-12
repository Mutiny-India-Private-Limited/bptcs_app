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
        Schema::create('blog_management', function (Blueprint $table) {
            $table->id();
            $table->string('author')->nullable();
            $table->string('category')->nullable();
            $table->date('pub_date')->nullable();;
            $table->text('heading');
            $table->text('sub_heading')->nullable();
            $table->longText('description');
            $table->string('featured_image')->nullable();
            $table->string('attachment')->nullable();
            $table->enum('status', ['0', '1'])->default('1');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_management');
    }
};
