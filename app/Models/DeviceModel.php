<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceModel extends Model
{
    protected $fillable = [
        'name',
        'device_brand_id'
    ];

    public function deviceBrand() : BelongsTo
    {
        return $this->belongsTo(DeviceBrand::class);
    }

    public function devices() : HasMany
    {
        return $this->hasMany(Device::class);
    }
}
