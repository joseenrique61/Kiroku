<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Maintenance extends Model
{
    protected $fillable = [
        'is_preventive',
        'cost',
        'datetime',
        'device_id',
    ];

    public function failure(): HasOne
    {
        return $this->hasOne(Failure::class);
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
