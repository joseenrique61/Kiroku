<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Acquisition extends Model
{
    protected $fillable = [
        'price',
        'acquired_at',
        'warranty_end_date',
    ];

    public function device(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
