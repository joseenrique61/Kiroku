<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Maintenance extends Model
{
    use HasFactory;
    protected $fillable = [
        'is_preventive',
        'cost',
        'datetime',
        'out_of_service_datetime',
        'device_id',
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
