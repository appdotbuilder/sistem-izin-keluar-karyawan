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
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->foreignId('approver_id')->constrained('employees')->onDelete('cascade');
            $table->enum('status', ['approved', 'rejected']);
            $table->text('notes')->nullable();
            $table->timestamp('approved_at');
            $table->timestamps();
            
            $table->index('permission_id');
            $table->index('approver_id');
            $table->index('status');
            $table->unique(['permission_id', 'approver_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};