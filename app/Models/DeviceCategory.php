<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceCategory extends Model
{
    protected $fillable = [
        'name'
    ];

    public function device() : HasMany
    {
        return $this->hasMany(Device::class);
    } 
}
