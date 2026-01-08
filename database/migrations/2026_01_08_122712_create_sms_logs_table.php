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

        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number'); // User's mobile number
            $table->string('type')->default('otp'); // Message type
            $table->text('message'); // The message content
            $table->boolean('status')->default(false); // Sent status
            $table->timestamp('sent_at')->nullable(); // When it was sent
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};