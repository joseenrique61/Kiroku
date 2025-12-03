<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Maintenance extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'is_preventive',
        'cost',
        'datetime',
        'back_to_service_datetime',
        'out_of_service_datetime',
        'device_id',
    ];

    protected $casts = [
        'back_to_service_datetime' => "datetime",
        'out_of_service_datetime' => "datetime",
    ];

    public function failure(): HasOne
    {
        return $this->hasOne(Failure::class);
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }
}
