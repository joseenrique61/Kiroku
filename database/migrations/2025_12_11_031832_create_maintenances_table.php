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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_preventive')->default(true);
            $table->decimal('cost', 10, 3);
            $table->timestampTz('datetime')->nullable();
            $table->timestampTz('out_of_service_datetime')->useCurrent();
            $table->foreignId('device_id')->constrained('devices');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
